<template>
  <q-page class="bg-grey-1 relative-position" style="height: calc(100vh - 50px); overflow: hidden;">
    
    <!-- Header with Back Button -->
    <div class="q-pa-md" style="position: absolute; top: 0; left: 0; right: 0; z-index: 1001;">
      <q-btn 
        round 
        icon="arrow_back" 
        color="white" 
        text-color="dark" 
        class="shadow-3"
        @click="$router.push('/journey-plan')" 
      />
    </div>

    <!-- Map Area (Takes entire screen) -->
    <div class="map-container absolute-full bg-grey-3" style="z-index: 1;">
      <div id="leaflet-map" style="height: 100%; width: 100%;"></div>
    </div>

    <!-- Bottom Sheet / Outlet Details Card -->
    <div class="absolute-bottom bg-white q-pa-md shadow-up-3" style="border-top-left-radius: 24px; border-top-right-radius: 24px; z-index: 1000;">
      
      <!-- Drag Handle Placeholder -->
      <div class="flex flex-center q-mb-xs">
        <div style="width: 40px; height: 5px; background: #e0e0e0; border-radius: 10px;"></div>
      </div>

      <!-- Outlet Info Header -->
      <div class="flex justify-between items-start q-mb-xs">
        <div>
          <q-badge :color="badgeStatusColor" rounded class="q-px-sm py-xs text-weight-bold q-mb-xs">
            {{ badgeStatusText }}
          </q-badge>
          <h6 class="text-h6 text-weight-bolder text-dark q-my-none" style="line-height: 1.2;">{{ outletName }}</h6>
        </div>
        <div class="text-right">
          <div class="text-subtitle1 text-weight-bolder text-primary q-my-none">{{ distanceText }}</div>
          <div class="text-caption text-grey-6" style="font-size: 10.5px;">~5 menit</div>
        </div>
      </div>

      <div class="text-caption text-grey-7 q-mb-sm flex items-start" style="line-height: 1.3;">
        <q-icon name="location_on" size="14px" color="red-8" class="q-mr-xs q-mt-xs flex-shrink-0" />
        <div>{{ outletAddr }}</div>
      </div>

      <!-- Coverage Area Status Card (Radius 100m) -->
      <div 
        class="q-pa-sm rounded-borders q-mb-sm flex items-center justify-between"
        :class="isInsideArea ? 'bg-green-1 border-green' : 'bg-orange-1 border-orange'"
      >
        <div class="flex items-center">
          <q-icon 
            :name="isInsideArea ? 'check_circle' : 'location_off'" 
            :color="isInsideArea ? 'positive' : 'warning'" 
            size="24px" 
            class="q-mr-sm" 
          />
          <div>
            <div class="text-weight-bold" :class="isInsideArea ? 'text-green-9' : 'text-orange-10'" style="font-size: 12px;">
              {{ isInsideArea ? 'Anda berada di dalam area outlet' : 'Anda berada di luar area outlet' }}
            </div>
            <div class="text-caption" :class="isInsideArea ? 'text-green-8' : 'text-orange-9'" style="font-size: 10.5px;">
              {{ isCheckedOut ? 'Kunjungan telah selesai (Check-Out)' : (isCheckedIn ? 'Check-in berhasil • 09:15 WIB' : (isInsideArea ? 'Radius coverage 100m • Siap Check-in' : `Jarak Anda: ${currentDistanceMeters}m (Max: 100m)`)) }}
            </div>
          </div>
        </div>

        <!-- GPS Real Location & Simulation Toggle -->
        <q-chip 
          clickable 
          dense 
          outline 
          :color="isInsideArea ? 'positive' : 'warning'" 
          size="xs" 
          class="text-weight-bold"
          @click="toggleGpsLocation"
        >
          {{ isRealGps ? 'GPS Real' : (isInsideArea ? 'GPS Simulasi (15m)' : 'GPS Simulasi (1.2km)') }}
        </q-chip>
      </div>

      <!-- Single Main Action Button -->
      <q-btn 
        v-if="isCheckedOut"
        label="LIHAT HISTORY VISIT" 
        icon="history"
        color="positive" 
        class="full-width text-weight-bold shadow-2 q-mb-sm" 
        height="46px"
        rounded 
        unelevated
        no-caps
        @click="proceedToVisit"
      />
      <q-btn 
        v-else-if="isCheckedIn"
        label="LANJUTKAN VISIT" 
        icon="login"
        color="red-9" 
        class="full-width text-weight-bold shadow-2 q-mb-sm" 
        height="46px"
        rounded 
        unelevated
        no-caps
        @click="proceedToVisit"
      />
      <q-btn 
        v-else
        label="CHECK-IN & MULAI VISIT" 
        icon="login"
        color="red-9" 
        class="full-width text-weight-bold shadow-2 q-mb-sm" 
        height="46px"
        rounded 
        unelevated
        no-caps
        :loading="isCheckingIn"
        @click="doCheckin"
      />

      <!-- Progress Kunjungan Bar -->
      <div class="q-mt-xs">
        <div class="flex justify-between text-caption text-weight-bold q-mb-xs" style="font-size: 11px;">
          <span class="text-grey-8">Progress Kunjungan</span>
          <span class="text-primary">1 / 4 Outlet (25%)</span>
        </div>
        <q-linear-progress :value="0.25" color="positive" track-color="grey-3" style="height: 6px; border-radius: 3px;" />
      </div>

    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from '../boot/axios'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const route  = useRoute()
const router = useRouter()
const $q     = useQuasar()

// Leaflet Default Icon fix
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

let map = null
let circleRadius = null
let currentMarker = null

const outletName = computed(() => route.query.outlet_name || 'Cabang Outlet Cidodol')
const outletAddr = computed(() => route.query.outlet_addr || 'Jl. Cidodol No. 12, Kebayoran Lama, Jakarta Selatan')
const visitId    = computed(() => route.query.visit_id || route.params.id || '1')

const isCheckingIn = ref(false)
const isInsideArea = ref(true)
const isCheckedIn  = ref(false)
const isCheckedOut = ref(false)
const isRealGps    = ref(false)

const outletCoordinates = [-6.2378, 106.7825] // Outlet Location (Cidodol)
const userCoordinates   = ref([-6.2379, 106.7826]) // Current User GPS Coordinates

const currentDistanceMeters = computed(() => {
  const [lat1, lon1] = userCoordinates.value
  const [lat2, lon2] = outletCoordinates
  return calculateDistanceMeters(lat1, lon1, lat2, lon2)
})

const distanceText = computed(() => {
  const m = currentDistanceMeters.value
  if (m < 1000) return `${m} m`
  return `${(m / 1000).toFixed(1)} km`
})

const badgeStatusColor = computed(() => {
  if (isCheckedOut.value) return 'positive'
  if (isCheckedIn.value) return 'info'
  return 'warning'
})

const badgeStatusText = computed(() => {
  if (isCheckedOut.value) return 'Completed'
  if (isCheckedIn.value) return 'Checked-in'
  return 'Pending'
})

function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000 // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c)
}

function requestRealGps() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        isRealGps.value = true
        userCoordinates.value = [pos.coords.latitude, pos.coords.longitude]
        isInsideArea.value = currentDistanceMeters.value <= 100
        if (map) initMap()
      },
      (err) => {
        console.warn('Real GPS Error / Permission Denied:', err)
        isRealGps.value = false
        // Fallback to simulated location inside 100m
        userCoordinates.value = [-6.2379, 106.7826]
        isInsideArea.value = true
        if (map) initMap()
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    )
  }
}

function toggleGpsLocation() {
  isRealGps.value = false
  if (isInsideArea.value) {
    // Switch to Outside Area (1.2 km)
    isInsideArea.value = false
    userCoordinates.value = [-6.2470, 106.7910]
  } else {
    // Switch to Inside Area (15 meters)
    isInsideArea.value = true
    userCoordinates.value = [-6.2379, 106.7826]
  }
  if (map) initMap()
}

const initMap = () => {
  const outletLoc = outletCoordinates
  const salesLoc  = userCoordinates.value

  if (map) {
    map.remove()
  }

  map = L.map('leaflet-map', { zoomControl: false }).setView(outletLoc, 16)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(map)

  // 100 Meter Coverage Circle Radius
  circleRadius = L.circle(outletLoc, {
    color: '#2e7d32',
    fillColor: '#4caf50',
    fillOpacity: 0.2,
    radius: 100,
    weight: 2,
    dashArray: '5, 5'
  }).addTo(map)

  // Outlet Marker
  L.marker(outletLoc).addTo(map).bindPopup(`<b>${outletName.value}</b><br>Radius Area Coverage: 100m`).openPopup()

  // Cute Sales Person DivIcon Marker 🚶‍♂️
  const cuteSalesIcon = L.divIcon({ 
    html: `
      <div style="
        position: relative;
        width: 44px;
        height: 44px;
        background: linear-gradient(135deg, #ff416c, #ff4b2b);
        border: 3px solid #ffffff;
        border-radius: 50%;
        box-shadow: 0 4px 14px rgba(255, 65, 108, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        cursor: pointer;
      ">
        🚶‍♂️
        <div style="
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 7px solid #ff4b2b;
        "></div>
      </div>
    `, 
    className: 'cute-sales-marker', 
    iconSize: [44, 44],
    iconAnchor: [22, 48],
    popupAnchor: [0, -45]
  })

  currentMarker = L.marker(salesLoc, { icon: cuteSalesIcon }).addTo(map).bindPopup(`<b>Lokasi Sales</b><br>Jarak: ${distanceText.value}`)

  // Fit Bounds
  const group = L.featureGroup([circleRadius, currentMarker])
  map.fitBounds(group.getBounds(), { padding: [40, 40] })
}

async function fetchRealVisitStatus() {
  try {
    const res = await api.get(`/visits/${visitId.value}`)
    if (res.data.success && res.data.data) {
      const v = res.data.data
      const status = (v.status_visit || '').toLowerCase()
      if (status === 'completed' || status === 'checkout' || status === 'closed' || status === 'no order') {
        isCheckedOut.value = true
        isCheckedIn.value  = true
      } else if (status === 'check-in' || status === 'visited' || status === 'checked-in') {
        isCheckedIn.value  = true
      }
    }
  } catch (e) {
    console.error('Fetch visit status error:', e)
  }
}

async function doCheckin() {
  if (!isInsideArea.value) {
    $q.notify({
      type: 'warning',
      icon: 'gpp_bad',
      message: 'Di Luar Coverage Area!',
      caption: `Anda berjarak ${currentDistanceMeters.value}m dari outlet. Harus berada dalam radius 100m.`,
      position: 'top'
    })
    return
  }

  isCheckingIn.value = true
  try {
    const res = await api.post('/visits/checkin', {
      PLAN_ID: route.query.plan_id || route.params.id,
      LATITUDE: userCoordinates.value[0],
      LONGITUDE: userCoordinates.value[1]
    })
    if (res.data.success) {
      isCheckedIn.value = true
      $q.notify({
        type: 'positive',
        icon: 'check_circle',
        message: 'Check-in Berhasil!',
        caption: 'Anda berada di dalam radius 100m area outlet.',
        position: 'top',
        timeout: 2000
      })
      proceedToVisit()
    } else {
      isCheckedIn.value = true
      proceedToVisit()
    }
  } catch {
    isCheckedIn.value = true
    proceedToVisit()
  } finally {
    isCheckingIn.value = false
  }
}

function proceedToVisit() {
  router.push({
    path: `/visit/${visitId.value}`,
    query: {
      outlet_name: outletName.value,
      outlet_addr: outletAddr.value
    }
  })
}

onMounted(() => {
  const statusQuery = (route.query.status || '').toLowerCase()
  if (statusQuery === 'completed' || statusQuery === 'checkout' || statusQuery === 'closed' || statusQuery === 'selesai' || statusQuery === 'no order' || statusQuery === 'no-order') {
    isCheckedOut.value = true
    isCheckedIn.value  = true
  } else if (statusQuery === 'visited' || statusQuery === 'checked-in' || statusQuery === 'check-in') {
    isCheckedIn.value  = true
  }

  fetchRealVisitStatus()
  requestRealGps()

  setTimeout(() => {
    initMap()
    setTimeout(() => {
      if (map) map.invalidateSize()
    }, 100)
  }, 300)
})

onBeforeUnmount(() => {
  if (map) map.remove()
})
</script>

<style scoped>
:deep(.cute-sales-marker) {
  background: transparent;
  border: none;
}
.shadow-up-3 {
  box-shadow: 0 -4px 20px rgba(0,0,0,0.08);
}
.border-green {
  border: 1px solid #a5d6a7;
}
.border-orange {
  border: 1px solid #ffe0b2;
}
</style>
