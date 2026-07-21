<template>
  <q-page class="q-pa-md bg-grey-1" style="min-height: 100vh;">
    <div class="flex items-center q-mb-lg">
      <q-btn flat round icon="arrow_back" color="dark" @click="$router.push('/dashboard')" />
      <h6 class="text-h6 text-weight-bolder text-dark q-my-none q-ml-sm">Buat Journey Plan</h6>
    </div>

    <q-card flat class="bg-white q-pa-md rounded-borders shadow-2">
      <q-form @submit="onSubmit" class="q-gutter-md">
        
        <!-- Tanggal -->
        <div>
          <div class="text-caption text-weight-bold text-grey-8 q-mb-sm">Tanggal Kunjungan</div>
          <q-input
            v-model="form.TGL_PLAN"
            type="date"
            outlined
            dense
            color="primary"
            :rules="[val => !!val || 'Tanggal wajib diisi']"
          />
        </div>

        <!-- Pilih Outlet -->
        <div>
          <div class="text-caption text-weight-bold text-grey-8 q-mb-sm">Pilih Outlet (Bisa lebih dari 1)</div>
          <q-select
            v-model="form.outlets"
            :options="filteredOutlets"
            option-value="OUTLET_ID"
            option-label="NAMA_OUTLET"
            multiple
            use-chips
            outlined
            dense
            color="primary"
            emit-value
            map-options
            use-input
            input-debounce="0"
            @filter="filterFn"
            :loading="loadingOutlets"
            :rules="[val => val.length > 0 || 'Pilih minimal 1 outlet']"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Outlet tidak ditemukan
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>

        <div class="q-mt-xl">
          <q-btn
            label="Ajukan Journey Plan"
            type="submit"
            color="primary"
            class="full-width text-weight-bold shadow-3"
            rounded
            size="md"
            :loading="submitting"
            unelevated
          />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
// import axios from 'axios'

const router = useRouter()
const $q = useQuasar()

/* --- KODE API ASLI DIKOMEN ---
const api = axios.create({ baseURL: 'http://sales.test/api/mobile' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sales_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
--- */

// Format today YYYY-MM-DD
const today = new Date().toISOString().split('T')[0]

const form = ref({
  TGL_PLAN: today,
  outlets: []
})

const outlets = ref([])
const filteredOutlets = ref([])
const loadingOutlets = ref(false)
const submitting = ref(false)

const loadOutlets = async () => {
  loadingOutlets.value = true
  
  // -- MOCK OUTLETS --
  setTimeout(() => {
    outlets.value = [
      { OUTLET_ID: 1, NAMA_OUTLET: 'Apotek Sehat Jaya' },
      { OUTLET_ID: 2, NAMA_OUTLET: 'RS Medika Utama' },
      { OUTLET_ID: 3, NAMA_OUTLET: 'Klinik Bhakti Husada' },
      { OUTLET_ID: 4, NAMA_OUTLET: 'Depot Sumber Rezeki (Mock)' }
    ]
    filteredOutlets.value = outlets.value
    loadingOutlets.value = false
  }, 800)

  /* --- API ASLI DIKOMEN ---
  try {
    const response = await api.get('/outlets')
    if (response.data.success) {
      outlets.value = response.data.data
      filteredOutlets.value = outlets.value
    }
  } catch (e) {
    console.error(e)
    $q.notify({ type: 'negative', message: 'Gagal memuat daftar outlet' })
  } finally {
    loadingOutlets.value = false
  }
  --- */
}

const filterFn = (val, update) => {
  if (val === '') {
    update(() => {
      filteredOutlets.value = outlets.value
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    filteredOutlets.value = outlets.value.filter(
      v => v.NAMA_OUTLET.toLowerCase().indexOf(needle) > -1
    )
  })
}

const onSubmit = async () => {
  submitting.value = true
  
  // -- MOCK SUBMIT --
  setTimeout(() => {
    submitting.value = false
    $q.notify({
      type: 'positive',
      message: 'Journey plan berhasil diajukan (Mock)',
      position: 'top'
    })
    router.push('/dashboard')
  }, 1000)

  /* --- API ASLI DIKOMEN ---
  try {
    const response = await api.post('/journey-plans', form.value)
    if (response.data.success) {
      $q.notify({
        type: 'positive',
        message: 'Journey plan berhasil diajukan',
        position: 'top'
      })
      router.push('/dashboard')
    }
  } catch (e) {
    console.error(e)
    $q.notify({
      type: 'negative',
      message: 'Terjadi kesalahan saat mengajukan.',
      position: 'top'
    })
  } finally {
    submitting.value = false
  }
  --- */
}

onMounted(() => {
  loadOutlets()
})
</script>

<style scoped>
.rounded-borders {
  border-radius: 16px;
}
</style>
