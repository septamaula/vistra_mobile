<template>
  <q-page class="q-px-md q-pb-xl dashboard-page">
    
    <!-- Title -->
    <div class="q-mt-sm q-mb-lg">
      <h1 class="text-h3 text-weight-bolder text-dark q-my-none" style="letter-spacing: -1px;">Dashboard</h1>
    </div>

    <!-- Tabs -->
    <div class="q-mb-md">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey-6"
        active-color="dark"
        indicator-color="primary"
        align="left"
        narrow-indicator
        :breakpoint="0"
      >
        <q-tab name="sales" label="Sales" class="text-weight-bold text-subtitle1 text-capitalize q-px-sm" />
        <q-tab name="activity" label="Activity" class="text-weight-bold text-subtitle1 text-capitalize q-px-sm" />
        <q-tab name="credit" label="Credit" class="text-weight-bold text-subtitle1 text-capitalize q-px-sm" />
      </q-tabs>
    </div>

    <!-- Chart Card placeholder (following the design) -->
    <q-card flat class="chart-card bg-white q-mb-xl">
      <q-card-section class="q-pa-md">
        <!-- Mock Chart Graphic using an Image -->
        <div class="chart-container relative-position">
          <div class="y-axis flex column justify-between text-caption text-grey-5" style="height: 120px;">
            <span>3.0</span>
            <span>2.5</span>
            <span>2.0</span>
            <span>1.5</span>
            <span>0</span>
          </div>
          
          <div class="chart-visual relative-position" style="height: 120px; flex-grow: 1; margin-left: 10px;">
            <svg viewBox="0 0 300 100" preserveAspectRatio="none" style="width: 100%; height: 100%;">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="var(--q-primary)" stop-opacity="0.4" />
                  <stop offset="100%" stop-color="var(--q-primary)" stop-opacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M 0 50 C 40 80, 80 40, 120 70 C 160 100, 200 60, 240 80 C 270 90, 290 20, 300 10 L 300 100 L 0 100 Z" fill="url(#chartGrad)"/>
              <path d="M 0 50 C 40 80, 80 40, 120 70 C 160 100, 200 60, 240 80 C 270 90, 290 20, 300 10" fill="none" stroke="var(--q-primary)" stroke-width="3" stroke-linecap="round"/>
              <circle cx="300" cy="10" r="5" fill="var(--q-primary)" />
            </svg>
            <div class="tooltip-bubble shadow-2">IDR 2,5</div>
          </div>
        </div>
        
        <div class="x-axis flex justify-between text-caption text-grey-5 q-mt-sm q-ml-lg">
          <span>Jan</span>
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
          <span>May</span>
        </div>
      </q-card-section>
    </q-card>

    <!-- Date Picker for Journey Plan -->
    <div class="flex justify-between items-center q-mb-md">
      <h6 class="text-subtitle1 text-weight-bolder text-dark q-my-none">Journey Plan</h6>
      <q-input 
        v-model="selectedDate" 
        type="date" 
        dense 
        outlined 
        color="primary" 
        class="date-picker-sm"
        @update:model-value="loadJourney"
      />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center q-py-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center q-py-md text-negative">
      {{ error }}
    </div>

    <!-- Empty State -->
    <div v-else-if="!journeyPlan" class="text-center q-py-lg text-grey-6 bg-white rounded-borders">
      <q-icon name="event_busy" size="48px" color="grey-4" class="q-mb-sm" />
      <div>Tidak ada jadwal kunjungan di tanggal ini.</div>
      <q-btn 
        label="Buat Journey Plan" 
        color="primary" 
        class="q-mt-md text-weight-bold" 
        rounded 
        unelevated
        to="/journey-plan/add"
      />
    </div>

    <!-- Summary Card State -->
    <div v-else class="q-gutter-y-sm">
      <q-card 
        flat 
        class="bg-white q-pa-md log-card cursor-pointer"
        v-ripple
        @click="goToDetail(journeyPlan.HEADER_ID)"
      >
        <div class="flex justify-between items-center q-mb-sm">
          <div class="text-caption text-weight-bold text-primary text-uppercase">
            Target Penugasan
          </div>
          <q-chip color="cyan-1" text-color="cyan-9" size="sm" class="text-weight-bold">
            {{ journeyPlan.plans ? journeyPlan.plans.length : 0 }} Outlet
          </q-chip>
        </div>
        
        <h6 class="text-h6 text-weight-bolder text-dark q-my-none q-mb-xs">
          Rute Kunjungan Harian
        </h6>
        
        <p class="text-body2 text-grey-7 q-mb-md">
          {{ journeyPlan.KETERANGAN || 'Tidak ada deskripsi tambahan.' }}
        </p>
        
        <div class="flex items-center text-primary text-weight-bold">
          Lihat Peta Rute & Mulai Kunjungan
          <q-icon name="arrow_forward" class="q-ml-sm" />
        </div>
      </q-card>
    </div>

    <!-- Floating Action Button -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="cyan-13" class="shadow-4 fab-btn" size="lg" to="/journey-plan/add" />
    </q-page-sticky>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const tab = ref('sales')
const loading = ref(true)
const error = ref(null)
const journeyPlan = ref(null)

const selectedDate = ref(new Date().toISOString().split('T')[0])

const router = useRouter()

const api = axios.create({ baseURL: 'http://sales.test/api/mobile' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sales_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const loadJourney = async () => {
  loading.value = true
  error.value = null
  journeyPlan.value = null
  
  try {
    const response = await api.get(`/journey-plans?date=${selectedDate.value}`)
    if (response.data.success && response.data.data) {
      journeyPlan.value = response.data.data
    }
  } catch (err) {
    console.error(err)
    if (err.response?.status === 401) {
      router.push('/login')
    } else {
      error.value = 'Gagal memuat jadwal kunjungan.'
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadJourney()
})

const goToDetail = (header_id) => {
  router.push(`/journey-plan/${header_id}`)
}
</script>

<style lang="scss" scoped>
.dashboard-page {
  background-color: #f7f9fb;
  min-height: 100vh;
}

.chart-card {
  border-radius: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04) !important;
}

.chart-container {
  display: flex;
}

.tooltip-bubble {
  position: absolute;
  top: 0px;
  right: -10px;
  background-color: white;
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 10px;
  font-weight: bold;
  color: #333;
}

.log-card {
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02) !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid #f0f0f0;
  
  &:active {
    transform: scale(0.98);
  }
}

.fab-btn {
  background: linear-gradient(135deg, #18ffff 0%, #00e5ff 100%);
  color: white !important;
}

:deep(.q-tab__indicator) {
  height: 4px;
  border-radius: 4px;
  bottom: 4px;
  width: 20px;
  margin: 0 auto;
}

.date-picker-sm {
  width: 140px;
  :deep(.q-field__control) {
    height: 36px;
    min-height: 36px;
    background: white;
    border-radius: 8px;
  }
  :deep(.q-field__native) {
    padding-top: 0;
    padding-bottom: 0;
    font-size: 13px;
    font-weight: 600;
  }
}
</style>
