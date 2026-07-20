<template>
  <q-page class="bg-grey-1" style="min-height: 100vh;">
    <!-- Header -->
    <div class="bg-white shadow-1 q-pa-md sticky-top" style="z-index: 1000; position: relative;">
      <div class="flex items-center">
        <q-btn flat round icon="arrow_back" color="dark" @click="$router.push('/dashboard')" />
        <div class="q-ml-sm">
          <h6 class="text-h6 text-weight-bolder text-dark q-my-none">Peta Rute Kunjungan</h6>
          <div class="text-caption text-grey-6">{{ header ? header.TGL_PLAN : 'Memuat...' }}</div>
        </div>
        <q-space />
        <q-btn 
          outline 
          color="primary" 
          icon="route" 
          label="Best Route" 
          size="sm" 
          rounded 
          class="text-weight-bold"
          @click="optimizeRoute"
          :loading="optimizing"
          v-if="header && header.plans && header.plans.length > 1"
        />
      </div>
    </div>

    <!-- Map Area -->
    <div class="map-container relative-position bg-grey-3" style="height: 40vh; width: 100%;">
      <div id="leaflet-map" style="height: 100%; width: 100%;"></div>
      
      <!-- Overlay Loading -->
      <div v-if="loading" class="absolute-full flex flex-center bg-white" style="opacity: 0.8; z-index: 400;">
        <q-spinner-dots color="primary" size="40px" />
      </div>
    </div>

    <!-- List Outlets -->
    <div class="q-pa-md list-area bg-grey-1">
      <div class="text-subtitle2 text-weight-bold text-grey-7 q-mb-md">
        Urutan Kunjungan ({{ header?.plans?.length || 0 }} Outlet)
      </div>

      <div class="q-gutter-y-md" v-if="header && header.plans">
        <q-card 
          v-for="(plan, index) in header.plans" 
          :key="plan.PLAN_ID" 
          flat 
          class="bg-white q-pa-sm log-card border-left-status"
          :class="plan.STATUS === 'Visited' ? 'border-success' : 'border-primary'"
        >
          <q-item>
            <q-item-section avatar>
              <q-avatar 
                :color="plan.STATUS === 'Visited' ? 'positive' : 'blue-1'" 
                :text-color="plan.STATUS === 'Visited' ? 'white' : 'primary'" 
                size="42px"
                class="text-weight-bold"
              >
                {{ plan.STATUS === 'Visited' ? '✔' : (index + 1) }}
              </q-avatar>
            </q-item-section>
            
            <q-item-section>
              <q-item-label class="text-weight-bold text-dark text-body1">
                {{ plan.outlet ? plan.outlet.NAMA_OUTLET : 'Unknown' }}
              </q-item-label>
              <q-item-label caption lines="2" class="text-grey-6 q-mt-xs">
                <q-icon name="place" /> {{ plan.outlet ? plan.outlet.ALAMAT : '-' }}
              </q-item-label>
              <q-item-label v-if="plan.STATUS === 'Visited'" caption class="text-positive q-mt-xs text-weight-bold">
                Check-in: {{ formatTime(plan.ESTIMASI_JAM) || 'Selesai' }}
              </q-item-label>
            </q-item-section>
            
            <q-item-section side v-if="plan.STATUS !== 'Visited'">
              <q-btn 
                color="primary" 
                label="Check In" 
                rounded 
                unelevated 
                size="sm"
                class="text-weight-bold q-px-sm"
                @click="checkIn(plan)"
                :loading="checkingIn === plan.PLAN_ID"
              />
            </q-item-section>
            <q-item-section side v-else-if="plan.visit">
              <q-btn 
                outline
                color="positive" 
                label="Buka UI Baru" 
                rounded 
                size="sm"
                class="text-weight-bold q-px-sm"
                @click="$router.push(`/visit/${plan.visit.VISIT_ID}`)"
              />
            </q-item-section>
          </q-item>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import axios from 'axios'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix Leaflet Default Icon issue in Vue/Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const api = axios.create({ baseURL: 'http://sales.test/api/mobile' })
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sales_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

const loading = ref(true)
const optimizing = ref(false)
const checkingIn = ref(null)
const header = ref(null)

let map = null
let markers = []
let polyline = null

const loadData = async () => {
  try {
    const res = await api.get(`/journey-plans/${route.params.id}`)
    if (res.data.success) {
      header.value = res.data.data
      drawMap()
    }
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Gagal memuat detail journey.' })
  } finally {
    loading.value = false
  }
}

const drawMap = () => {
  if (!map) {
    map = L.map('leaflet-map').setView([-6.200000, 106.816666], 12)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)
  }

  // Clear existing
  markers.forEach(m => map.removeLayer(m))
  markers = []
  if (polyline) map.removeLayer(polyline)

  const latlngs = []

  if (header.value && header.value.plans) {
    header.value.plans.forEach((plan, index) => {
      const lat = parseFloat(plan.outlet?.LATITUDE)
      const lng = parseFloat(plan.outlet?.LONGITUDE)

      if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
        const coord = [lat, lng]
        latlngs.push(coord)
        
        // Custom numbered icon
        const iconHtml = `<div style="background-color: ${plan.STATUS === 'Visited' ? '#21ba45' : '#1976D2'}; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${plan.STATUS === 'Visited' ? '✔' : (index + 1)}</div>`
        const icon = L.divIcon({ html: iconHtml, className: 'custom-div-icon', iconSize: [24, 24], iconAnchor: [12, 12] })
        
        const marker = L.marker(coord, { icon }).addTo(map)
        marker.bindPopup(`<b>${plan.outlet.NAMA_OUTLET}</b><br/>Status: ${plan.STATUS}`)
        markers.push(marker)
      }
    })
  }

  // Draw lines
  if (latlngs.length > 1) {
    polyline = L.polyline(latlngs, { color: '#1976D2', weight: 4, opacity: 0.6, dashArray: '10, 10' }).addTo(map)
    map.fitBounds(polyline.getBounds(), { padding: [30, 30] })
  } else if (latlngs.length === 1) {
    map.setView(latlngs[0], 15)
  }
}

// Simple nearest neighbor sorting based on coordinates
const optimizeRoute = async () => {
  optimizing.value = true
  try {
    let plans = [...header.value.plans]
    
    // We separate visited vs unvisited to only sort unvisited
    const visited = plans.filter(p => p.STATUS === 'Visited')
    let unvisited = plans.filter(p => p.STATUS !== 'Visited')
    
    if (unvisited.length > 1) {
      // Mock Start Point (Sales Current Location). If none, use first unvisited.
      let currentLoc = unvisited[0]
      const sortedUnvisited = [currentLoc]
      unvisited = unvisited.filter(p => p.PLAN_ID !== currentLoc.PLAN_ID)

      while (unvisited.length > 0) {
        // find closest to currentLoc
        let closestIdx = 0
        let minDist = Infinity
        
        unvisited.forEach((p, i) => {
          const lat1 = parseFloat(currentLoc.outlet?.LATITUDE || 0)
          const lon1 = parseFloat(currentLoc.outlet?.LONGITUDE || 0)
          const lat2 = parseFloat(p.outlet?.LATITUDE || 0)
          const lon2 = parseFloat(p.outlet?.LONGITUDE || 0)
          
          // Euclidean dist approximation
          const dist = Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2)
          if (dist < minDist) {
            minDist = dist
            closestIdx = i
          }
        })

        currentLoc = unvisited[closestIdx]
        sortedUnvisited.push(currentLoc)
        unvisited.splice(closestIdx, 1)
      }
      
      // Combine back
      const newPlans = [...visited, ...sortedUnvisited]
      header.value.plans = newPlans

      // Map back to PLAN_IDs
      const orderedIds = newPlans.map(p => p.PLAN_ID)

      await api.post(`/journey-plans/${route.params.id}/optimize`, { ordered_plan_ids: orderedIds })
      $q.notify({ type: 'positive', message: 'Rute berhasil dioptimasi dengan jarak terdekat!' })
      
      drawMap()
    } else {
      $q.notify({ type: 'info', message: 'Tidak ada cukup outlet untuk dioptimasi.' })
    }
  } catch (e) {
    console.error(e)
    $q.notify({ type: 'negative', message: 'Gagal mengoptimasi rute.' })
  } finally {
    optimizing.value = false
  }
}

const checkIn = async (plan) => {
  checkingIn.value = plan.PLAN_ID
  
  if (!navigator.geolocation) {
    $q.notify({ type: 'warning', message: 'Geolokasi tidak didukung oleh browser Anda.' })
    executeCheckIn(plan, null, null)
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      executeCheckIn(plan, position.coords.latitude, position.coords.longitude)
    },
    (err) => {
      console.warn('GPS Error: ', err.message)
      $q.notify({ type: 'warning', message: 'Gagal mendeteksi lokasi GPS.' })
      executeCheckIn(plan, null, null)
    },
    { enableHighAccuracy: true, timeout: 5000 }
  )
}

const executeCheckIn = async (plan, lat, lng) => {
  try {
    const res = await api.post(`/visits/checkin`, {
      PLAN_ID: plan.PLAN_ID,
      LATITUDE: lat,
      LONGITUDE: lng
    })
    
    if (res.data.success) {
      $q.notify({ type: 'positive', message: 'Berhasil Check In!', icon: 'check_circle' })
      router.push(`/visit/${res.data.visit_id}`)
    }
  } catch (e) {
    console.error(e)
    $q.notify({ type: 'negative', message: 'Gagal Check In.' })
  } finally {
    checkingIn.value = null
  }
}

const formatTime = (timeString) => {
  if (!timeString) return ''
  // Handle both time-only and ISO string
  if (timeString.includes('T')) {
    const d = new Date(timeString)
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  }
  return timeString.substring(0, 5) // HH:mm
}

onMounted(() => {
  loadData()
})

onBeforeUnmount(() => {
  if (map) {
    map.remove()
  }
})
</script>

<style lang="scss" scoped>
.sticky-top {
  position: sticky;
  top: 0;
}
.log-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03) !important;
  border-right: 1px solid #f0f0f0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}
.border-left-status {
  border-left-width: 4px;
  border-left-style: solid;
}
.border-primary {
  border-left-color: var(--q-primary);
}
.border-success {
  border-left-color: #21ba45;
}
:deep(.custom-div-icon) {
  background: transparent;
  border: none;
}
</style>
