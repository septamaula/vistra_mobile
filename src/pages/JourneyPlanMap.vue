<template>
  <q-page class="map-page">

    <!-- SUB HEADER -->
    <div class="map-subheader">
      <q-btn flat round icon="arrow_back" color="white" size="sm" @click="$router.back()" />
      <div class="map-subheader__center">
        <div class="map-subheader__title">JOURNEY PLAN</div>
        <div class="map-subheader__date">{{ dateFormatted }}</div>
      </div>
      <div style="width:36px" />
    </div>

    <!-- MAP CONTAINER -->
    <div class="map-wrapper">
      <!-- Top Info bar -->
      <div class="map-infobar">
        <span class="map-infobar__text">
          {{ outlets.length }} Outlet &bull; Est. {{ totalKm }} km
        </span>
        <div class="map-infobar__actions">
          <q-btn
            unelevated no-caps dense
            color="deep-purple-7"
            icon="auto_awesome"
            label="AI Optimize"
            class="ai-bar-btn"
            :loading="optimizing"
            @click="doOptimize"
          />
          <q-btn
            flat round dense
            icon="my_location"
            color="red-8"
            size="sm"
            @click="centerMap"
          />
        </div>
      </div>

      <!-- Leaflet map -->
      <div id="map-canvas" ref="mapEl" class="map-canvas"></div>

      <!-- Loading overlay -->
      <div v-if="loading" class="map-overlay-loading">
        <q-spinner-dots color="red-8" size="44px" />
      </div>
    </div>

    <!-- NEXT STOP PANEL -->
    <div class="next-stop-panel" v-if="nextStop">
      <div class="next-stop-panel__header">
        <span class="next-stop-panel__label">Next Stop</span>
        <q-btn flat round dense icon="close" size="xs" color="grey-6" @click="nextStop = null" />
      </div>
      <div class="next-stop-panel__name">{{ nextStop.nama }}</div>
      <div class="next-stop-panel__addr">{{ nextStop.alamat }}</div>
      <q-btn
        label="Mulai Kunjungan"
        unelevated no-caps
        class="next-stop-panel__btn full-width"
        @click="startVisit"
      />
    </div>
    <div v-else class="next-stop-placeholder" />

    <!-- GOOGLE MAPS IFRAME DIALOG -->
    <q-dialog
      v-model="showGMapModal"
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="gmap-dialog-card flex column no-wrap">
        <!-- Dialog Header -->
        <div class="gmap-dialog-header">
          <q-btn flat round icon="arrow_back" color="white" size="sm" v-close-popup />
          <div class="gmap-dialog-header__title">
            <div class="title-main">NAVIGASI GOOGLE MAPS</div>
            <div class="title-sub" v-if="nextStop">{{ nextStop.nama }}</div>
          </div>
          <q-btn flat round icon="close" color="white" size="sm" v-close-popup />
        </div>

        <!-- iFrame Container -->
        <div class="gmap-iframe-container">
          <iframe
            v-if="gmapEmbedUrl"
            :src="gmapEmbedUrl"
            width="100%"
            height="100%"
            style="border:0;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <!-- Bottom Action Bar -->
        <div class="gmap-dialog-footer">
          <div class="row q-col-gutter-xs">
            <div class="col-5">
              <q-btn
                label="Navigasi Suara"
                icon="navigation"
                unelevated no-caps no-wrap
                class="gmap-voice-btn full-width"
                @click="openNativeAppNav"
              />
            </div>
            <div class="col-7">
              <q-btn
                label="Lanjut Check-In"
                icon-right="arrow_forward"
                unelevated no-caps no-wrap
                class="gmap-checkin-btn full-width"
                @click="proceedToVisit"
              />
            </div>
          </div>
        </div>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from '../boot/axios'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix Leaflet default icon path issue with Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const route    = useRoute()
const router   = useRouter()
const $q       = useQuasar()
const mapEl    = ref(null)

const headerId    = computed(() => route.params.header_id)
const loading     = ref(true)
const optimizing  = ref(false)
const outlets     = ref([])
const kantor      = ref(null)
const totalKm     = ref(0)
const dateFormatted = ref('')
const nextStop    = ref(null)

const showGMapModal = ref(false)
const gmapEmbedUrl  = ref('')

let mapInstance = null
let markers     = []
let polyline    = null

// ── Fetch map data ──────────────────────────────────────────
async function fetchMapData () {
  loading.value = true
  try {
    const res = await api.get(`/map/${headerId.value}`)
    if (res.data.success) {
      outlets.value   = res.data.outlets
      kantor.value    = res.data.kantor
      totalKm.value   = res.data.total_km
      const d = res.data.date
      dateFormatted.value = d ? new Date(d).toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      }) : ''

      // Set first unvisited as next stop, or fallback to first outlet
      const unvisited = outlets.value.filter(o => o.status === 'Planned' || o.status === 'planned' || o.status === 'Pending' || o.status === 'pending')
      nextStop.value = unvisited[0] ?? outlets.value[0] ?? null

      await nextTick()
      renderMap()
    }
  } catch {
    $q.notify({ type: 'negative', message: 'Gagal memuat data peta', position: 'top' })
  } finally {
    loading.value = false
  }
}

// ── Render Leaflet map ──────────────────────────────────────
function renderMap () {
  if (!mapEl.value) return

  // Destroy previous instance
  if (mapInstance) {
    mapInstance.remove()
    mapInstance = null
    markers = []
    polyline = null
  }

  mapInstance = L.map(mapEl.value, {
    zoomControl: true,
    attributionControl: false,
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
  }).addTo(mapInstance)

  const points = []

  // Kantor marker (blue)
  if (kantor.value?.lat && kantor.value?.lng) {
    const kantorIcon = L.divIcon({
      html: `<div style="
        width:32px;height:32px;background:#1565c0;border-radius:50%;
        display:flex;align-items:center;justify-content:center;
        border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.4);
        font-size:14px;
      ">🏢</div>`,
      className: '',
      iconAnchor: [16, 16],
    })
    L.marker([kantor.value.lat, kantor.value.lng], { icon: kantorIcon })
      .addTo(mapInstance)
      .bindPopup(`<b>${kantor.value.nama}</b><br>Titik Berangkat`)
    points.push([kantor.value.lat, kantor.value.lng])
  }

  // Outlet markers
  outlets.value.forEach((o) => {
    if (!o.lat || !o.lng) return

    const color    = statusColor(o.status)
    const numIcon  = L.divIcon({
      html: `<div style="
        width:30px;height:30px;background:${color};border-radius:50%;
        display:flex;align-items:center;justify-content:center;
        border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.35);
        color:#fff;font-weight:800;font-size:12px;
      ">${o.urutan}</div>`,
      className: '',
      iconAnchor: [15, 15],
    })

    const marker = L.marker([o.lat, o.lng], { icon: numIcon })
      .addTo(mapInstance)
      .bindPopup(`<b>${o.nama}</b><br>${o.alamat}<br><small>${o.status}</small>`)

    marker.on('click', () => {
      nextStop.value = o
    })

    markers.push(marker)
    points.push([o.lat, o.lng])
  })

  // Draw route polyline using OSRM real road geometry
  if (points.length > 1) {
    const coordsQuery = points.map(p => `${p[1]},${p[0]}`).join(';')
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coordsQuery}?overview=full&geometries=geojson`

    fetch(osrmUrl)
      .then(res => res.json())
      .then(data => {
        if (data.code === 'Ok' && data.routes && data.routes[0]) {
          const routeCoords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]])
          polyline = L.polyline(routeCoords, {
            color: '#1565c0',
            weight: 4,
            opacity: 0.85,
          }).addTo(mapInstance)

          mapInstance.fitBounds(polyline.getBounds(), { padding: [40, 40] })

          if (data.routes[0].distance) {
            totalKm.value = (data.routes[0].distance / 1000).toFixed(1)
          }
        } else {
          // Fallback if OSRM fails
          polyline = L.polyline(points, { color: '#1565c0', weight: 3, opacity: 0.7, dashArray: '6, 6' }).addTo(mapInstance)
          mapInstance.fitBounds(polyline.getBounds(), { padding: [40, 40] })
        }
      })
      .catch(() => {
        // Fallback if fetch fails
        polyline = L.polyline(points, { color: '#1565c0', weight: 3, opacity: 0.7, dashArray: '6, 6' }).addTo(mapInstance)
        mapInstance.fitBounds(polyline.getBounds(), { padding: [40, 40] })
      })
  } else if (points.length === 1) {
    mapInstance.setView(points[0], 14)
  } else {
    mapInstance.setView([-6.2, 106.8], 12)
  }
}

function statusColor (status) {
  const s = (status || '').toLowerCase()
  if (s === 'visited' || s === 'selesai') return '#2e7d32'
  if (s === 'pending' || s === 'tertunda') return '#e65100'
  if (s === 'skip' || s === 'tutup')       return '#b71c1c'
  return '#c0152a' // Planned
}

function centerMap () {
  if (!mapInstance) return
  if (polyline) {
    mapInstance.fitBounds(polyline.getBounds(), { padding: [40, 40] })
  }
}

// ── AI Optimize ─────────────────────────────────────────────
async function doOptimize () {
  optimizing.value = true
  try {
    const res = await api.post(`/map/${headerId.value}/optimize`)
    if (res.data.success) {
      $q.notify({ type: 'positive', message: res.data.message, position: 'top', timeout: 3000 })
      await fetchMapData()
    } else {
      $q.notify({ type: 'warning', message: res.data.message, position: 'top' })
    }
  } catch {
    $q.notify({ type: 'negative', message: 'Gagal optimasi rute', position: 'top' })
  } finally {
    optimizing.value = false
  }
}

// ── In-App GMap Driving Navigation Mode ───────────────────────
function startVisit () {
  if (!nextStop.value) return

  const lat = nextStop.value.lat
  const lng = nextStop.value.lng

  if (lat && lng) {
    // Mode Perjalanan / Driving Navigation Mode (seperti Waze/GMap Navigasi)
    gmapEmbedUrl.value  = `https://maps.google.com/maps?saddr=My+Location&daddr=${lat},${lng}&dirflg=d&output=embed`
    showGMapModal.value = true
  } else {
    proceedToVisit()
  }
}

function openNativeAppNav () {
  if (!nextStop.value?.lat || !nextStop.value?.lng) return
  const lat = nextStop.value.lat
  const lng = nextStop.value.lng
  // Buka aplikasi Google Maps / Waze untuk navigasi suara langsung
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`
  window.open(url, '_blank')
}

function proceedToVisit () {
  showGMapModal.value = false
  if (nextStop.value?.plan_id) {
    router.push(`/visit/${nextStop.value.plan_id}`)
  }
}

onMounted(() => fetchMapData())
onUnmounted(() => { if (mapInstance) { mapInstance.remove(); mapInstance = null } })
</script>

<style lang="scss" scoped>

.map-page {
  background: #f2f2f2;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 118px);
  overflow: hidden;
}

/* SUB HEADER */
.map-subheader {
  background: linear-gradient(180deg, #350007 0%, #7a000e 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  flex-shrink: 0;
}

.map-subheader__center { text-align: center; }

.map-subheader__title {
  font-size: 14px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 1.5px;
}

.map-subheader__date {
  font-size: 10px;
  color: rgba(255,255,255,0.6);
  margin-top: 1px;
}

/* MAP WRAPPER */
.map-wrapper {
  position: relative;
  flex: 1;
  min-height: 0;
}

.map-infobar {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  z-index: 1000;
  background: #fff;
  border-radius: 12px;
  padding: 6px 8px 6px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 12px rgba(0,0,0,0.15);
}

.map-infobar__text {
  font-size: 12.5px;
  font-weight: 700;
  color: #1a1a1a;
}

.map-infobar__actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ai-bar-btn {
  font-size: 11px;
  font-weight: 700;
  border-radius: 8px;
  padding: 2px 8px;
}

.map-canvas {
  width: 100%;
  height: 100%;
  z-index: 1;
}

.map-overlay-loading {
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

/* NEXT STOP PANEL */
.next-stop-panel {
  background: #fff;
  padding: 10px 14px 14px;
  flex-shrink: 0;
  border-top: 1px solid #f0f0f0;
  z-index: 10;
  box-shadow: 0 -4px 16px rgba(0,0,0,0.08);
}

.next-stop-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
}

.next-stop-panel__label {
  font-size: 10.5px;
  color: #aaa;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.next-stop-panel__name {
  font-size: 15px;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 2px;
}

.next-stop-panel__addr {
  font-size: 11px;
  color: #888;
  margin-bottom: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.next-stop-panel__btn {
  background: #c0152a !important;
  color: #fff !important;
  border-radius: 10px;
  height: 42px;
  font-size: 13.5px;
  font-weight: 700;
}

.next-stop-placeholder {
  height: 10px;
  background: #fff;
  flex-shrink: 0;
}

/* GMAP IFRAME DIALOG */
.gmap-dialog-card {
  background: #111;
  height: 100vh;
  width: 100vw;
}

.gmap-dialog-header {
  background: linear-gradient(180deg, #1a0208 0%, #7a000e 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  color: #fff;
}

.gmap-dialog-header__title {
  text-align: center;
}

.title-main {
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 1px;
}

.title-sub {
  font-size: 11px;
  color: rgba(255,255,255,0.7);
  margin-top: 1px;
}

.gmap-iframe-container {
  flex: 1;
  width: 100%;
  height: 100%;
  background: #e5e3df;
}

.gmap-dialog-footer {
  padding: 12px 16px;
  background: #fff;
  border-top: 1px solid #eee;
}

.gmap-voice-btn {
  background: #16a34a !important;
  color: #fff !important;
  height: 44px;
  border-radius: 10px;
  font-size: 12.5px;
  font-weight: 700;
}

.gmap-checkin-btn {
  background: #c0152a !important;
  color: #fff !important;
  height: 44px;
  border-radius: 10px;
  font-size: 12.5px;
  font-weight: 700;
}
</style>
