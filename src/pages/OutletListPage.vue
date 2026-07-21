<template>
  <q-page class="bg-grey-2" style="min-height: 100vh;">
    <!-- Reusable Compact Header -->
    <AppHeader title="Daftar Outlet" subtitle="Master data pelanggan & profil apotek/RS" />

    <div class="q-pa-md max-width-container mx-auto">
      
      <!-- Search & Territory Filter -->
      <q-card flat class="rounded-borders bg-white q-pa-md q-mb-md shadow-1">
        <div class="row q-col-gutter-sm items-center">
          <div class="col-12 col-sm-7">
            <q-input v-model="search" dense outlined rounded placeholder="Cari nama outlet, alamat, atau PIC..." class="bg-grey-1">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
              <template v-slot:append v-if="search">
                <q-icon name="close" class="cursor-pointer" @click="search = ''" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-5">
            <q-select 
              v-model="selectedTerritory" 
              :options="territoryOptions" 
              dense outlined rounded 
              bg-color="grey-1"
              options-selected-class="text-weight-bold text-primary"
            >
              <template v-slot:prepend>
                <q-icon name="place" color="primary" />
              </template>
            </q-select>
          </div>
        </div>
      </q-card>

      <!-- Outlet List Grid -->
      <div class="row q-col-gutter-md">
        <div v-for="outlet in filteredOutlets" :key="outlet.id" class="col-12 col-sm-6 col-md-4">
          <q-card flat class="rounded-borders bg-white shadow-1 column justify-between h-100 style-card">
            <q-card-section>
              <div class="flex justify-between items-start q-mb-xs">
                <q-badge :color="getTierColor(outlet.tier)" class="text-weight-bold q-pa-xs">
                  Tier {{ outlet.tier }}
                </q-badge>
                <q-badge outline :color="outlet.arOutstanding > 0 ? 'warning' : 'positive'" class="text-weight-bold">
                  AR: {{ formatCurrency(outlet.arOutstanding) }}
                </q-badge>
              </div>

              <div class="text-weight-bold text-dark q-mt-sm" style="font-size: 16px; line-height: 1.3;">
                {{ outlet.name }}
              </div>

              <div class="text-caption text-grey-7 q-mt-xs">
                <q-icon name="person" size="14px" class="q-mr-xs" />{{ outlet.contact }} ({{ outlet.role }})
              </div>

              <div class="text-caption text-grey-6 q-mt-xs" style="line-height: 1.3;">
                <q-icon name="place" size="14px" class="q-mr-xs" />{{ outlet.address }}
              </div>
            </q-card-section>

            <q-card-section class="bg-grey-1 flex items-center justify-between q-pa-sm" style="border-top: 1px solid #f1f5f9;">
              <div class="text-caption text-grey-7 text-weight-bold">
                Limit: {{ formatCurrency(outlet.creditLimit) }}
              </div>
              <div>
                <q-btn flat round icon="phone" color="primary" dense class="q-mr-xs" @click="callOutlet(outlet)" />
                <q-btn flat round icon="info" color="dark" dense @click="showDetail(outlet)" />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div v-if="filteredOutlets.length === 0" class="col-12 text-center q-py-xl">
          <q-icon name="storefront" size="64px" color="grey-4" />
          <div class="text-h6 text-grey-6 q-mt-md">Outlet Tidak Ditemukan</div>
          <div class="text-caption text-grey-5">Coba kata kunci pencarian atau wilayah lain.</div>
        </div>
      </div>

    </div>

    <!-- Outlet Detail Modal -->
    <q-dialog v-model="detailOpen">
      <q-card style="width: 420px; max-width: 90vw;" class="rounded-borders">
        <q-card-section class="bg-primary text-white flex items-center justify-between">
          <div class="text-subtitle1 text-weight-bold">Profil Outlet</div>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>

        <q-card-section v-if="activeOutlet" class="q-pa-md">
          <div class="text-h6 text-weight-bolder text-dark">{{ activeOutlet.name }}</div>
          <div class="text-caption text-grey-7 q-mb-md">{{ activeOutlet.address }}</div>

          <q-list separator dense class="rounded-borders bordered bg-grey-1">
            <q-item>
              <q-item-section class="text-grey-7">Tier Pelanggan</q-item-section>
              <q-item-section class="text-weight-bold text-right">
                <q-badge :color="getTierColor(activeOutlet.tier)">Tier {{ activeOutlet.tier }}</q-badge>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-grey-7">Kontak / PIC</q-item-section>
              <q-item-section class="text-weight-bold text-right">{{ activeOutlet.contact }} ({{ activeOutlet.role }})</q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-grey-7">Telepon</q-item-section>
              <q-item-section class="text-weight-bold text-primary text-right">{{ activeOutlet.phone }}</q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-grey-7">Wilayah (Territory)</q-item-section>
              <q-item-section class="text-weight-bold text-right">{{ activeOutlet.territory }}</q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-grey-7">Termin Pembayaran</q-item-section>
              <q-item-section class="text-weight-bold text-right">{{ activeOutlet.term }}</q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-grey-7">Limit Kredit</q-item-section>
              <q-item-section class="text-weight-bold text-right">{{ formatCurrency(activeOutlet.creditLimit) }}</q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-grey-7">Piutang (AR Outstanding)</q-item-section>
              <q-item-section class="text-weight-bolder text-negative text-right">{{ formatCurrency(activeOutlet.arOutstanding) }}</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import AppHeader from '@/components/AppHeader.vue'

const $q = useQuasar()
const search = ref('')
const selectedTerritory = ref('Semua Wilayah')

const territoryOptions = [
  'Semua Wilayah',
  'Jakarta Pusat',
  'Jakarta Selatan',
  'Jakarta Timur',
  'Jakarta Barat'
]

const outlets = ref([
  {
    id: 1,
    name: 'Apotek Sehat Jaya',
    contact: 'Bapak Budi',
    role: 'Apoteker',
    phone: '081234567890',
    address: 'Jl. Sudirman No. 45, Jakarta Pusat',
    territory: 'Jakarta Pusat',
    tier: 'A',
    creditLimit: 65000000,
    arOutstanding: 0,
    term: 'COD, Net 14 Hari'
  },
  {
    id: 2,
    name: 'RS Medika Utama',
    contact: 'Dr. Hendra',
    role: 'Kepala Farmasi',
    phone: '081399887766',
    address: 'Jl. Gatot Subroto No. 12, Jakarta Selatan',
    territory: 'Jakarta Selatan',
    tier: 'A',
    creditLimit: 150000000,
    arOutstanding: 2500000,
    term: 'Net 30 Hari'
  },
  {
    id: 3,
    name: 'Klinik Bhakti Husada',
    contact: 'Ibu Anita',
    role: 'Manajer Penjualan',
    phone: '081766554433',
    address: 'Jl. Ahmad Yani No. 78, Jakarta Timur',
    territory: 'Jakarta Timur',
    tier: 'B',
    creditLimit: 30000000,
    arOutstanding: 1250000,
    term: 'Net 14 Hari'
  },
  {
    id: 4,
    name: 'Toko Obat Sumber Rezeki',
    contact: 'Bapak Rudi',
    role: 'Pemilik',
    phone: '081822334455',
    address: 'Jl. Diponegoro No. 33, Jakarta Barat',
    territory: 'Jakarta Barat',
    tier: 'C',
    creditLimit: 15000000,
    arOutstanding: 0,
    term: 'Cash On Delivery (COD)'
  }
])

const filteredOutlets = computed(() => {
  return outlets.value.filter(o => {
    const matchTerritory = selectedTerritory.value === 'Semua Wilayah' || o.territory === selectedTerritory.value
    const matchSearch = !search.value || 
      o.name.toLowerCase().includes(search.value.toLowerCase()) || 
      o.contact.toLowerCase().includes(search.value.toLowerCase()) || 
      o.address.toLowerCase().includes(search.value.toLowerCase())
    return matchTerritory && matchSearch
  })
})

const getTierColor = (tier) => {
  switch (tier) {
    case 'A': return 'primary'
    case 'B': return 'deep-orange-7'
    case 'C': return 'grey-8'
    default: return 'primary'
  }
}

const formatCurrency = (val) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)
}

const detailOpen = ref(false)
const activeOutlet = ref(null)

const showDetail = (outlet) => {
  activeOutlet.value = outlet
  detailOpen.value = true
}

const callOutlet = (outlet) => {
  $q.notify({ type: 'info', message: `Menghubungi ${outlet.name} (${outlet.phone})...` })
}
</script>

<style lang="scss" scoped>
.max-width-container {
  max-width: 1100px;
}
.style-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
  }
}
</style>
