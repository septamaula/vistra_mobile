<template>
  <q-page class="bg-grey-2" style="min-height: 100vh;">
    <!-- Reusable Compact Header -->
    <AppHeader title="Laporan Sales & Retur" subtitle="Rekapitulasi pencapaian target & retur barang" />

    <div class="q-pa-md max-width-container mx-auto">
      
      <!-- Period Selector & Filter Card -->
      <q-card flat class="rounded-borders bg-white q-pa-md q-mb-md shadow-1">
        <div class="row justify-between items-center">
          <div class="text-caption text-weight-bold text-dark flex items-center">
            <q-icon name="calendar_today" color="primary" class="q-mr-xs" size="18px" /> Periode Laporan
          </div>
          <q-select 
            v-model="selectedPeriod" 
            :options="periodOptions" 
            dense outlined rounded 
            bg-color="grey-1"
            style="min-width: 180px;"
            options-selected-class="text-weight-bold text-primary"
          />
        </div>
      </q-card>

      <!-- KPI Summary Cards -->
      <div class="row q-col-gutter-sm q-mb-md">
        <div class="col-6 col-md-3">
          <q-card flat class="rounded-borders bg-white q-pa-md shadow-1 border-left-primary">
            <div class="text-caption text-weight-bold text-grey-7">TOTAL SALES (MTD)</div>
            <div class="text-h6 text-weight-bolder text-primary q-mt-xs" style="font-size: 17px;">
              Rp 145,8 Juta
            </div>
            <div class="text-caption text-positive text-weight-bold q-mt-xs flex items-center">
              <q-icon name="trending_up" size="14px" class="q-mr-xs" /> 73% dari Target
            </div>
          </q-card>
        </div>

        <div class="col-6 col-md-3">
          <q-card flat class="rounded-borders bg-white q-pa-md shadow-1 border-left-negative">
            <div class="text-caption text-weight-bold text-grey-7">TOTAL RETUR</div>
            <div class="text-h6 text-weight-bolder text-negative q-mt-xs" style="font-size: 17px;">
              Rp 4,25 Juta
            </div>
            <div class="text-caption text-grey-6 text-weight-medium q-mt-xs">
              2,9% dari total sales
            </div>
          </q-card>
        </div>

        <div class="col-6 col-md-3">
          <q-card flat class="rounded-borders bg-white q-pa-md shadow-1 border-left-positive">
            <div class="text-caption text-weight-bold text-grey-7">COLLECTION (AR)</div>
            <div class="text-h6 text-weight-bolder text-positive q-mt-xs" style="font-size: 17px;">
              Rp 98,5 Juta
            </div>
            <div class="text-caption text-grey-6 text-weight-medium q-mt-xs">
              Terbayar bulan ini
            </div>
          </q-card>
        </div>

        <div class="col-6 col-md-3">
          <q-card flat class="rounded-borders bg-white q-pa-md shadow-1 border-left-warning">
            <div class="text-caption text-weight-bold text-grey-7">KUNJUNGAN</div>
            <div class="text-h6 text-weight-bolder text-orange-9 q-mt-xs" style="font-size: 17px;">
              48 / 60
            </div>
            <div class="text-caption text-grey-6 text-weight-medium q-mt-xs">
              Outlet dikunjungi (80%)
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
          active-color="primary"
          indicator-color="primary"
          class="text-grey-7 bg-grey-1 border-bottom"
        >
          <q-tab name="sales" label="Daftar Penjualan (Sales)" class="text-weight-bold" icon="receipt" />
          <q-tab name="return" label="Daftar Retur Barang" class="text-weight-bold" icon="assignment_return" />
        </q-tabs>

        <!-- Tab 1: Sales Orders -->
        <q-tab-panels v-model="activeReportTab" animated class="bg-grey-2">
          <q-tab-panel name="sales" class="q-pa-md">
            <div v-for="order in salesHistory" :key="order.id" class="q-mb-md">
              <q-card flat class="rounded-borders bg-white shadow-1 overflow-hidden" style="border: 1px solid #e2e8f0;">
                <div class="q-pa-md">
                  <!-- Header: Outlet Name & Status Badge -->
                  <div class="row justify-between items-center q-mb-xs">
                    <div class="text-weight-bold text-dark" style="font-size: 15px;">{{ order.outletName }}</div>
                    <q-badge :color="getStatusColor(order.status)" class="text-weight-bold q-px-sm q-py-xs" style="font-size: 11px;">
                      {{ order.status }}
                    </q-badge>
                  </div>

                  <!-- Subtitle: PO Number & Date -->
                  <div class="text-caption text-grey-7 q-mb-sm flex items-center">
                    <q-icon name="tag" size="14px" class="q-mr-xs text-grey-5" /> {{ order.poNumber }}
                    <span class="q-mx-xs">&bull;</span>
                    <q-icon name="event" size="14px" class="q-mr-xs text-grey-5" /> {{ order.date }}
                  </div>

                  <!-- Products Summary Box -->
                  <div class="bg-grey-1 rounded-borders q-pa-sm text-caption text-grey-8 q-mb-sm" style="line-height: 1.3;">
                    {{ order.itemSummary }}
                  </div>

                  <!-- Footer: Total & Item Count -->
                  <div class="row justify-between items-center q-pt-sm" style="border-top: 1px dashed #e2e8f0;">
                    <div class="text-caption text-grey-6 text-weight-medium">{{ order.itemsCount }} Jenis Produk</div>
                    <div class="text-weight-bolder text-primary" style="font-size: 16px;">{{ formatCurrency(order.totalAmount) }}</div>
                  </div>
                </div>
              </q-card>
            </div>
          </q-tab-panel>

          <!-- Tab 2: Returns -->
          <q-tab-panel name="return" class="q-pa-md">
            <div v-for="ret in returnHistory" :key="ret.id" class="q-mb-md">
              <q-card flat class="rounded-borders bg-white shadow-1 overflow-hidden" style="border: 1px solid #e2e8f0;">
                <div class="q-pa-md">
                  <!-- Header: Outlet Name & Reason Badge -->
                  <div class="row justify-between items-center q-mb-xs">
                    <div class="text-weight-bold text-dark" style="font-size: 15px;">{{ ret.outletName }}</div>
                    <q-badge color="negative" outline class="text-weight-bold q-px-sm q-py-xs" style="font-size: 11px;">
                      {{ ret.reason }}
                    </q-badge>
                  </div>

                  <!-- Subtitle: Return Number & Date -->
                  <div class="text-caption text-grey-7 q-mb-sm flex items-center">
                    <q-icon name="receipt_long" size="14px" class="q-mr-xs text-grey-5" /> {{ ret.returnNumber }}
                    <span class="q-mx-xs">&bull;</span>
                    <q-icon name="event" size="14px" class="q-mr-xs text-grey-5" /> {{ ret.date }}
                  </div>

                  <!-- Return Detail Box -->
                  <div class="bg-red-1 text-negative rounded-borders q-pa-sm text-caption text-weight-bold q-mb-sm flex items-center">
                    <q-icon name="inventory_2" size="16px" class="q-mr-sm" /> {{ ret.productName }} ({{ ret.qty }} Pack)
                  </div>

                  <!-- Footer: Total Value -->
                  <div class="row justify-between items-center q-pt-sm" style="border-top: 1px dashed #e2e8f0;">
                    <div class="text-caption text-grey-6 text-weight-medium">Nilai Retur Barang</div>
                    <div class="text-weight-bolder text-negative" style="font-size: 16px;">{{ formatCurrency(ret.totalVal) }}</div>
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
import { ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue'

const selectedPeriod = ref('Bulan Ini (Juli 2026)')
const periodOptions = [
  'Bulan Ini (Juli 2026)',
  'Bulan Lalu (Juni 2026)',
  'Kuartal Ini (Q3)'
]

const activeReportTab = ref('sales')

const salesHistory = ref([
  {
    id: 1,
    outletName: 'Apotek Sehat Jaya',
    poNumber: 'PO-2026-0701',
    date: '21 Jul 2026, 09:30',
    totalAmount: 12500000,
    itemsCount: 4,
    itemSummary: 'Paracetamol 500mg (10x), Amoxicillin (5x), Vitamin C...',
    status: 'Disetujui'
  },
  {
    id: 2,
    outletName: 'RS Medika Utama',
    poNumber: 'PO-2026-0702',
    date: '20 Jul 2026, 14:15',
    totalAmount: 48000000,
    itemsCount: 12,
    itemSummary: 'Cairan Infus NaCl (50x), Masker Medis (20x)...',
    status: 'Dikirim'
  },
  {
    id: 3,
    outletName: 'Klinik Bhakti Husada',
    poNumber: 'PO-2026-0699',
    date: '19 Jul 2026, 11:00',
    totalAmount: 8400000,
    itemsCount: 3,
    itemSummary: 'Betadine Antiseptic (15x), Vitamin C (10x)',
    status: 'Pending'
  }
])

const returnHistory = ref([
  {
    id: 1,
    outletName: 'Apotek Sehat Jaya',
    returnNumber: 'RET-2026-0012',
    date: '21 Jul 2026, 09:45',
    productName: 'Paracetamol 500mg',
    qty: 5,
    totalVal: 60000,
    reason: 'Kedaluwarsa (Expired)'
  },
  {
    id: 2,
    outletName: 'Toko Obat Sumber Rezeki',
    returnNumber: 'RET-2026-0009',
    date: '18 Jul 2026, 13:20',
    productName: 'Betadine Antiseptic 60ml',
    qty: 10,
    totalVal: 320000,
    reason: 'Kemasan Rusak'
  }
])

const getStatusColor = (status) => {
  switch (status) {
    case 'Disetujui': return 'positive'
    case 'Dikirim': return 'primary'
    case 'Pending': return 'warning'
    default: return 'grey-7'
  }
}

const formatCurrency = (val) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)
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
