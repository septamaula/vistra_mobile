<template>
  <q-page class="bg-grey-2" style="min-height: 100vh;">
    <!-- Reusable Compact Header -->
    <AppHeader title="Profil Saya" subtitle="Pengaturan akun & informasi sales" />

    <div class="q-pa-md max-width-container mx-auto">
      
      <!-- Profile Header Card -->
      <q-card flat class="rounded-borders bg-white q-pa-lg q-mb-md shadow-1 text-center relative-position">
        <q-avatar size="80px" class="shadow-2 q-mb-md">
          <img src="https://cdn.quasar.dev/img/avatar4.jpg" alt="Sales Avatar" />
        </q-avatar>

        <div class="text-h6 text-weight-bolder text-dark">Septa Maula</div>
        <div class="text-caption text-primary text-weight-bold">Senior Sales Executive</div>

        <div class="flex flex-center q-mt-xs text-caption text-grey-7">
          <q-icon name="badge" class="q-mr-xs" /> NIK: PV-EMP-2024-089
          <span class="q-mx-xs">&bull;</span>
          <q-icon name="business" class="q-mr-xs" /> PT Penta Valent Tbk
        </div>
      </q-card>

      <!-- Territory & Performance Overview -->
      <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">WILAYAH & TARGET PENJUALAN</div>
      <q-card flat class="rounded-borders bg-white shadow-1 overflow-hidden q-mb-md">
        <q-list separator>
          <q-item class="q-py-md">
            <q-item-section avatar>
              <div class="bg-blue-1 flex flex-center" style="width: 40px; height: 40px; border-radius: 10px;">
                <q-icon name="map" color="primary" size="20px" />
              </div>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-caption text-grey-6 text-weight-medium">Wilayah Jelajah (Territory)</q-item-label>
              <q-item-label class="text-weight-bold text-dark" style="font-size: 14px;">Jakarta Pusat & Jakarta Selatan</q-item-label>
            </q-item-section>
          </q-item>

          <q-item class="q-py-md">
            <q-item-section avatar>
              <div class="bg-green-1 flex flex-center" style="width: 40px; height: 40px; border-radius: 10px;">
                <q-icon name="gps_fixed" color="positive" size="20px" />
              </div>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-caption text-grey-6 text-weight-medium">Target Penjualan Bulan Ini</q-item-label>
              <q-item-label class="text-weight-bold text-dark" style="font-size: 14px;">Rp 200,0 Juta</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-badge color="positive" class="text-weight-bold">MTD: 73%</q-badge>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>

      <!-- Account Settings & Info -->
      <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">INFORMASI AKUN & APLIKASI</div>
      <q-card flat class="rounded-borders bg-white shadow-1 overflow-hidden q-mb-lg">
        <q-list separator>
          <q-item class="q-py-md">
            <q-item-section avatar>
              <q-icon name="phone" color="grey-7" size="20px" />
            </q-item-section>
            <q-item-section>
              <q-item-label caption>Nomor Telepon</q-item-label>
              <q-item-label class="text-weight-bold text-dark">0812-3456-7890</q-item-label>
            </q-item-section>
          </q-item>

          <q-item class="q-py-md">
            <q-item-section avatar>
              <q-icon name="email" color="grey-7" size="20px" />
            </q-item-section>
            <q-item-section>
              <q-item-label caption>Alamat Email</q-item-label>
              <q-item-label class="text-weight-bold text-dark">septa.maula@pentavalent.co.id</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple class="q-py-md" @click="changePassword">
            <q-item-section avatar>
              <q-icon name="lock" color="primary" size="20px" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold text-dark">Ubah Kata Sandi</q-item-label>
              <q-item-label caption>Perbarui kata sandi akun SFA Anda</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="chevron_right" color="grey-6" />
            </q-item-section>
          </q-item>

          <q-item class="q-py-md">
            <q-item-section avatar>
              <q-icon name="info" color="grey-7" size="20px" />
            </q-item-section>
            <q-item-section>
              <q-item-label caption>Versi Aplikasi</q-item-label>
              <q-item-label class="text-weight-bold text-dark">Vistra Mobile v1.4.2 (Enterprise)</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>

      <!-- Logout Button -->
      <q-btn 
        color="negative" 
        class="full-width text-weight-bold shadow-2 q-py-sm" 
        rounded 
        icon="logout" 
        label="Keluar dari Aplikasi (Logout)" 
        @click="logout" 
      />

    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import AppHeader from '@/components/AppHeader.vue'

const router = useRouter()
const $q = useQuasar()

const changePassword = () => {
  $q.notify({ type: 'info', message: 'Fitur ubah kata sandi dapat diakses via portal HR / Web Pusat.' })
}

const logout = () => {
  $q.dialog({
    title: 'Konfirmasi Keluar',
    message: 'Apakah Anda yakin ingin keluar dari akun Vistra Mobile?',
    cancel: true,
    persistent: true,
    ok: { label: 'Ya, Keluar', color: 'negative' }
  }).onOk(() => {
    localStorage.removeItem('sales_token')
    $q.notify({ type: 'positive', message: 'Anda telah berhasil keluar dari sistem.' })
    router.push('/login')
  })
}
</script>

<style lang="scss" scoped>
.max-width-container {
  max-width: 1100px;
}
</style>
