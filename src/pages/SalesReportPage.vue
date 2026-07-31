<template>
  <q-page class="bg-grey-2" style="min-height: 100vh;">
    <!-- Reusable Compact Header -->
    <AppHeader title="Laporan Sales & Retur" subtitle="Rekapitulasi pencapaian target & retur barang" />

    <div class="q-pa-md max-width-container mx-auto">
      
      <!-- Period Selector & Filter Card -->
      <q-card flat class="rounded-borders bg-white q-pa-md q-mb-md shadow-1">
        <div class="row justify-between items-center">
          <div class="text-caption text-weight-bold text-dark flex items-center">
            <q-icon name="calendar_today" color="red-9" class="q-mr-xs" size="18px" /> Periode Laporan
          </div>
          <q-select 
            v-model="selectedPeriod" 
            :options="periodOptions" 
            dense outlined rounded 
            bg-color="grey-1"
            style="min-width: 180px;"
            options-selected-class="text-weight-bold text-red-9"
          />
        </div>
      </q-card>

      <!-- KPI Summary Cards -->
      <div class="row q-col-gutter-sm q-mb-md">
        <div class="col-6 col-md-3">
          <q-card flat class="rounded-borders bg-white q-pa-md shadow-1" style="border-left: 4px solid #701a1e;">
            <div class="text-caption text-weight-bold text-grey-7">TOTAL SALES (MTD)</div>
            <div class="text-h6 text-weight-bolder q-mt-xs" style="font-size: 16px; color: #701a1e;">
              Rp {{ formatJuta(stats.total_sales) }}
            </div>
            <div class="text-caption text-positive text-weight-bold q-mt-xs flex items-center" style="font-size: 10px;">
              <q-icon name="trending_up" size="14px" class="q-mr-xs" /> Transaksi Real DB
            </div>
          </q-card>
        </div>

        <div class="col-6 col-md-3">
          <q-card flat class="rounded-borders bg-white q-pa-md shadow-1 border-left-negative">
            <div class="text-caption text-weight-bold text-grey-7">TOTAL RETUR</div>
            <div class="text-h6 text-weight-bolder text-negative q-mt-xs" style="font-size: 16px;">
              Rp {{ formatJuta(stats.total_retur) }}
            </div>
            <div class="text-caption text-grey-6 text-weight-medium q-mt-xs" style="font-size: 10px;">
              Rekapitulasi Retur Produk
            </div>
          </q-card>
        </div>

        <div class="col-6 col-md-3">
          <q-card flat class="rounded-borders bg-white q-pa-md shadow-1 border-left-positive">
            <div class="text-caption text-weight-bold text-grey-7">COLLECTION (AR)</div>
            <div class="text-h6 text-weight-bolder text-positive q-mt-xs" style="font-size: 16px;">
              Rp {{ formatJuta(stats.total_collection) }}
            </div>
            <div class="text-caption text-grey-6 text-weight-medium q-mt-xs" style="font-size: 10px;">
              Terbayar bulan ini
            </div>
          </q-card>
        </div>

        <div class="col-6 col-md-3">
          <q-card flat class="rounded-borders bg-white q-pa-md shadow-1 border-left-warning">
            <div class="text-caption text-weight-bold text-grey-7">KUNJUNGAN</div>
            <div class="text-h6 text-weight-bolder text-orange-9 q-mt-xs" style="font-size: 16px;">
              {{ stats.visited_count }} / {{ stats.total_plan_count }}
            </div>
            <div class="text-caption text-grey-6 text-weight-medium q-mt-xs" style="font-size: 10px;">
              Outlet dikunjungi ({{ Math.round((stats.visited_count / (stats.total_plan_count || 1)) * 100) }}%)
            </div>
          </q-card>
        </div>
      </div>

      <!-- Main Tabs (Sales vs Retur) -->
      <q-card flat class="rounded-borders bg-white shadow-1 overflow-hidden">
        <q-tabs
          v-model="activeReportTab"
          dense
          no-caps
          align="justify"
          active-color="red-9"
          indicator-color="red-9"
          class="text-grey-7 bg-grey-1 border-bottom"
        >
          <q-tab name="sales" label="Daftar Penjualan (Sales)" class="text-weight-bold" icon="receipt" />
          <q-tab name="return" label="Daftar Retur Barang" class="text-weight-bold" icon="assignment_return" />
        </q-tabs>

        <!-- Loading Spinner -->
        <div v-if="loading" class="text-center q-py-lg">
          <q-spinner color="red-9" size="32px" />
          <div class="text-caption text-grey-7 q-mt-xs">Memuat data laporan transaksi...</div>
        </div>

        <!-- Tab Panels -->
        <q-tab-panels v-else v-model="activeReportTab" animated class="bg-grey-2">
          <!-- Tab 1: Sales Orders -->
          <q-tab-panel name="sales" class="q-pa-md">
            <div v-if="salesHistory.length === 0" class="text-center q-py-md text-grey-6 text-caption">
              Belum ada data transaksi Sales Order untuk periode ini.
            </div>

            <div v-for="order in salesHistory" :key="order.order_id || order.id" class="q-mb-md">
              <q-card flat class="rounded-borders bg-white shadow-1 overflow-hidden" style="border: 1px solid #e2e8f0;">
                <div class="q-pa-md">
                  <!-- Header: Outlet Name & Status Badge -->
                  <div class="row justify-between items-center q-mb-xs">
                    <div class="text-weight-bold text-dark" style="font-size: 15px;">{{ order.nama_outlet || order.outletName }}</div>
                    <q-badge :color="getStatusColor(order.status)" class="text-weight-bold q-px-sm q-py-xs" style="font-size: 11px;">
                      {{ order.status }}
                    </q-badge>
                  </div>

                  <!-- Subtitle: PO Number & Date -->
                  <div class="text-caption text-grey-7 q-mb-sm flex items-center">
                    <q-icon name="tag" size="14px" class="q-mr-xs text-grey-5" /> {{ order.kode_order || order.poNumber }}
                    <span class="q-mx-xs">&bull;</span>
                    <q-icon name="event" size="14px" class="q-mr-xs text-grey-5" /> {{ order.date }}
                  </div>

                  <!-- Products Summary Box -->
                  <div class="bg-grey-1 rounded-borders q-pa-sm text-caption text-grey-8 q-mb-sm" style="line-height: 1.3;">
                    {{ order.product_summary || order.itemSummary }}
                  </div>

                  <!-- Footer: Total & Item Count -->
                  <div class="row justify-between items-center q-pt-sm" style="border-top: 1px dashed #e2e8f0;">
                    <div class="text-caption text-grey-6 text-weight-medium">{{ order.total_types || (order.itemsCount + ' Jenis Produk') }}</div>
                    <div class="text-weight-bolder" style="font-size: 16px; color: #701a1e;">{{ formatCurrency(order.total_amount || order.totalAmount) }}</div>
                  </div>
                </div>
              </q-card>
            </div>
          </q-tab-panel>

          <!-- Tab 2: Returns -->
          <q-tab-panel name="return" class="q-pa-md">
            <div v-if="returnHistory.length === 0" class="text-center q-py-md text-grey-6 text-caption">
              Belum ada data dokumen Retur untuk periode ini.
            </div>

            <div v-for="ret in returnHistory" :key="ret.return_id || ret.id" class="q-mb-md">
              <q-card flat class="rounded-borders bg-white shadow-1 overflow-hidden" style="border: 1px solid #e2e8f0;">
                <div class="q-pa-md">
                  <!-- Header: Outlet Name & Reason Badge -->
                  <div class="row justify-between items-center q-mb-xs">
                    <div class="text-weight-bold text-dark" style="font-size: 15px;">{{ ret.nama_outlet || ret.outletName }}</div>
                    <q-badge color="negative" outline class="text-weight-bold q-px-sm q-py-xs" style="font-size: 11px;">
                      {{ ret.solusi || ret.reason || 'Potong Tagihan AR' }}
                    </q-badge>
                  </div>

                  <!-- Subtitle: Return Number & Date -->
                  <div class="text-caption text-grey-7 q-mb-sm flex items-center">
                    <q-icon name="receipt_long" size="14px" class="q-mr-xs text-grey-5" /> {{ ret.kode_retur || ret.returnNumber }}
                    <span class="q-mx-xs">&bull;</span>
                    <q-icon name="event" size="14px" class="q-mr-xs text-grey-5" /> {{ ret.date }}
                  </div>

                  <!-- Return Detail Box -->
                  <div class="bg-red-1 text-negative rounded-borders q-pa-sm text-caption text-weight-bold q-mb-sm flex items-center">
                    <q-icon name="inventory_2" size="16px" class="q-mr-sm" /> {{ ret.product_summary || ret.productName }} ({{ ret.total_qty || ret.qty || 1 }} Pcs)
                  </div>

                  <!-- Footer: Total Value -->
                  <div class="row justify-between items-center q-pt-sm" style="border-top: 1px dashed #e2e8f0;">
                    <div class="text-caption text-grey-6 text-weight-medium">Nilai Retur Barang</div>
                    <div class="text-weight-bolder text-negative" style="font-size: 16px;">{{ formatCurrency(ret.total_nilai || ret.totalVal) }}</div>
                  </div>
                </div>
              </q-card>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>

    </div>
  </q-page>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import { api } from '../boot/axios'

const selectedPeriod = ref('Bulan Ini (Juli 2026)')
const periodOptions = [
  'Bulan Ini (Juli 2026)',
  'Bulan Lalu (Juni 2026)',
  'Semua Periode'
]

const activeReportTab = ref('sales')
const loading = ref(false)

const stats = ref({
  total_sales: 0,
  total_retur: 0,
  total_collection: 0,
  visited_count: 4,
  total_plan_count: 4
})

const salesHistory = ref([])
const returnHistory = ref([])

async function fetchReportData() {
  loading.value = true
  let p = 'this_month'
  if (selectedPeriod.value.includes('Lalu')) p = 'last_month'
  if (selectedPeriod.value.includes('Semua')) p = 'all'

  try {
    const res = await api.get('/reports', { params: { period: p } })
    if (res.data.success && res.data.data) {
      const d = res.data.data
      if (d.stats) stats.value = d.stats
      salesHistory.value = d.sales_orders || []
      returnHistory.value = d.returns || []
    }
  } catch (err) {
    console.error('Fetch reports error:', err)
  } finally {
    loading.value = false
  }
}

watch(selectedPeriod, () => {
  fetchReportData()
})

onMounted(() => {
  fetchReportData()
})

const getStatusColor = (status) => {
  switch (status) {
    case 'Disetujui':
    case 'Approved': return 'positive'
    case 'Dikirim':
    case 'Delivered': return 'positive'
    case 'Submitted': return 'cyan-9'
    case 'Pending': return 'warning'
    default: return 'grey-7'
  }
}

const formatCurrency = (val) => {
  if (!val || isNaN(val)) return 'Rp 0'
  return 'Rp ' + Number(val).toLocaleString('id-ID')
}

const formatJuta = (val) => {
  if (!val || isNaN(val)) return '0'
  if (val >= 1000000000) {
    return (val / 1000000000).toFixed(1).replace('.', ',') + ' Miliar'
  }
  if (val >= 1000000) {
    return (val / 1000000).toFixed(1).replace('.', ',') + ' Juta'
  }
  return Number(val).toLocaleString('id-ID')
}
</script>

<style lang="scss" scoped>
.max-width-container {
  max-width: 1100px;
}
.border-left-primary {
  border-left: 4px solid var(--q-primary);
}
.border-left-negative {
  border-left: 4px solid var(--q-negative);
}
.border-left-positive {
  border-left: 4px solid var(--q-positive);
}
.border-left-warning {
  border-left: 4px solid var(--q-warning);
}
</style>
