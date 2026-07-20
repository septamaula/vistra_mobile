<template>
  <q-page class="login-page bg-grey-1">
    <!-- Header Illustration Area -->
    <div class="hero-section flex flex-center">
      <q-img
        src="/images/login-hero.png"
        class="hero-image"
        fit="cover"
        position="center"
      />
      <!-- Gradient Overlay -->
      <div class="hero-overlay"></div>
    </div>

    <!-- Bottom Form Card -->
    <div class="form-container bg-white">
      <div class="q-px-lg q-pt-xl q-pb-md text-center">
        <h4 class="text-h4 text-weight-bolder text-dark q-mt-none q-mb-xs">SFA Qiara</h4>
        <div class="text-subtitle1 text-grey-7">Login to your account</div>
      </div>
      
      <div class="q-px-lg q-pb-xl">
        <q-form @submit="onSubmit" class="q-gutter-y-lg">
          
          <!-- Email Input -->
          <div>
            <div class="text-caption text-weight-bold text-grey-8 q-mb-sm q-ml-sm">Email Address</div>
            <q-input
              v-model="form.email"
              placeholder="Enter your email"
              type="email"
              outlined
              rounded
              bg-color="grey-1"
              color="primary"
              class="custom-input"
              lazy-rules
              :rules="[val => val && val.length > 0 || 'Email is required']"
              hide-bottom-space
            >
              <template v-slot:prepend>
                <q-icon name="mail_outline" color="grey-6" class="q-pl-sm" />
              </template>
            </q-input>
          </div>

          <!-- Password Input -->
          <div>
            <div class="text-caption text-weight-bold text-grey-8 q-mb-sm q-ml-sm">Password</div>
            <q-input
              v-model="form.password"
              placeholder="Enter your password"
              :type="showPassword ? 'text' : 'password'"
              outlined
              rounded
              bg-color="grey-1"
              color="primary"
              class="custom-input"
              lazy-rules
              :rules="[val => val && val.length > 0 || 'Password is required']"
              hide-bottom-space
            >
              <template v-slot:prepend>
                <q-icon name="lock_outline" color="grey-6" class="q-pl-sm" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="showPassword ? 'visibility' : 'visibility_off'"
                  class="cursor-pointer q-pr-sm"
                  color="grey-6"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>
            
            <div class="text-right q-mt-sm">
              <a href="#" class="text-primary text-caption text-weight-medium text-decoration-none">Forgot password?</a>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="q-mt-xl">
            <q-btn
              label="Sign In"
              type="submit"
              color="primary"
              class="full-width text-weight-bold custom-btn shadow-3"
              rounded
              size="1.1rem"
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
import axios from 'axios'

const router = useRouter()
const $q = useQuasar()

// Gunakan sales.test sesuai standar Laragon
const api = axios.create({ baseURL: 'http://sales.test/api/mobile' })

const form = reactive({
  email: '',
  password: ''
})
const loading = ref(false)
const showPassword = ref(false)

const onSubmit = async () => {
  loading.value = true
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
}
</script>

<style lang="scss" scoped>
.login-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.hero-section {
  position: relative;
  height: 40vh;
  width: 100%;
  background: linear-gradient(135deg, var(--q-primary) 0%, #1976D2 100%);
}

.hero-image {
  height: 100%;
  width: 100%;
  opacity: 0.8;
  mix-blend-mode: luminosity;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(255,255,255,0.2) 100%);
}

.form-container {
  flex: 1;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  margin-top: -40px; /* Pull it up to overlap the image */
  z-index: 10;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

/* Custom Input Styling to remove harsh borders */
:deep(.custom-input .q-field__control) {
  border: none !important;
  box-shadow: none !important;
}

:deep(.custom-input .q-field__control:before) {
  border: 1px solid #e0e0e0;
  transition: border-color 0.3s ease;
}

:deep(.custom-input .q-field__control:after) {
  border-width: 2px;
}

.custom-btn {
  padding: 12px 0;
  letter-spacing: 0.5px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.custom-btn:active {
  transform: scale(0.98);
}

a.text-decoration-none {
  text-decoration: none;
}
a.text-decoration-none:hover {
  text-decoration: underline;
}
</style>
