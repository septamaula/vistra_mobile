<template>
  <q-page class="login-page">
    <!-- Image Background -->
    <div class="hero-section">
      <q-img
        src="/images/login-hero.png"
        class="hero-image"
        fit="cover"
        position="center"
      />
      <div class="hero-overlay"></div>
    </div>

    <div class="header-space"></div>

    <!-- Bottom Glassmorphism Form Sheet -->
    <div class="glass-sheet">
      <div class="q-px-lg q-pt-lg q-pb-sm text-center">
        <div class="logo-wrapper q-mx-auto q-mb-md flex flex-center shadow-4">
          <q-icon name="trending_up" size="2.5rem" color="primary" />
        </div>
        <h4 class="text-h4 text-weight-bolder text-white q-mt-none q-mb-xs">Vistra</h4>
        <div class="text-subtitle1 text-white text-opacity-80">Selamat datang, silakan masuk</div>
      </div>
      
      <div class="q-px-lg q-pb-lg">
        <q-form @submit="onSubmit" class="q-gutter-y-md">
          
          <!-- Email Input -->
          <div>
            <q-input
              v-model="form.email"
              placeholder="Alamat Email"
              type="email"
              borderless
              dark
              class="glass-input q-mb-xs"
              lazy-rules
              :rules="[
                val => !!val || 'Email wajib diisi',
                val => /.+@.+\..+/.test(val) || 'Format email tidak valid'
              ]"
              hide-bottom-space
            >
              <template v-slot:prepend>
                <q-icon name="mail_outline" color="white" class="q-pl-md" />
              </template>
            </q-input>
          </div>

          <!-- Password Input -->
          <div>
            <q-input
              v-model="form.password"
              placeholder="Kata Sandi"
              :type="showPassword ? 'text' : 'password'"
              borderless
              dark
              class="glass-input"
              lazy-rules
              :rules="[val => !!val || 'Kata sandi wajib diisi']"
              hide-bottom-space
            >
              <template v-slot:prepend>
                <q-icon name="lock_outline" color="white" class="q-pl-md" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="showPassword ? 'visibility' : 'visibility_off'"
                  class="cursor-pointer q-pr-md"
                  color="white"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>
            
            <div class="text-right q-mt-md">
              <a href="#" class="text-white text-caption text-weight-medium text-decoration-none hover-underline">Lupa kata sandi?</a>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="q-mt-lg">
            <q-btn
              label="MASUK"
              type="submit"
              class="full-width text-weight-bolder custom-glass-btn"
              rounded
              size="1.2rem"
              :loading="loading"
              unelevated
            />
          </div>
          
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
// import axios from 'axios'

const router = useRouter()
const $q = useQuasar()

// Gunakan sales.test sesuai standar Laragon
// const api = axios.create({ baseURL: 'http://sales.test/api/mobile' })

const form = reactive({
  email: '',
  password: ''
})
const loading = ref(false)
const showPassword = ref(false)

const onSubmit = async () => {
  loading.value = true
  
  // -- MOCK LOGIN --
  // Simulasi loading 1.5 detik tanpa memanggil API
  setTimeout(() => {
    loading.value = false
    
    // Ekstrak nama dari email (sebelum @)
    const emailName = form.email.split('@')[0]
    const formattedName = emailName.charAt(0).toUpperCase() + emailName.slice(1)

    // Simpan data dummy ke localStorage
    localStorage.setItem('sales_token', 'mock_token_12345')
    localStorage.setItem('sales_user', JSON.stringify({
      id: 1,
      name: formattedName || 'Sales Vistra',
      email: form.email
    }))
    
    $q.notify({
      type: 'positive',
      message: 'Berhasil Masuk',
      position: 'top',
      timeout: 2000
    })
    
    router.push('/dashboard')
  }, 1500)

  /* --- KODE API ASLI DIKOMEN DULU ---
  try {
    const response = await api.post('/login', form)
    
    // Simpan token ke localStorage
    localStorage.setItem('sales_token', response.data.token)
    localStorage.setItem('sales_user', JSON.stringify(response.data.user))
    
    loading.value = false
    $q.notify({
      type: 'positive',
      message: 'Login Successful',
      position: 'top',
      timeout: 2000
    })
    router.push('/dashboard')
    
  } catch (e) {
    console.error(e)
    loading.value = false
    $q.notify({
      type: 'negative',
      message: e.response?.data?.message || 'Invalid email or password',
      position: 'top'
    })
  }
  --- */
}
</script>

<style lang="scss" scoped>
.login-page {
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background-color: #0d1117;
}

.header-space {
  height: 30vh;
  min-height: 180px;
  position: relative;
  z-index: 10;
}

.hero-section {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 55vh;
  z-index: 0;
}

.hero-image {
  height: 100%;
  width: 100%;
  opacity: 0.6;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(13,17,23,0) 0%, rgba(13,17,23,1) 100%);
}

/* Glassmorphism Sheet */
.glass-sheet {
  flex: 1;
  position: relative;
  z-index: 10;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  box-shadow: 0 -10px 45px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

.logo-wrapper {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.text-opacity-80 {
  opacity: 0.8;
}

/* Glassmorphism Inputs */
:deep(.glass-input .q-field__control) {
  background: rgba(255, 255, 255, 0.07) !important;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  height: 56px;
}

:deep(.glass-input .q-field__control:hover),
:deep(.glass-input .q-field__control.q-field__control--focused) {
  background: rgba(255, 255, 255, 0.15) !important;
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
}

/* Glassmorphism Button */
.custom-glass-btn {
  background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7));
  color: var(--q-primary) !important;
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(5px);
  box-shadow: 0 8px 32px rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
  letter-spacing: 1px;
}

.custom-glass-btn:active {
  transform: scale(0.95);
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
}

a.text-decoration-none {
  text-decoration: none;
}
a.hover-underline:hover {
  text-decoration: underline;
}

/* Fix input autofill background in webkit */
:deep(input:-webkit-autofill) {
  -webkit-background-clip: text;
  -webkit-text-fill-color: white;
  transition: background-color 5000s ease-in-out 0s;
}

/* Error message color for dark background */
:deep(.glass-input.q-field--error .q-field__messages) {
  color: #ff8a80 !important;
  font-weight: 500;
}
:deep(.glass-input.q-field--error .q-icon) {
  color: #ff8a80 !important;
}
</style>
