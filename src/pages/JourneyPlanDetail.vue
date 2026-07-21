<template>
  <q-page class="bg-grey-1 relative-position" style="height: calc(100vh - 50px); overflow: hidden;">
    
    <!-- Transparent Header overlapping map -->
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

    <!-- Bottom Sheet / Outlet Details (Overlay at bottom) -->
    <div class="absolute-bottom bg-white q-pa-md shadow-up-3" style="border-top-left-radius: 24px; border-top-right-radius: 24px; z-index: 1000;">
      
      <!-- Drag Handle Placeholder -->
      <div class="flex flex-center q-mb-md">
        <div style="width: 40px; height: 5px; background: #e0e0e0; border-radius: 10px;"></div>
      </div>

      <div class="flex justify-between items-start q-mb-sm">
        <div>
          <q-badge color="warning" rounded class="q-px-sm py-xs text-weight-bold q-mb-xs">Pending</q-badge>
          <h5 class="text-h5 text-weight-bolder text-dark q-my-none">{{ outletName }}</h5>
        </div>
        <div class="text-right">
          <div class="text-h5 text-weight-bolder text-primary q-my-none">1.2 km</div>
          <div class="text-caption text-grey-6">~5 menit</div>
        </div>
      </div>

      <div class="text-body2 text-grey-7 q-mb-lg flex items-start">
        <q-icon name="location_on" size="18px" class="q-mr-xs text-primary q-mt-xs" />
        <div>Jl. Sudirman No. 45, Jakarta Pusat</div>
      </div>

      <div class="row q-col-gutter-sm">
        <div class="col-6">
          <q-btn 
            outline
            color="primary" 
            class="full-width text-weight-bold shadow-1" 
            rounded
            icon="directions"
            label="Buka Maps" 
            @click="openGoogleMaps"
          />
        </div>
        <div class="col-6">
          <q-btn 
            color="primary" 
            class="full-width text-weight-bold shadow-2" 
            rounded
            icon="login"
            label="Mulai Visit" 
            :loading="isCheckingIn"
            @click="startVisit"
          />
        </div>
      </div>

    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const router = useRouter()
const $q = useQuasar()

// Fix Leaflet Default Icon issue in Vue/Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

let map = null
const outletName = ref('Apotek Sehat Jaya')

const initMap = () => {
  // Dummy Coordinates
  const currentLoc = [-6.2088, 106.8456] // Sales Location (Jakarta)
  const outletLoc = [-6.2000, 106.8220]  // Outlet Location

  map = L.map('leaflet-map', { zoomControl: false }).setView(currentLoc, 14)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(map)

  // Current Location Marker
  const salesIcon = L.divIcon({ 
    html: '<div style="background-color: #2196F3; border: 3px solid white; border-radius: 50%; width: 16px; height: 16px; box-shadow: 0 0 10px rgba(33,150,243,0.8);"></div>', 
    className: 'custom-div-icon', 
    iconSize: [16, 16] 
  })
  L.marker(currentLoc, { icon: salesIcon }).addTo(map).bindPopup('Lokasi Anda Saat Ini').openPopup()

  // Outlet Marker
  L.marker(outletLoc).addTo(map).bindPopup(outletName.value)

  // Draw Route Line
  const polyline = L.polyline([currentLoc, outletLoc], { color: '#2196F3', weight: 5, opacity: 0.7, dashArray: '10, 10' }).addTo(map)
  map.fitBounds(polyline.getBounds(), { padding: [50, 50] })
}

const openGoogleMaps = () => {
  // Intent link to open Google Maps for navigation
  const url = `https://www.google.com/maps/dir/?api=1&destination=-6.2000,106.8220&travelmode=driving`
  window.open(url, '_blank')
}

const isCheckingIn = ref(false)

const startVisit = () => {
  isCheckingIn.value = true

  // Simulasi jeda network / pencarian GPS selama 1.5 detik
  setTimeout(() => {
    isCheckingIn.value = false
    
    $q.notify({
      type: 'positive',
      icon: 'check_circle',
      message: 'Check-in Berhasil! Jarak: 15 meter.',
      position: 'top',
      timeout: 2000
    })

    // Arahkan ke halaman Visit Execution
    router.push('/visit/1')
  }, 1500)
}

onMounted(() => {
  // Add small delay to ensure DOM is ready for Leaflet
  setTimeout(() => {
    initMap()
    setTimeout(() => {
      if (map) map.invalidateSize()
    }, 100)
  }, 300)
})

onBeforeUnmount(() => {
  if (map) {
    map.remove()
  }
})
</script>

<style scoped>
:deep(.custom-div-icon) {
  background: transparent;
  border: none;
}
.shadow-up-3 {
  box-shadow: 0 -4px 20px rgba(0,0,0,0.08);
}
</style>
