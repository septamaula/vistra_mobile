<template>
  <q-page class="bg-grey-2" style="min-height: 100vh;">
    <!-- Compact Reusable Header Component -->
    <AppHeader title="Katalog Produk" subtitle="Daftar obat, alkes, & daftar harga resmi" />

    <div class="q-pa-md max-width-container mx-auto">

      <!-- Search & Filters -->
      <q-card flat class="rounded-borders bg-white q-pa-md q-mb-md shadow-1">
        <div class="row q-col-gutter-sm items-center">
          <div class="col-12 col-sm-7">
            <q-input v-model="search" dense outlined rounded placeholder="Cari nama obat, alkes, atau SKU..." class="bg-grey-1">
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
              v-model="selectedCategory" 
              :options="categories" 
              dense outlined rounded 
              bg-color="grey-1"
              options-selected-class="text-weight-bold text-primary"
            >
              <template v-slot:prepend>
                <q-icon name="filter_alt" color="primary" />
              </template>
            </q-select>
          </div>
        </div>
      </q-card>

      <!-- Product List Grid -->
      <div class="row q-col-gutter-md">
        <div v-for="product in filteredProducts" :key="product.id" class="col-12 col-sm-6 col-md-4">
          <q-card flat class="rounded-borders bg-white shadow-1 column justify-between h-100 style-card">
            <q-card-section>
              <div class="flex justify-between items-start q-mb-xs">
                <q-badge :color="getCategoryColor(product.category)" text-color="white" class="text-weight-bold q-pa-xs">
                  {{ product.category }}
                </q-badge>
                <q-badge outline color="positive" class="text-weight-bold">
                  Stok: {{ product.stock }} {{ product.unit }}
                </q-badge>
              </div>

              <div class="text-weight-bold text-dark q-mt-sm" style="font-size: 15px; line-height: 1.3;">
                {{ product.name }}
              </div>
              <div class="text-caption text-grey-6 q-mt-xs">
                SKU: {{ product.sku }} &bull; Kategori: {{ product.category }}
              </div>

              <div class="text-caption text-grey-8 q-mt-sm" style="font-size: 12px; line-height: 1.3;">
                {{ product.description }}
              </div>
            </q-card-section>

            <q-card-section class="bg-grey-1 flex items-center justify-between q-pa-md" style="border-top: 1px solid #f1f5f9;">
              <div>
                <div class="text-caption text-grey-6 text-weight-bold">Harga HET</div>
                <div class="text-weight-bolder text-primary" style="font-size: 16px;">
                  {{ formatCurrency(product.price) }}
                  <span class="text-caption text-grey-7">/{{ product.unit }}</span>
                </div>
              </div>
              <q-btn color="primary" flat round icon="info" @click="showDetail(product)" />
            </q-card-section>
          </q-card>
        </div>

        <div v-if="filteredProducts.length === 0" class="col-12 text-center q-py-xl">
          <q-icon name="medication_liquid" size="64px" color="grey-4" />
          <div class="text-h6 text-grey-6 q-mt-md">Produk Tidak Ditemukan</div>
          <div class="text-caption text-grey-5">Coba kata kunci pencarian lain atau pilih kategori Semua.</div>
        </div>
      </div>

    </div>

    <!-- Product Detail Modal -->
    <q-dialog v-model="detailOpen">
      <q-card style="width: 400px; max-width: 90vw;" class="rounded-borders">
        <q-card-section class="bg-primary text-white flex items-center justify-between">
          <div class="text-subtitle1 text-weight-bold">Detail Produk</div>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>

        <q-card-section v-if="activeProduct" class="q-pa-md">
          <div class="text-h6 text-weight-bolder text-dark">{{ activeProduct.name }}</div>
          <q-badge color="primary" class="q-mt-xs q-mb-md">{{ activeProduct.category }}</q-badge>

          <q-list separator dense class="rounded-borders bordered bg-grey-1">
            <q-item>
              <q-item-section class="text-grey-7">Kode SKU</q-item-section>
              <q-item-section class="text-weight-bold text-right">{{ activeProduct.sku }}</q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-grey-7">Kemasan / Unit</q-item-section>
              <q-item-section class="text-weight-bold text-right">{{ activeProduct.unit }}</q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-grey-7">Stok Gudang Pusat</q-item-section>
              <q-item-section class="text-weight-bold text-positive text-right">{{ activeProduct.stock }} {{ activeProduct.unit }}</q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-grey-7">Harga Satuan (HET)</q-item-section>
              <q-item-section class="text-weight-bolder text-primary text-right">{{ formatCurrency(activeProduct.price) }}</q-item-section>
            </q-item>
          </q-list>

          <div class="text-caption text-weight-bold text-dark q-mt-md q-mb-xs">Indikasi & Manfaat:</div>
          <div class="text-caption text-grey-8">{{ activeProduct.indication }}</div>

          <div class="text-caption text-weight-bold text-dark q-mt-sm q-mb-xs">Produsen / Distribusi:</div>
          <div class="text-caption text-grey-8">PT Penta Valent Tbk</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppHeader from '@/components/AppHeader.vue'

const search = ref('')
const selectedCategory = ref('Semua')

const categories = [
  'Semua',
  'Obat Bebas',
  'Obat Resep',
  'Vitamin & Suplemen',
  'P3K',
  'Alat Kesehatan',
  'Cairan Medis'
]

const products = ref([
  {
    id: 1,
    sku: 'PV-MED-001',
    name: 'Paracetamol 500mg (Strip 10)',
    category: 'Obat Bebas',
    price: 12000,
    unit: 'Strip',
    stock: 450,
    description: 'Pereda demam dan pereda nyeri ringan hingga sedang.',
    indication: 'Meringankan sakit kepala, sakit gigi, dan menurunkan demam.'
  },
  {
    id: 2,
    sku: 'PV-MED-002',
    name: 'Amoxicillin 500mg (Box 100)',
    category: 'Obat Resep',
    price: 85000,
    unit: 'Box',
    stock: 120,
    description: 'Antibiotik spektrum luas untuk infeksi bakteri.',
    indication: 'Mengobati infeksi saluran pernapasan, saluran kemih, dan kulit.'
  },
  {
    id: 3,
    sku: 'PV-VIT-001',
    name: 'Vitamin C 1000mg (Botol 30)',
    category: 'Vitamin & Suplemen',
    price: 45000,
    unit: 'Botol',
    stock: 230,
    description: 'Suplemen kesehatan untuk meningkatkan imunitas tubuh.',
    indication: 'Membantu menjaga daya tahan tubuh dan sebagai antioksidan.'
  },
  {
    id: 4,
    sku: 'PV-P3K-001',
    name: 'Betadine Antiseptic Solution 60ml',
    category: 'P3K',
    price: 32000,
    unit: 'Botol',
    stock: 85,
    description: 'Cairan antiseptik pembersih luka.',
    indication: 'Mencegah infeksi pada luka potong, luka gores, dan luka bakar ringan.'
  },
  {
    id: 5,
    sku: 'PV-ALK-001',
    name: 'Masker Medis 3-Ply (Box 50)',
    category: 'Alat Kesehatan',
    price: 25000,
    unit: 'Box',
    stock: 600,
    description: 'Masker perlindungan pernapasan 3 lapis standar RS.',
    indication: 'Menyaring bakteri, debu, dan droplet udara.'
  },
  {
    id: 6,
    sku: 'PV-FLU-001',
    name: 'Cairan Infus NaCl 0.9% 500ml',
    category: 'Cairan Medis',
    price: 18000,
    unit: 'Kolf',
    stock: 310,
    description: 'Cairan fisiologis pembersih & hidrasi medis.',
    indication: 'Mengganti cairan tubuh yang hilang dan pembilas luka steril.'
  }
])

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchCategory = selectedCategory.value === 'Semua' || p.category === selectedCategory.value
    const matchSearch = !search.value || 
      p.name.toLowerCase().includes(search.value.toLowerCase()) || 
      p.sku.toLowerCase().includes(search.value.toLowerCase())
    return matchCategory && matchSearch
  })
})

const getCategoryColor = (cat) => {
  switch (cat) {
    case 'Obat Bebas': return 'blue-7'
    case 'Obat Resep': return 'red-7'
    case 'Vitamin & Suplemen': return 'amber-9'
    case 'P3K': return 'teal-7'
    case 'Alat Kesehatan': return 'purple-7'
    case 'Cairan Medis': return 'cyan-8'
    default: return 'primary'
  }
}

const formatCurrency = (val) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)
}

const detailOpen = ref(false)
const activeProduct = ref(null)

const showDetail = (product) => {
  activeProduct.value = product
  detailOpen.value = true
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
