<template>
  <q-page class="bg-grey-2" style="min-height: 100vh;">
    <!-- Reusable Compact Header -->
    <AppHeader title="Sinkronisasi Offline" subtitle="Kelola data lokal & unggah transaksi offline" />

    <div class="q-pa-md max-width-container mx-auto">
      
      <!-- Connection Status Banner -->
      <q-card flat class="rounded-borders bg-white q-pa-md q-mb-md shadow-1">
        <div class="row items-center justify-between">
          <div class="flex items-center">
            <div class="bg-green-1 flex flex-center q-mr-md" style="width: 44px; height: 44px; border-radius: 12px;">
              <q-icon name="wifi" color="positive" size="24px" />
            </div>
            <div>
              <div class="text-weight-bold text-dark" style="font-size: 15px;">Status Koneksi: Online</div>
              <div class="text-caption text-grey-6">Terakhir sinkronisasi: 21 Jul 2026, 16:30 WIB</div>
            </div>
          </div>
          <q-badge color="positive" rounded class="q-px-sm q-py-xs">Sinyal Bagus</q-badge>
        </div>
      </q-card>

      <!-- Pending Offline Upload Queue -->
      <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">DATA PENDING SINKRONISASI</div>
      <q-card flat class="rounded-borders bg-white shadow-1 overflow-hidden q-mb-lg border-left-warning">
        <div class="q-pa-md">
          <div class="text-caption text-grey-7 q-mb-sm">
            Data transaksi yang dibuat saat HP tidak ada sinyal. Tekan tombol sinkronisasi untuk mengunggah ke server pusat PT Penta Valent Tbk.
          </div>

          <q-list separator bordered class="rounded-borders bg-grey-1 q-mb-md">
            <q-item class="q-py-sm">
              <q-item-section avatar style="min-width: 36px;">
                <q-icon name="shopping_bag" color="primary" size="20px" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold" style="font-size: 13px;">Sales Order Pending</q-item-label>
                <q-item-label caption>Apotek Sehat Jaya &bull; Rp 12,50 Juta</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge color="warning" text-color="dark">Belum Terunggah</q-badge>
              </q-item-section>
            </q-item>

            <q-item class="q-py-sm">
              <q-item-section avatar style="min-width: 36px;">
                <q-icon name="photo_camera" color="primary" size="20px" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold" style="font-size: 13px;">Dokumentasi Merchandising</q-item-label>
                <q-item-label caption>3 Foto Display Rak Apotek</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge color="warning" text-color="dark">Belum Terunggah</q-badge>
              </q-item-section>
            </q-item>
          </q-list>

          <q-btn 
            color="primary" 
            class="full-width text-weight-bold shadow-3" 
            rounded 
            icon="cloud_upload" 
            label="Unggah Sekarang (Sync Data)" 
            :loading="uploading"
            @click="syncUpload" 
          />
        </div>
      </q-card>

      <!-- Download Master Data Section -->
      <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">UNDUH MASTER DATA LOKAL</div>
      <q-card flat class="rounded-borders bg-white shadow-1 overflow-hidden q-mb-md">
        <div class="q-pa-md">
          <div class="text-caption text-grey-7 q-mb-sm">
            Unduh data terbaru dari server pusat sebelum berangkat kunjungan agar aplikasi bisa dipakai tanpa koneksi internet.
          </div>

          <q-list separator bordered class="rounded-borders bg-grey-1 q-mb-md">
            <q-item class="q-py-sm">
              <q-item-section avatar style="min-width: 36px;">
                <q-icon name="inventory_2" color="positive" size="20px" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold" style="font-size: 13px;">Master Produk & Harga</q-item-label>
                <q-item-label caption>120 SKU Obat & Alkes (Updated)</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="check_circle" color="positive" size="18px" />
              </q-item-section>
            </q-item>

            <q-item class="q-py-sm">
              <q-item-section avatar style="min-width: 36px;">
                <q-icon name="storefront" color="positive" size="20px" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold" style="font-size: 13px;">Master Outlet & Limit Kredit</q-item-label>
                <q-item-label caption>48 Pelanggan Wilayah Jakarta</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="check_circle" color="positive" size="18px" />
              </q-item-section>
            </q-item>
          </q-list>

          <q-btn 
            color="secondary" 
            class="full-width text-weight-bold shadow-2" 
            rounded 
            icon="cloud_download" 
            label="Unduh Master Data Terbaru" 
            :loading="downloading"
            @click="syncDownload" 
          />
        </div>
      </q-card>

    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import AppHeader from '@/components/AppHeader.vue'

const $q = useQuasar()
const uploading = ref(false)
const downloading = ref(false)

const syncUpload = () => {
  uploading.value = true
  setTimeout(() => {
    uploading.value = false
    $q.notify({ type: 'positive', message: 'Semua data transaksi offline berhasil diunggah ke server pusat!' })
  }, 1500)
}

const syncDownload = () => {
  downloading.value = true
  setTimeout(() => {
    downloading.value = false
    $q.notify({ type: 'positive', message: 'Master data obat, outlet, dan harga terbaru berhasil diperbarui!' })
  }, 1500)
}
</script>

<style lang="scss" scoped>
.max-width-container {
  max-width: 1100px;
}
.border-left-warning {
  border-left: 4px solid var(--q-warning);
}
</style>
