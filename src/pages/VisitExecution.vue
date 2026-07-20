<template>
  <q-page class="bg-grey-2" style="min-height: 100vh; padding: 16px;">
    <!-- Loading State -->
    <div v-if="loading" class="flex flex-center" style="height: 80vh;">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <div v-else-if="visit" class="vah-wrapper shadow-2">
      
      <!-- Left Sidebar (Desktop/Tablet) -->
      <div class="vah-sidebar gt-sm">
        <div class="vah-sidebar-header">
          <div class="vah-outlet-name">{{ visit.outlet?.NAMA_OUTLET || 'Unknown Outlet' }}</div>
          <div class="vah-outlet-meta">
            <q-icon name="person" /> {{ visit.outlet?.CONTACT_PERSON || '-' }}
            &nbsp; <q-badge color="grey-3" text-color="grey-9" label="Tier C" />
          </div>
          <div class="vah-progress-bar">
            <div class="vah-progress-fill" :style="{ width: progressPercentage + '%' }"></div>
          </div>
          <div class="text-caption text-grey-5 q-mt-xs">1/9 aktivitas selesai (11%)</div>
        </div>

        <q-scroll-area style="height: calc(100% - 100px);">
          <q-list padding class="text-grey-4">
            <q-item v-for="menu in menus" :key="menu.id" clickable v-ripple
              :active="activeTab === menu.id"
              active-class="bg-primary text-white"
              @click="activeTab = menu.id"
              class="q-mb-xs"
            >
              <q-item-section avatar>
                <q-icon :name="menu.icon" :color="activeTab === menu.id ? 'white' : menu.iconColor" size="20px" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold" style="font-size: 13px;">{{ menu.title }}</q-item-label>
                <q-item-label caption :class="activeTab === menu.id ? 'text-blue-2' : 'text-grey-6'" style="font-size: 11px;">
                  {{ menu.subtitle }}
                </q-item-label>
              </q-item-section>
              <q-item-section side v-if="menu.done">
                <q-icon name="check_circle" color="positive" size="18px" />
              </q-item-section>
              <q-item-section side v-else>
                <q-icon name="radio_button_unchecked" color="grey-7" size="18px" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </div>

      <!-- Right Content Area -->
      <div class="vah-content">
        
        <!-- Mobile Header & Tabs (Hidden on Desktop) -->
        <div class="lt-md bg-dark text-white q-pa-md">
          <div class="flex items-center q-mb-sm">
            <q-btn flat round dense icon="arrow_back" color="white" @click="confirmExit" />
            <div class="text-subtitle1 text-weight-bold q-ml-sm text-uppercase">Ruang Eksekusi</div>
          </div>
          <div>
            <h6 class="text-h6 text-weight-bolder q-my-none">{{ visit.outlet?.NAMA_OUTLET || 'Unknown Outlet' }}</h6>
            <div class="text-caption text-grey-4"><q-icon name="place" /> {{ visit.outlet?.ALAMAT }}</div>
          </div>
          <q-tabs v-model="activeTab" dense class="q-mt-md" active-color="primary" indicator-color="primary" outside-arrows mobile-arrows inline-label>
            <q-tab v-for="menu in menus" :key="menu.id" :name="menu.id" :icon="menu.icon" :label="menu.title" />
          </q-tabs>
        </div>

        <div class="q-pa-lg">
          
          <!-- Tab 1: INFO -->
          <div v-show="activeTab === 'info'">
            <div class="flex items-center q-mb-md">
              <q-icon name="info" size="24px" color="primary" class="q-mr-sm" />
              <div>
                <h5 class="vah-panel-title">Informasi Outlet</h5>
                <div class="vah-panel-subtitle">Profil, kontak, dan data finansial outlet</div>
              </div>
              <q-space />
              <q-btn flat round icon="close" color="grey-6" class="gt-sm" @click="confirmExit" />
            </div>

            <div class="info-grid">
              <div class="info-card">
                <div class="info-card-label">AR OUTSTANDING</div>
                <div class="info-card-value">Rp 0</div>
                <div class="info-card-sub">dari limit Rp 65,000,000</div>
              </div>
              <div class="info-card">
                <div class="info-card-label">TERMIN PEMBAYARAN</div>
                <div class="info-card-value">COD</div>
                <div class="info-card-sub">hari setelah terima barang</div>
              </div>
              <div class="info-card">
                <div class="info-card-label">TIER OUTLET</div>
                <div class="info-card-value">C</div>
              </div>
              <div class="info-card">
                <div class="info-card-label">JARAK CHECK-IN</div>
                <div class="info-card-value text-orange">11866212m</div>
                <div class="info-card-sub">dari titik GPS outlet</div>
              </div>
            </div>

            <q-card flat bordered class="q-mt-lg rounded-borders">
              <q-card-section class="bg-grey-1 text-weight-bold flex items-center">
                <q-icon name="contacts" class="q-mr-sm" /> Kontak & Lokasi
              </q-card-section>
              <q-separator />
              <q-list dense class="q-pa-sm">
                <q-item>
                  <q-item-section style="max-width: 150px;" class="text-grey-7 text-weight-medium">Pemilik / PIC</q-item-section>
                  <q-item-section class="text-weight-bold">{{ visit.outlet?.CONTACT_PERSON || 'Cindy' }}</q-item-section>
                </q-item>
                <q-item>
                  <q-item-section style="max-width: 150px;" class="text-grey-7 text-weight-medium">Telepon</q-item-section>
                  <q-item-section class="text-weight-bold">{{ visit.outlet?.PHONE || '081122334455' }}</q-item-section>
                </q-item>
                <q-item>
                  <q-item-section style="max-width: 150px;" class="text-grey-7 text-weight-medium">Alamat</q-item-section>
                  <q-item-section class="text-weight-bold">{{ visit.outlet?.ALAMAT || 'Jalan Kemanggisan' }}</q-item-section>
                </q-item>
                <q-item>
                  <q-item-section style="max-width: 150px;" class="text-grey-7 text-weight-medium">Territory</q-item-section>
                  <q-item-section class="text-weight-bold">{{ visit.outlet?.TERRITORY || 'Cinere' }}</q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>

          <!-- MOCK PANELS FOR OTHER TABS -->
          <div v-show="activeTab !== 'info' && activeTab !== 'checkout'">
            <q-card flat class="rounded-borders shadow-1 q-pa-xl text-center bg-white q-mt-md">
              <q-icon name="construction" size="64px" color="grey-4" />
              <div class="text-h6 text-grey-7 q-mt-md">Modul Sedang Dikembangkan</div>
              <div class="text-caption text-grey-6">Fitur ini akan ditambahkan di fase berikutnya.</div>
            </q-card>
          </div>

          <!-- Tab: CHECKOUT -->
          <div v-show="activeTab === 'checkout'">
            <div class="flex items-center q-mb-md">
              <q-icon name="logout" size="24px" color="negative" class="q-mr-sm" />
              <div>
                <h5 class="vah-panel-title">Check Out & Laporan</h5>
                <div class="vah-panel-subtitle">Akhiri kunjungan dan kirim laporan ke server</div>
              </div>
            </div>

            <q-card flat bordered class="rounded-borders q-pa-md bg-white">
              <q-form @submit="submitCheckout" class="q-gutter-md">
                <div>
                  <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">Hasil Kunjungan <span class="text-negative">*</span></div>
                  <q-input 
                    v-model="form.HASIL_KUNJUNGAN" 
                    outlined dense type="textarea" rows="3"
                    placeholder="Contoh: Stok kompetitor menipis, disarankan kirim POS material minggu depan."
                    :rules="[val => !!val || 'Hasil kunjungan wajib diisi']"
                  />
                </div>
                <div>
                  <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">Alasan Tidak Order</div>
                  <q-select 
                    v-model="form.REASON_NO_ORDER"
                    :options="['Stok Masih Banyak', 'Toko Tutup', 'Pemilik Tidak Ada', 'Masalah Piutang (AR)', 'Lainnya']"
                    outlined dense clearable
                    placeholder="Kosongkan jika terjadi transaksi (Order)"
                  />
                </div>
                <div>
                  <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">Catatan Kompetitor (Opsional)</div>
                  <q-input v-model="form.CATATAN_KOMPETITOR" outlined dense placeholder="Promo kompetitor X diskon 5%" />
                </div>
                <div class="q-mt-lg">
                  <q-btn type="submit" color="negative" class="full-width text-weight-bold shadow-3" size="lg" rounded icon="logout" label="Akhiri & Check-Out" :loading="checkingOut" />
                </div>
              </q-form>
            </q-card>
          </div>

        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const loading = ref(true)
const checkingOut = ref(false)
const visit = ref(null)
const activeTab = ref('info')

const progressPercentage = ref(11)

const menus = ref([
  { id: 'info', title: 'Informasi Outlet', subtitle: 'Data & profil outlet', icon: 'info', iconColor: 'blue', done: true },
  { id: 'stock', title: 'Stock Checking', subtitle: 'Cek stok di rak', icon: 'inventory_2', iconColor: 'orange', done: false },
  { id: 'merchandising', title: 'Merchandising', subtitle: 'Foto display & planogram', icon: 'camera_alt', iconColor: 'pink', done: false },
  { id: 'survey', title: 'Survey', subtitle: 'Kondisi outlet', icon: 'fact_check', iconColor: 'teal', done: false },
  { id: 'order', title: 'Sales Order', subtitle: 'Buat order pembelian', icon: 'shopping_cart', iconColor: 'blue-grey', done: false },
  { id: 'collection', title: 'Collection', subtitle: 'Tagihan & pembayaran', icon: 'payments', iconColor: 'amber', done: false },
  { id: 'return', title: 'Return Barang', subtitle: 'Barang dikembalikan', icon: 'keyboard_return', iconColor: 'brown', done: false },
  { id: 'competitor', title: 'Kompetitor', subtitle: 'Data brand pesaing', icon: 'visibility', iconColor: 'purple', done: false },
  { id: 'checkout', title: 'Check Out', subtitle: 'Akhiri kunjungan', icon: 'logout', iconColor: 'negative', done: false }
])

const form = ref({
  HASIL_KUNJUNGAN: '',
  REASON_NO_ORDER: null,
  CATATAN_KOMPETITOR: ''
})

const api = axios.create({ baseURL: 'http://sales.test/api/mobile' })
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sales_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

const loadVisit = async () => {
  try {
    const res = await api.get(`/visits/${route.params.visit_id}`)
    if (res.data.success) {
      visit.value = res.data.data
    }
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Gagal memuat data kunjungan.' })
    router.push('/dashboard')
  } finally {
    loading.value = false
  }
}

const submitCheckout = async () => {
  $q.dialog({
    title: 'Konfirmasi Check-out',
    message: 'Apakah Anda yakin sudah selesai melakukan seluruh aktivitas di toko ini?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    checkingOut.value = true
    try {
      const res = await api.post(`/visits/${visit.value.VISIT_ID}/checkout`, form.value)
      if (res.data.success) {
        $q.notify({ type: 'positive', message: 'Kunjungan selesai dan tersimpan!' })
        router.push('/dashboard')
      }
    } catch (e) {
      console.error(e)
      $q.notify({ type: 'negative', message: 'Gagal melakukan check-out.' })
    } finally {
      checkingOut.value = false
    }
  })
}

const confirmExit = () => {
  $q.dialog({
    title: 'Keluar Kunjungan?',
    message: 'Kunjungan ini belum di check-out. Data yang belum tersimpan mungkin hilang.',
    cancel: true,
    ok: 'Ya, Keluar'
  }).onOk(() => {
    router.go(-1)
  })
}

onMounted(() => {
  loadVisit()
})
</script>

<style lang="scss" scoped>
.rounded-borders {
  border-radius: 12px;
}

/* VAH WRAPPER (Admin Replica) */
.vah-wrapper {
  display: flex;
  min-height: calc(100vh - 85px);
  background: #f1f5f9;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.vah-sidebar {
  width: 270px;
  flex-shrink: 0;
  background: #1e293b;
  display: flex;
  flex-direction: column;
}

.vah-sidebar-header {
  padding: 20px 20px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.vah-outlet-name {
  font-size: 15px;
  font-weight: 800;
  color: #f1f5f9;
  line-height: 1.3;
  margin-bottom: 4px;
}

.vah-outlet-meta {
  font-size: 11px;
  color: #94a3b8;
}

.vah-progress-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  margin: 12px 0 0;
  overflow: hidden;
}

.vah-progress-fill {
  height: 100%;
  background: #3b82f6;
  border-radius: 2px;
  transition: width 0.3s;
}

.vah-content {
  flex: 1;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.vah-panel-title {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.vah-panel-subtitle {
  font-size: 13px;
  color: #64748b;
  margin: 2px 0 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 14px;
  margin-bottom: 20px;
}

.info-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e2e8f0;
}

.info-card-label {
  font-size: 10px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-card-value {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  margin-top: 4px;
}

.info-card-sub {
  font-size: 11px;
  color: #64748b;
}
</style>
