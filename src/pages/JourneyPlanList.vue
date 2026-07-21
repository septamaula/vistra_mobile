<template>
  <q-page class="bg-grey-1" style="min-height: 100vh;">
    <!-- Sticky Header -->
    <div class="bg-white q-pa-md shadow-2" style="position: sticky; top: 0; z-index: 10;">
      <div class="flex items-center">
        <q-btn flat round icon="arrow_back" color="dark" @click="$router.push('/dashboard')" />
        <h6 class="text-h6 text-weight-bolder text-dark q-my-none q-ml-sm">Rencana Kunjungan</h6>
      </div>
      <div class="q-mt-sm text-subtitle2 text-grey-6 q-px-sm">
        {{ todayFormatted }}
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <!-- Plan List -->
    <div v-else class="q-pa-md q-gutter-y-md">
      
      <!-- Optimization Banner -->
      <div class="optimization-banner q-pa-sm q-mb-md flex items-center">
        <q-icon name="route" color="primary" size="24px" class="q-mr-sm" />
        <div>
          <div class="text-weight-bold text-dark" style="font-size: 13px;">Rute Cerdas Aktif</div>
          <div class="text-grey-7" style="font-size: 11px;">Urutan telah dioptimalkan untuk jarak tempuh terpendek.</div>
        </div>
      </div>

      <div v-if="journeyPlans.length === 0" class="text-center text-grey q-pa-xl">
        <q-icon name="event_busy" size="48px" class="q-mb-md opacity-50" />
        <div class="text-h6">Tidak ada jadwal</div>
        <div class="text-caption">Anda belum memiliki rencana kunjungan untuk hari ini.</div>
      </div>

      <!-- Timeline wrapper -->
      <div class="timeline-container">
        <div
          v-for="(plan, index) in journeyPlans"
          :key="index"
          class="plan-card v-card q-pa-md q-mb-md"
          style="position: relative;"
          v-ripple
        >
          <!-- Sequence Badge -->
          <div class="sequence-badge bg-primary text-white text-weight-bold shadow-1">
            {{ index + 1 }}
          </div>

          <div class="flex justify-between items-start q-mb-sm q-pl-lg">
            <div class="flex items-center gap-xs">
              <span class="text-subtitle1 text-weight-bold text-dark">{{ plan.NAMA_OUTLET }}</span>
            </div>
            <q-badge :color="getStatusColor(plan.STATUS)" rounded class="q-px-sm py-xs text-weight-bold">
              {{ plan.STATUS }}
            </q-badge>
          </div>
          
          <div class="q-pl-lg">
            <div class="text-caption text-grey-7 flex items-center q-mb-xs">
              <q-icon name="location_on" size="14px" class="q-mr-xs text-primary" />
              {{ plan.ALAMAT }}
            </div>
            
            <div class="text-caption text-grey-7 flex items-center q-mb-xs">
              <q-icon name="directions_car" size="14px" class="q-mr-xs text-secondary" />
              <span class="text-weight-medium text-dark">{{ plan.JARAK }}</span>
            </div>

            <div class="text-caption text-grey-7 flex items-center q-mb-md">
              <q-icon name="schedule" size="14px" class="q-mr-xs text-orange" />
              Target: {{ plan.TARGET_WAKTU || 'Hari ini' }}
            </div>

            <q-btn
              v-if="plan.STATUS === 'Pending'"
              label="Mulai Kunjungan"
              color="primary"
              class="full-width text-weight-bold shadow-1"
              rounded
              unelevated
              :loading="checkingIn === plan.OUTLET_ID"
              @click="startVisit(plan)"
            />
            <q-btn
              v-else
              label="Lihat Detail"
              color="grey-3"
              text-color="dark"
              class="full-width text-weight-bold"
              rounded
              unelevated
              @click="$router.push(`/journey-plan/${plan.OUTLET_ID}`)"
            />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

const loading = ref(true)
const journeyPlans = ref([])

const todayFormatted = computed(() => {
  return new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'selesai': return 'positive'
    case 'pending': return 'warning'
    case 'ditolak': return 'negative'
    default: return 'grey'
  }
}

const loadJourneyPlans = () => {
  loading.value = true
  
  // -- MOCK FETCH DATA --
  setTimeout(() => {
    journeyPlans.value = [
      { 
        OUTLET_ID: 1, 
        NAMA_OUTLET: 'Apotek Sehat Jaya', 
        ALAMAT: 'Jl. Sudirman No. 45, Jakarta Pusat',
        STATUS: 'Selesai',
        TARGET_WAKTU: '09:00 - 11:00',
        JARAK: '1.2 km dari posisi awal'
      },
      { 
        OUTLET_ID: 2, 
        NAMA_OUTLET: 'RS Medika Utama', 
        ALAMAT: 'Jl. Gatot Subroto No. 12, Jakarta Selatan',
        STATUS: 'Pending',
        TARGET_WAKTU: '13:00 - 14:00',
        JARAK: '850 m dari apotek sebelumnya'
      },
      { 
        OUTLET_ID: 3, 
        NAMA_OUTLET: 'Klinik Bhakti Husada', 
        ALAMAT: 'Jl. Ahmad Yani No. 78, Jakarta Timur',
        STATUS: 'Pending',
        TARGET_WAKTU: '15:00 - 17:00',
        JARAK: '1.5 km dari RS sebelumnya'
      }
    ]
    loading.value = false
  }, 600)
}

const checkingIn = ref(null)

const startVisit = (plan) => {
  checkingIn.value = plan.OUTLET_ID

  setTimeout(() => {
    checkingIn.value = null
    
    $q.notify({
      type: 'positive',
      icon: 'check_circle',
      message: 'Check-in Berhasil! Jarak: 15 meter.',
      position: 'top',
      timeout: 2000
    })

    router.push(`/visit/${plan.OUTLET_ID}`)
  }, 1500)
}

onMounted(() => {
  loadJourneyPlans()
})
</script>

<style scoped>
.plan-card {
  border-radius: 16px;
  background: white;
  border: 1px solid rgba(0,0,0,0.03);
}

.optimization-banner {
  background: rgba(33, 150, 243, 0.1);
  border: 1px solid rgba(33, 150, 243, 0.2);
  border-radius: 12px;
}

.sequence-badge {
  position: absolute;
  top: 16px;
  left: -8px;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.timeline-container {
  padding-left: 8px;
}

.gap-xs {
  gap: 4px;
}
</style>
