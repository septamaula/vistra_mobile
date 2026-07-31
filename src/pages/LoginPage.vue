<template>
  <q-page class="login-page">

    <!-- Animated Background Blobs -->
    <div class="bg-blob blob-1"></div>
    <div class="bg-blob blob-2"></div>
    <div class="bg-blob blob-3"></div>

    <!-- Main Content -->
    <div class="login-container">

      <!-- Logo Section -->
      <div class="logo-section">
        <div class="logo-wrapper">
          <img src="/images/logo.png" alt="Vistra Logo" class="logo-img" />
        </div>
      </div>

      <!-- Greeting Text -->
      <div class="greeting-section">
        <h1 class="greeting-title">Selamat datang kembali!</h1>
        <p class="greeting-subtitle">Silakan masuk untuk melanjutkan</p>
      </div>

      <!-- Form Section -->
      <div class="form-section">
        <q-form @submit="onSubmit" class="login-form" greedy>

          <!-- Email Input -->
          <div class="input-wrapper">
            <q-input
              v-model="form.email"
              placeholder="Alamat Email"
              type="email"
              borderless
              dark
              class="custom-input"
              lazy-rules
              :rules="[
                val => !!val || 'Email wajib diisi',
                val => /.+@.+\..+/.test(val) || 'Format email tidak valid'
              ]"
              hide-bottom-space
            >
              <template v-slot:prepend>
                <q-icon name="mail_outline" class="input-icon" />
              </template>
            </q-input>
          </div>

          <!-- Password Input -->
          <div class="input-wrapper">
            <q-input
              v-model="form.password"
              placeholder="Kata Sandi"
              :type="showPassword ? 'text' : 'password'"
              borderless
              dark
              class="custom-input"
              lazy-rules
              :rules="[val => !!val || 'Kata sandi wajib diisi']"
              hide-bottom-space
            >
              <template v-slot:prepend>
                <q-icon name="lock_outline" class="input-icon" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="showPassword ? 'visibility' : 'visibility_off'"
                  class="cursor-pointer input-icon-right"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>
          </div>

          <!-- Forgot Password -->
          <div class="forgot-row">
            <a href="#" class="forgot-link">Lupa kata sandi?</a>
          </div>

          <!-- Submit Button -->
          <div class="btn-wrapper">
            <q-btn
              label="MASUK"
              type="submit"
              class="full-width masuk-btn"
              unelevated
              no-caps
              :loading="loading"
            />
          </div>

        </q-form>
      </div>

      <!-- Footer -->
      <div class="footer-section">
        <p class="footer-text">
          Belum punya akun?
          <a href="#" class="footer-link">Hubungi administrator</a>
        </p>
      </div>

    </div>
  </q-page>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from '../boot/axios'

const router = useRouter()
const $q = useQuasar()

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const showPassword = ref(false)

const onSubmit = async () => {
  loading.value = true
  try {
    const res = await api.post('/login', {
      email: form.email,
      password: form.password
    })

    if (res.data.success) {
      localStorage.setItem('sales_token', res.data.token)
      localStorage.setItem('sales_user', JSON.stringify(res.data.user))

      $q.notify({ type: 'positive', message: 'Berhasil Masuk', position: 'top', timeout: 2000 })
      router.push('/dashboard')
    } else {
      $q.notify({ type: 'negative', message: res.data.message || 'Login gagal', position: 'top' })
    }
  } catch (e) {
    const msg = e.response?.data?.message || 'Email atau password salah'
    $q.notify({ type: 'negative', message: msg, position: 'top' })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #0e0a0a;
  overflow: hidden;
  position: relative;
}

/* Animated background blobs */
.bg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.35;
  pointer-events: none;
  animation: blobFloat 8s ease-in-out infinite;
}

.blob-1 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, #c0152a, #7a0010);
  top: -80px;
  right: -80px;
  animation-delay: 0s;
}

.blob-2 {
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, #8b0000, #400005);
  bottom: 80px;
  left: -60px;
  animation-delay: -3s;
}

.blob-3 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, #c0152a, #6a000e);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -6s;
}

@keyframes blobFloat {
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-20px) scale(1.05); }
}

/* Main container */
.login-container {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 400px;
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Logo */
.logo-section {
  margin-bottom: 28px;
  display: flex;
  justify-content: center;
}

.logo-wrapper {
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 0 32px rgba(192, 21, 42, 0.6));
  animation: logoPulse 3s ease-in-out infinite;
}

@keyframes logoPulse {
  0%, 100% { filter: drop-shadow(0 0 24px rgba(192, 21, 42, 0.5)); }
  50% { filter: drop-shadow(0 0 40px rgba(192, 21, 42, 0.8)); }
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Greeting */
.greeting-section {
  text-align: center;
  margin-bottom: 32px;
}

.greeting-title {
  font-family: 'Roboto', sans-serif;
  font-size: 1.65rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
  letter-spacing: -0.3px;
  line-height: 1.3;
}

.greeting-subtitle {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.55);
  margin: 0;
  font-weight: 400;
}

/* Form */
.form-section {
  width: 100%;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.input-wrapper {
  margin-bottom: 14px;
}

/* Custom Input Styles */
:deep(.custom-input .q-field__control) {
  background: rgba(30, 10, 10, 0.6) !important;
  border-radius: 12px !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  height: 52px;
  transition: all 0.25s ease;
}

:deep(.custom-input .q-field__control:hover) {
  background: rgba(40, 15, 15, 0.7) !important;
  border-color: rgba(192, 21, 42, 0.4) !important;
}

:deep(.custom-input.q-field--focused .q-field__control) {
  background: rgba(40, 15, 15, 0.75) !important;
  border-color: rgba(192, 21, 42, 0.7) !important;
  box-shadow: 0 0 0 3px rgba(192, 21, 42, 0.12);
}

:deep(.custom-input .q-field__native) {
  color: rgba(255, 255, 255, 0.85) !important;
  font-size: 0.92rem;
}

:deep(.custom-input .q-field__native::placeholder) {
  color: rgba(255, 255, 255, 0.35) !important;
}

:deep(.custom-input .q-field__messages) {
  color: #ff6b6b !important;
  padding-left: 4px;
  font-size: 0.78rem;
}

/* Force override any Quasar white background on input */
:deep(.custom-input .q-field__control-container) {
  background: transparent !important;
}

.input-icon {
  color: rgba(255, 255, 255, 0.35);
  font-size: 1.15rem;
  margin-left: 6px;
}

.input-icon-right {
  color: rgba(255, 255, 255, 0.35);
  font-size: 1.15rem;
  margin-right: 6px;
}

/* Autofill override */
:deep(input:-webkit-autofill) {
  -webkit-background-clip: text;
  -webkit-text-fill-color: white;
  transition: background-color 5000s ease-in-out 0s;
}

/* Forgot password */
.forgot-row {
  text-align: right;
  margin-bottom: 24px;
  margin-top: 2px;
}

.forgot-link {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.82rem;
  text-decoration: none;
  transition: color 0.2s ease;
}

.forgot-link:hover {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: underline;
}

/* Masuk Button */
.btn-wrapper {
  width: 100%;
}

.masuk-btn {
  background: linear-gradient(135deg, #e8001f 0%, #a00016 100%) !important;
  color: #ffffff !important;
  font-size: 1rem !important;
  font-weight: 700 !important;
  letter-spacing: 2px !important;
  border-radius: 14px !important;
  height: 54px;
  box-shadow: 0 8px 24px rgba(192, 21, 42, 0.45);
  transition: all 0.25s ease;
}

.masuk-btn:hover {
  background: linear-gradient(135deg, #ff1a35 0%, #c0001e 100%) !important;
  box-shadow: 0 12px 32px rgba(192, 21, 42, 0.6);
  transform: translateY(-1px);
}

.masuk-btn:active {
  transform: translateY(0px) scale(0.98);
  box-shadow: 0 4px 12px rgba(192, 21, 42, 0.4);
}

/* Footer */
.footer-section {
  margin-top: 32px;
  text-align: center;
}

.footer-text {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.83rem;
  margin: 0;
}

.footer-link {
  color: #e8001f;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #ff3354;
  text-decoration: underline;
}
</style>
