<template>
  <q-page class="q-pa-xs bg-grey-2" style="padding-bottom: 90px;">
    
    <!-- ── TOP HEADER (RETUR BARANG) ────────────────────────────────────── -->
    <div class="q-px-xs q-py-xs flex items-center justify-between q-mb-xs">
      <div>
        <div class="text-h6 text-weight-bolder text-dark" style="font-size: 20px; line-height: 1.2;">
          Retur Penjualan Produk
        </div>
        <div class="text-caption text-grey-7" style="font-size: 9.5px;">
          Modul pengembalian barang, penanganan stok & pemotongan tagihan AR.
        </div>
      </div>

      <q-btn
        unelevated
        no-caps
        icon="add"
        label="+ Retur Penjualan Baru"
        class="text-weight-bold shadow-1"
        style="background-color: #ef4444; color: #ffffff; font-size: 11px; padding: 6px 12px; border-radius: 8px;"
        @click="openCreateModal"
      />
    </div>

    <!-- ── 3 STAT CARDS ROW (MATCHING WEB ADMIN SS2 100%) ──────────────── -->
    <div class="row q-col-gutter-xs q-mb-xs">
      <div class="col-4">
        <q-card flat bordered class="rounded-borders q-pa-xs bg-white text-center shadow-1 full-height flex flex-col justify-between" style="border-color: #e2e8f0; min-height: 82px;">
          <div class="flex flex-center q-mt-xs">
            <q-avatar icon="assignment_return" color="red-1" text-color="negative" size="28px" />
          </div>
          <div class="text-subtitle2 text-weight-bolder text-dark q-my-none" style="font-size: 14px; line-height: 1.1;">
            {{ stats.total_retur }} Transaksi
          </div>
          <div class="text-caption text-grey-7 q-mb-xs" style="font-size: 8.5px;">TOTAL DOKUMEN RETUR</div>
        </q-card>
      </div>

      <div class="col-4">
        <q-card flat bordered class="rounded-borders q-pa-xs bg-white text-center shadow-1 full-height flex flex-col justify-between" style="border-color: #e2e8f0; min-height: 82px;">
          <div class="flex flex-center q-mt-xs">
            <q-avatar icon="inventory_2" color="amber-1" text-color="amber-9" size="28px" />
          </div>
          <div class="text-subtitle2 text-weight-bolder text-amber-10 q-my-none" style="font-size: 14px; line-height: 1.1;">
            {{ stats.total_qty }} Pcs
          </div>
          <div class="text-caption text-grey-7 q-mb-xs" style="font-size: 8.5px;">TOTAL BARANG DIRETUR</div>
        </q-card>
      </div>

      <div class="col-4">
        <q-card flat bordered class="rounded-borders q-pa-xs bg-white text-center shadow-1 full-height flex flex-col justify-between" style="border-color: #e2e8f0; min-height: 82px;">
          <div class="flex flex-center q-mt-xs">
            <q-avatar icon="payments" color="blue-1" text-color="primary" size="28px" />
          </div>
          <div class="text-subtitle2 text-weight-bolder text-red-9 q-my-none" style="font-size: 12px; line-height: 1.1;">
            Rp {{ formatRupiah(stats.nilai_retur) }}
          </div>
          <div class="text-caption text-grey-7 q-mb-xs" style="font-size: 8.5px;">TOTAL NILAI RETUR</div>
        </q-card>
      </div>
    </div>

    <!-- ── SEARCH BOX & FILTER CHIPS ─────────────────────────────────── -->
    <div class="row q-col-gutter-xs q-mb-xs items-center">
      <div class="col">
        <q-input
          v-model="searchQuery"
          dense
          outlined
          placeholder="Cari Kode Retur atau Outlet Customer..."
          class="bg-white rounded-borders"
          style="font-size: 11px; border-color: #cbd5e1;"
          clearable
          @update:model-value="fetchReturns"
        >
          <template v-slot:prepend>
            <q-icon name="search" size="18px" color="grey-6" />
          </template>
        </q-input>
      </div>
    </div>

    <div class="flex items-center q-gutter-xs overflow-auto no-wrap q-mb-xs">
      <q-chip
        v-for="st in statusOptions"
        :key="st"
        clickable
        dense
        :style="activeFilterStatus === st ? 'background-color: #701a1e; color: #ffffff;' : 'background-color: #ffffff; color: #334155; border: 1px solid #cbd5e1;'"
        class="text-weight-bold q-px-sm"
        style="font-size: 10px; height: 26px;"
        @click="activeFilterStatus = st; fetchReturns()"
      >
        {{ st }}
      </q-chip>
    </div>

    <!-- ── LIST OF RETUR ITEMS (MATCHING WEB ADMIN COLUMNS) ────────────── -->
    <div v-if="loadingReturns" class="text-center q-py-lg">
      <q-spinner color="primary" size="32px" />
      <div class="text-caption text-grey-7 q-mt-xs">Memuat data retur...</div>
    </div>

    <div v-else-if="filteredReturns.length === 0" class="text-center q-py-lg">
      <q-icon name="assignment_return" size="48px" color="grey-5" />
      <div class="text-caption text-grey-7 q-mt-xs">Tidak ada data retur barang ditemukan.</div>
    </div>

    <div v-else>
      <div
        v-for="item in filteredReturns"
        :key="item.return_id"
        class="q-mb-xs cursor-pointer"
        @click="openReturnDetail(item)"
      >
        <q-card flat bordered class="rounded-borders q-pa-sm bg-white shadow-1" style="border-color: #cbd5e1;">
          <!-- Header Code & Status -->
          <div class="flex items-center justify-between q-mb-xs">
            <div class="flex items-center">
              <span class="text-weight-bolder text-red-9 flex items-center" style="font-size: 12.5px;">
                <q-icon name="assignment_return" size="15px" class="q-mr-xs" />
                {{ item.kode_retur }}
              </span>
              <q-badge color="blue-1" text-color="primary" class="q-ml-xs text-weight-bold" style="font-size: 9px;">
                Ref Inv: {{ item.ref_invoice }}
              </q-badge>
            </div>

            <q-badge
              :color="item.status === 'Approved' || item.status === 'Disetujui' ? 'positive' : (item.status === 'Pending QC' ? 'warning' : 'primary')"
              class="text-weight-bold q-px-xs q-py-xs"
              style="font-size: 9.5px; border-radius: 4px;"
            >
              {{ item.status }}
            </q-badge>
          </div>

          <q-separator class="q-my-xs" />

          <!-- Body Info -->
          <div class="row q-col-gutter-xs text-caption" style="font-size: 10.5px;">
            <div class="col-7">
              <div class="text-weight-bold text-dark ellipsis">
                <q-icon name="storefront" size="13px" color="primary" class="q-mr-xs" />
                {{ item.nama_outlet }}
              </div>
              <div class="text-grey-7" style="font-size: 9.5px;">Tgl Retur: <b>{{ item.tgl_retur }}</b></div>
              <div class="q-mt-xs">
                <q-badge color="blue-9" class="text-weight-bold" style="font-size: 8.5px;">
                  💳 {{ item.penanganan_stok }}
                </q-badge>
              </div>
            </div>

            <div class="col-5 text-right flex flex-col justify-between items-end">
              <div class="text-grey-8 text-weight-bold" style="font-size: 10px;">
                Qty: <b class="text-dark">{{ item.total_qty }} Pcs</b>
              </div>
              <div class="text-weight-bolder text-no-wrap text-red-9" style="font-size: 13px;">
                Rp {{ formatRupiah(item.total_nilai) }}
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <!-- ── MODAL: FORM PENGAJUAN RETUR BARU (MATCHING WEB ADMIN FORM 100%) ── -->
    <q-dialog v-model="showCreateModal" persistent position="bottom">
      <q-card style="width: 100%; max-width: 500px; border-top-left-radius: 16px; border-top-right-radius: 16px;">
        <!-- Header Modal -->
        <q-card-section class="row items-center q-pb-none bg-red-9 text-white q-pa-sm">
          <div class="text-subtitle1 text-weight-bolder flex items-center">
            <q-icon name="assignment_return" size="20px" class="q-mr-xs" />
            Input Form Retur Penjualan Baru
          </div>
          <q-space />
          <q-btn icon="close" flat round dense color="white" v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-sm bg-white" style="max-height: 75vh; overflow-y: auto;">
          <!-- Kode Retur Auto Badge -->
          <div class="bg-red-1 text-red-9 q-pa-xs rounded-borders q-mb-xs flex items-center justify-between" style="font-size: 11px;">
            <span><q-icon name="tag" size="14px" class="q-mr-xs" /> Kode Retur Otomatis:</span>
            <b class="text-subtitle2 text-weight-bolder">{{ formRetur.kode_retur || 'RET/2026/07/0001' }}</b>
          </div>

          <!-- 1. Outlet Customer -->
          <q-select
            v-model="formRetur.outlet_id"
            :options="outletOptions"
            option-label="name"
            option-value="id"
            emit-value
            map-options
            dense
            outlined
            label="Pilih Outlet Customer *"
            class="q-mb-xs bg-grey-1"
            style="font-size: 11px;"
          />

          <!-- 2. Invoice Reference (Optional) -->
          <q-select
            v-model="formRetur.invoice_id"
            :options="invoiceOptions"
            option-label="label"
            option-value="id"
            emit-value
            map-options
            dense
            outlined
            label="Pilih Referensi Invoice (Opsional)"
            class="q-mb-xs bg-grey-1"
            style="font-size: 11px;"
            @update:model-value="onInvoiceSelected"
          />

          <!-- 3. Penanganan Stok & Solusi Tagihan (Credit Note AR / DO / Refund) -->
          <q-select
            v-model="formRetur.penanganan_stok"
            :options="solusiOptions"
            dense
            outlined
            label="Pilihan Solusi Pengembalian / Penanganan Tagihan *"
            class="q-mb-xs bg-blue-1 text-primary text-weight-bold"
            style="font-size: 11px;"
          />

          <!-- 4. Detail Produk Retur -->
          <div class="text-caption text-weight-bolder text-dark q-mt-xs q-mb-xs flex items-center">
            <q-icon name="inventory_2" size="14px" color="negative" class="q-mr-xs" />
            Produk Yang Diretur
          </div>

          <q-select
            v-model="selectedProductObj"
            :options="productOptions"
            option-label="name"
            dense
            outlined
            label="Pilih Produk SKU *"
            class="q-mb-xs bg-grey-1"
            style="font-size: 11px;"
            @update:model-value="onProductSelected"
          />

          <div class="row q-col-gutter-xs q-mb-xs">
            <div class="col-6">
              <q-input
                v-model.number="formRetur.qty"
                type="number"
                dense
                outlined
                label="Qty Retur *"
                class="bg-grey-1"
                style="font-size: 11px;"
                @update:model-value="calcTotalNilai"
              />
            </div>
            <div class="col-6">
              <q-input
                v-model.number="formRetur.price"
                type="number"
                dense
                outlined
                label="Harga Satuan (Rp) *"
                class="bg-grey-1"
                style="font-size: 11px;"
                @update:model-value="calcTotalNilai"
              />
            </div>
          </div>

          <!-- Total Nilai Breakdown Card -->
          <div class="bg-red-1 rounded-borders q-pa-xs q-mb-xs flex justify-between items-center" style="font-size: 11px;">
            <span class="text-grey-9 text-weight-bold">Subtotal Nilai Pengembalian:</span>
            <span class="text-subtitle2 text-weight-bolder text-red-9">Rp {{ formatRupiah(formRetur.total_nilai) }}</span>
          </div>

          <!-- 5. Alasan & Kondisi Barang -->
          <div class="row q-col-gutter-xs q-mb-xs">
            <div class="col-6">
              <q-select
                v-model="formRetur.alasan"
                :options="alasanOptions"
                dense
                outlined
                label="Alasan Retur"
                class="bg-grey-1"
                style="font-size: 10.5px;"
              />
            </div>
            <div class="col-6">
              <q-select
                v-model="formRetur.kondisi"
                :options="kondisiOptions"
                dense
                outlined
                label="Kondisi Barang"
                class="bg-grey-1"
                style="font-size: 10.5px;"
              />
            </div>
          </div>

          <q-input
            v-model="formRetur.catatan"
            dense
            outlined
            type="textarea"
            rows="2"
            label="Catatan Kerusakan / Keterangan Tambahan"
            class="q-mb-xs bg-grey-1"
            style="font-size: 11px;"
          />

          <!-- 6. Foto Bukti Kerusakan Produk -->
          <div class="text-caption text-weight-bold text-dark q-mb-xs flex items-center">
            <q-icon name="photo_camera" size="14px" color="negative" class="q-mr-xs" />
            Foto Bukti Kerusakan Produk (Kamera)
          </div>
          <input ref="photoInput" type="file" accept="image/*" capture="environment" style="display: none;" @change="onPhotoCaptured" />

          <div v-if="returPhotoUrl" class="relative-position text-center q-mb-xs">
            <img :src="returPhotoUrl" class="rounded-borders shadow-1" style="width: 100%; max-height: 140px; object-fit: cover;" />
            <q-btn round dense icon="close" color="negative" size="xs" class="absolute-top-right q-ma-xs" @click="returPhotoUrl = ''" />
          </div>

          <q-btn
            v-else
            outline
            color="negative"
            icon="photo_camera"
            label="Ambil Foto Bukti Retur (Kamera)"
            class="full-width text-weight-bold q-mb-xs"
            height="38px"
            no-caps
            @click="$refs.photoInput.click()"
          />
        </q-card-section>

        <!-- Modal Footer Actions -->
        <q-card-actions align="right" class="bg-grey-2 q-pa-sm">
          <q-btn flat label="Batal" color="grey-8" v-close-popup no-caps />
          <q-btn
            label="Kirim Pengajuan Retur"
            color="red-9"
            class="text-weight-bolder shadow-2"
            no-caps
            :loading="submittingRetur"
            @click="submitNewReturn"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- ── MODAL: DETAIL RETUR BARANG ────────────────────────────────── -->
    <q-dialog v-model="showDetailModal">
      <q-card style="width: 100%; max-width: 460px;" class="rounded-borders overflow-hidden">
        <q-card-section class="bg-red-9 text-white flex items-center justify-between q-pa-sm">
          <div class="text-subtitle2 text-weight-bold flex items-center">
            <q-icon name="assignment_return" size="18px" class="q-mr-xs" />
            Detail Retur: {{ activeReturDetail?.kode_retur }}
          </div>
          <q-btn icon="close" flat round dense color="white" v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-sm" v-if="activeReturDetail">
          <div class="flex items-center justify-between q-mb-xs">
            <span class="text-caption text-grey-7">Status Pengajuan:</span>
            <q-badge color="positive" class="text-weight-bold">{{ activeReturDetail.status }}</q-badge>
          </div>
          <div class="text-subtitle2 text-weight-bolder text-dark">{{ activeReturDetail.nama_outlet }}</div>
          <div class="text-caption text-grey-7" style="font-size: 10px;">Ref Faktur: <b>{{ activeReturDetail.ref_invoice }}</b> | Tgl: {{ activeReturDetail.tgl_retur }}</div>
          <div class="text-caption text-blue-9 text-weight-bold q-mt-xs" style="font-size: 10px;">Solusi: {{ activeReturDetail.penanganan_stok }}</div>

          <q-separator class="q-my-xs" />

          <div class="text-caption text-weight-bold text-dark q-mb-xs">Barang Yang Diretur:</div>
          <div class="bg-red-1 rounded-borders q-pa-xs q-mb-xs">
            <div class="flex justify-between items-center text-caption text-weight-bold text-dark" style="font-size: 10.5px;">
              <span>{{ activeReturDetail.product_name || 'Produk Retur' }}</span>
              <span>{{ activeReturDetail.total_qty }} Pcs</span>
            </div>
            <div class="flex justify-between items-center text-caption text-red-9 text-weight-bolder q-mt-xs" style="font-size: 11px;">
              <span>Nilai Pengembalian:</span>
              <span>Rp {{ formatRupiah(activeReturDetail.total_nilai) }}</span>
            </div>
          </div>

          <div v-if="activeReturDetail.foto_bukti" class="q-my-xs text-center">
            <img :src="activeReturDetail.foto_bukti" class="rounded-borders border" style="max-height: 160px; width: 100%; object-fit: contain;" />
          </div>

          <div class="text-caption text-grey-7" style="font-size: 9.5px;">Catatan: {{ activeReturDetail.catatan || 'Kemasan retak & bocor saat pengiriman.' }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from '../boot/axios'

const $q = useQuasar()
const searchQuery = ref('')
const activeFilterStatus = ref('Semua')
const statusOptions = ['Semua', 'Pending QC', 'Disetujui', 'Diproses']

const showCreateModal = ref(false)
const showDetailModal = ref(false)
const submittingRetur = ref(false)
const loadingReturns = ref(false)
const activeReturDetail = ref(null)
const returPhotoUrl = ref('')
const selectedPhotoFile = ref(null)

const stats = ref({
  total_retur: 1,
  total_qty: 2,
  nilai_retur: 170000,
  pending: 0,
  approved: 1
})

const outletOptions  = ref([])
const invoiceOptions = ref([])
const productOptions = ref([])
const selectedProductObj = ref(null)

const solusiOptions = [
  'Potong Tagihan AR',
  'Ganti Barang Baru',
  'Refund Cash'
]

const alasanOptions = [
  'Kemasan Rusak / Bocor',
  'Produk Kadaluwarsa (Expired)',
  'Cacat Pabrik / Defect',
  'Salah Kirim Produk / Qty'
]

const kondisiOptions = [
  'Kemasan Rusak',
  'Expired',
  'Cacat Pabrik',
  'Bocor saat Pengiriman'
]

const formRetur = ref({
  kode_retur: 'RET/2026/07/0001',
  outlet_id: null,
  invoice_id: null,
  penanganan_stok: 'Potong Tagihan AR',
  product_id: null,
  qty: 1,
  price: 85000,
  total_nilai: 85000,
  alasan: 'Kemasan Rusak / Bocor',
  kondisi: 'Kemasan Rusak',
  catatan: ''
})

const returnsList = ref([])

const filteredReturns = computed(() => {
  let list = returnsList.value
  if (activeFilterStatus.value !== 'Semua') {
    list = list.filter(r => (r.status || '').toLowerCase().includes(activeFilterStatus.value.toLowerCase()))
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(r => (r.kode_retur || '').toLowerCase().includes(q) || (r.nama_outlet || '').toLowerCase().includes(q))
  }
  return list
})

async function fetchReturns() {
  loadingReturns.value = true
  try {
    const res = await api.get('/returns', {
      params: {
        search: searchQuery.value,
        status: activeFilterStatus.value
      }
    })
    if (res.data.success && res.data.data) {
      returnsList.value = res.data.data.returns || []
      if (res.data.data.stats) {
        stats.value = res.data.data.stats
      }
    }
  } catch (err) {
    console.error('Fetch returns error:', err)
  } finally {
    loadingReturns.value = false
  }
}

async function openCreateModal() {
  showCreateModal.value = true
  try {
    const res = await api.get('/returns/form-data')
    if (res.data.success && res.data.data) {
      const d = res.data.data
      formRetur.value.kode_retur = d.kode_retur
      outletOptions.value = d.outlets || []
      
      const invList = (d.invoices || []).map(i => ({
        ...i,
        label: `${i.code} — ${i.outlet_name} (Sisa: Rp ${Number(i.sisa_tagihan).toLocaleString('id-ID')})`
      }))
      invoiceOptions.value = [
        { id: null, label: '-- Tidak Terkait / Retur Bebas --', outlet_id: null },
        ...invList
      ]

      productOptions.value = d.products || []
      if (productOptions.value.length > 0) {
        selectedProductObj.value = productOptions.value[0]
        onProductSelected(productOptions.value[0])
      }

      if (outletOptions.value.length > 0 && !formRetur.value.outlet_id) {
        formRetur.value.outlet_id = outletOptions.value[0].id
      }
    }
  } catch (err) {
    console.error('Fetch return form-data error:', err)
  }
}

function onInvoiceSelected(invId) {
  if (!invId) return
  const foundInv = invoiceOptions.value.find(i => i.id === invId)
  if (foundInv && foundInv.outlet_id) {
    formRetur.value.outlet_id = foundInv.outlet_id
  }
}

function onProductSelected(prod) {
  if (!prod) return
  formRetur.value.product_id = prod.id
  formRetur.value.price = prod.price || 85000
  calcTotalNilai()
}

function calcTotalNilai() {
  const q = Number(formRetur.value.qty || 1)
  const p = Number(formRetur.value.price || 0)
  formRetur.value.total_nilai = q * p
}

function openReturnDetail(item) {
  activeReturDetail.value = item
  showDetailModal.value = true
}

function onPhotoCaptured(e) {
  const file = e.target.files?.[0]
  if (!file) return
  selectedPhotoFile.value = file
  const reader = new FileReader()
  reader.onload = (evt) => {
    returPhotoUrl.value = evt.target.result
  }
  reader.readAsDataURL(file)
}

async function submitNewReturn() {
  if (!formRetur.value.outlet_id) {
    $q.notify({ type: 'warning', message: 'Silakan pilih Outlet Customer terlebih dahulu!' })
    return
  }

  submittingRetur.value = true
  try {
    const formData = new FormData()
    formData.append('OUTLET_ID', formRetur.value.outlet_id)
    if (formRetur.value.invoice_id) formData.append('INVOICE_ID', formRetur.value.invoice_id)
    formData.append('PENANGANAN_STOK', formRetur.value.penanganan_stok)
    formData.append('PRODUCT_ID', formRetur.value.product_id || 1)
    formData.append('QTY_RETUR', formRetur.value.qty || 1)
    formData.append('HARGA_SATUAN', formRetur.value.price || 0)
    formData.append('TOTAL_NILAI', formRetur.value.total_nilai)
    formData.append('ALASAN_RETUR', formRetur.value.alasan)
    formData.append('KONDISI_BARANG', formRetur.value.kondisi)
    formData.append('CATATAN', formRetur.value.catatan || 'Retur barang rusak')

    if (selectedPhotoFile.value) {
      formData.append('foto_bukti', selectedPhotoFile.value)
    }

    const res = await api.post('/returns', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    if (res.data.success) {
      $q.notify({
        type: 'positive',
        icon: 'check_circle',
        message: 'Pengajuan Retur Berhasil Disimpan ke Web Center!',
        caption: `Kode: ${res.data.data?.kode_retur || formRetur.value.kode_retur}`,
        position: 'top'
      })
      showCreateModal.value = false
      returPhotoUrl.value = ''
      selectedPhotoFile.value = null
      fetchReturns()
    } else {
      $q.notify({ type: 'negative', message: res.data.message || 'Gagal menyimpan retur' })
    }
  } catch (err) {
    console.error('Submit return error:', err)
    $q.notify({ type: 'negative', message: 'Gagal mengirim pengajuan retur ke server.' })
  } finally {
    submittingRetur.value = false
  }
}

function formatRupiah(val) {
  if (!val || isNaN(val)) return '0'
  return Number(val).toLocaleString('id-ID')
}

onMounted(() => {
  fetchReturns()
})
</script>
