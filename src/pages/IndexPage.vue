<template>
  <q-page class="dashboard-page">

    <!-- Greeting Section -->
    <div class="q-mb-md v-animate-in">
      <div class="text-subtitle2 text-grey-7">{{ todayFormatted }}</div>
      <div class="text-h5 text-weight-bolder text-dark q-mt-xs">{{ greetingText }}</div>
    </div>

    <!-- Stat Cards -->
    <div class="stat-grid v-animate-in v-animate-in--delay-1">
      <StatCard
        icon="store"
        label="Rencana Kunjungan"
        value="12"
        icon-bg="var(--vistra-primary-bg)"
        icon-color="primary"
      />
      <StatCard
        icon="check_circle"
        label="Selesai"
        value="8"
        icon-bg="var(--vistra-success-bg)"
        icon-color="green-7"
      />
      <StatCard
        icon="schedule"
        label="Tertunda"
        value="4"
        icon-bg="var(--vistra-warning-bg)"
        icon-color="orange-8"
      />
      <StatCard
        icon="fiber_new"
        label="Outlet Baru"
        value="2"
        icon-bg="rgba(156, 39, 176, 0.1)"
        icon-color="purple"
      />
      <StatCard
        icon="payments"
        label="Pendapatan"
        value="28,5 Juta"
        icon-bg="var(--vistra-info-bg)"
        icon-color="indigo-5"
        layout="horizontal"
        class="span-full"
      />
    </div>

    <!-- Promo Harian -->
    <div class="section v-animate-in v-animate-in--delay-2">
      <div class="v-section-title q-mb-md">Promo Harian 🔥</div>
      <q-scroll-area horizontal style="height: 120px;" class="q-mb-md" :thumb-style="{ display: 'none' }">
        <div class="row no-wrap q-gutter-x-sm">
          <q-card 
            v-for="(promo, i) in promos" :key="i"
            class="rounded-borders q-pa-md shadow-2 text-white flex column justify-between cursor-pointer"
            :style="{ background: promo.bg, width: '240px', height: '110px', borderRadius: '16px' }"
            v-ripple
          >
            <div class="flex items-center justify-between">
              <div class="text-subtitle2 text-weight-bolder" style="line-height: 1.2;">{{ promo.title }}</div>
              <q-icon :name="promo.icon" size="24px" style="opacity: 0.8;" />
            </div>
            <div class="text-caption text-weight-medium" style="opacity: 0.9;">{{ promo.subtitle }}</div>
          </q-card>
        </div>
      </q-scroll-area>
    </div>

    <!-- Quick Actions -->
    <div class="section v-animate-in v-animate-in--delay-3">
      <div class="v-section-title q-mb-md">Aksi Cepat</div>
      <QuickActionGrid :actions="quickActions" />
    </div>

    <!-- Recent Activity -->
    <div class="section v-animate-in v-animate-in--delay-4">
      <div class="section-header">
        <div class="v-section-title">Aktivitas Terbaru</div>
        <a href="#" class="section-link">Lihat Semua</a>
      </div>

      <div class="activity-list">
        <ActivityItem
          v-for="(item, i) in recentActivities"
          :key="i"
          :icon="item.icon"
          :icon-bg="item.iconBg"
          :icon-accent="item.iconAccent"
          :title="item.title"
          :subtitle="item.subtitle"
          :time="item.time"
          :status="item.status"
          :status-type="item.statusType"
        />
      </div>
    </div>

  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import StatCard from '@/components/StatCard.vue'
import QuickActionGrid from '@/components/QuickActionGrid.vue'
import ActivityItem from '@/components/ActivityItem.vue'

// --- Greeting ---
const userName = computed(() => {
  const user = localStorage.getItem('sales_user')
  if (user) {
    try {
      return JSON.parse(user).name || ''
    } catch { return '' }
  }
  return ''
})

const greetingText = computed(() => {
  const hour = new Date().getHours()
  const name = userName.value ? `, ${userName.value}` : ''
  
  if (hour < 12) return `Selamat Pagi${name}\xA0👋`
  if (hour < 15) return `Selamat Siang${name}\xA0☀️`
  if (hour < 18) return `Selamat Sore${name}\xA0🌇`
  return `Selamat Malam${name}\xA0🌙`
})

const todayFormatted = computed(() => {
  return new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})

// --- Quick Actions (Mock) ---
const quickActions = [
  { icon: 'map', label: 'Rencana Kunjungan', to: '/journey-plan', color: 'primary', bg: 'var(--vistra-primary-bg)' },
  { icon: 'inventory_2', label: 'Katalog Produk', to: '/products', color: 'green-7', bg: 'var(--vistra-success-bg)' },
  { icon: 'storefront', label: 'Daftar Outlet', to: '/outlets', color: 'purple-7', bg: 'rgba(168, 85, 247, 0.1)' },
  { icon: 'analytics', label: 'Laporan Sales', to: '/reports', color: 'orange-7', bg: 'var(--vistra-warning-bg)' },
]

// --- Promo Harian (Mock Data) ---
const promos = [
  {
    title: 'Diskon 10% Alkes',
    subtitle: 'Khusus outlet Tier A & B',
    color: '#fff',
    bg: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
    icon: 'local_offer'
  },
  {
    title: 'Beli 10 Box Gratis 1',
    subtitle: 'Semua jenis Paracetamol',
    color: '#fff',
    bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    icon: 'redeem'
  }
]

// --- Recent Activity (Mock Data) ---
const recentActivities = [
  {
    icon: 'local_pharmacy',
    iconBg: 'var(--vistra-success-bg)',
    iconAccent: 'var(--vistra-success)',
    title: 'Apotek Sehat Jaya',
    subtitle: 'Jl. Sudirman No. 45',
    time: '09:15',
    status: 'Selesai',
    statusType: 'success'
  },
  {
    icon: 'local_hospital',
    iconBg: 'var(--vistra-success-bg)',
    iconAccent: 'var(--vistra-success)',
    title: 'RS Medika Utama',
    subtitle: 'Jl. Gatot Subroto No. 12',
    time: '10:30',
    status: 'Selesai',
    statusType: 'success'
  },
  {
    icon: 'local_pharmacy',
    iconBg: 'var(--vistra-warning-bg)',
    iconAccent: 'var(--vistra-warning)',
    title: 'Klinik Bhakti Husada',
    subtitle: 'Jl. Ahmad Yani No. 78',
    time: '11:45',
    status: 'Pending',
    statusType: 'warning'
  },
  {
    icon: 'storefront',
    iconBg: 'var(--vistra-danger-bg)',
    iconAccent: 'var(--vistra-danger)',
    title: 'Toko Obat Sumber Rezeki',
    subtitle: 'Jl. Diponegoro No. 33',
    time: '13:00',
    status: 'Ditolak',
    statusType: 'danger'
  },
]
</script>

<style lang="scss" scoped>
.dashboard-page {
  padding: 16px;
  padding-bottom: 24px;
  background: var(--vistra-bg);
}

/* Stat Grid */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.span-full {
  grid-column: span 2;
}

/* Section */
.section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.section-link {
  font-size: 13px;
  font-weight: 600;
  color: var(--vistra-primary);
  text-decoration: none;
}

/* Activity List */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
