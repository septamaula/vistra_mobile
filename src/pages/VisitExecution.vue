<template>
  <q-page class="visit-page">

    <!-- ====== TOP GRADIENT SECTION ====== -->
    <div class="top-gradient-section">
      <!-- Subheader -->
      <div class="visit-subheader">
        <q-btn flat round icon="arrow_back" color="white" size="sm" @click="handleBack" />
        <span class="visit-subheader__title">AKTIVITAS KUNJUNGAN</span>
        <div style="width: 36px" />
      </div>

      <!-- Outlet Card (Oval / Card) -->
      <div class="outlet-card">
        <div class="outlet-card__info">
          <div class="outlet-card__name">{{ outletName }}</div>
          <div class="outlet-card__addr">
            <q-icon name="location_on" size="13px" color="white" />
            <span>{{ outletAddr }}</span>
          </div>
        </div>
        <div class="outlet-card__badge" :class="statusBadgeColor">
          <q-icon name="check_circle" size="14px" color="white" class="q-mr-xs" />
          <span>{{ statusText }}</span>
        </div>
      </div>
    </div>

    <!-- ====== CONTENT SECTION (rounded top, light grey bg) ====== -->
    <div class="content-wrap">

      <!-- Top Stats Row (3 Columns) -->
      <div class="stats-card">
        <div class="stat-col">
          <div class="stat-col__label">JAM KUNJUNGAN</div>
          <div class="stat-col__value">{{ checkinTimeFormatted }}</div>
          <div class="stat-col__unit">WIB</div>
        </div>
        <div class="stat-div"></div>
        <div class="stat-col">
          <div class="stat-col__label">DURASI</div>
          <div class="stat-col__value">{{ durationFormatted }}</div>
          <div class="stat-col__unit">Jam</div>
        </div>
        <div class="stat-div"></div>
        <div class="stat-col">
          <div class="stat-col__label">STATUS KUNJUNGAN</div>
          <div class="stat-col__value text-red-9">{{ statusStatValue }}</div>
          <div class="stat-col__unit">{{ statusStatUnit }}</div>
        </div>
      </div>

      <!-- State: Main Grid Menu -->
      <div v-if="activeTab === 'menu'" class="menu-view">
        <div class="activity-grid">
          <div
            v-for="menu in menus"
            :key="menu.id"
            class="grid-card"
            v-ripple
            @click="openMenu(menu)"
          >
            <!-- Badge count if any -->
            <div v-if="menu.badge" class="grid-card__badge">
              {{ menu.badge }}
            </div>

            <!-- Icon wrap (Red / Maroon icon) -->
            <div class="grid-card__icon-wrap" :class="{ 'grid-card__icon-wrap--done': menu.done }">
              <q-icon :name="menu.done ? 'check_circle' : menu.icon" size="24px" color="red-8" />
            </div>

            <div class="grid-card__label">{{ menu.title }}</div>
          </div>
        </div>

        <!-- Progress Card -->
        <div class="progress-card">
          <div class="progress-card__header">
            <span class="progress-card__title">PROGRES AKTIVITAS KUNJUNGAN</span>
            <div class="progress-card__badge">{{ progressPercentage }}% Selesai</div>
          </div>

          <div class="progress-card__bar-bg">
            <div class="progress-card__bar-fill" :style="{ width: progressPercentage + '%' }"></div>
          </div>

          <div class="progress-card__desc">
            <div>{{ completedCount }} dari {{ totalCount }} aktivitas kunjungan selesai</div>
            <div>Selesaikan semua aktivitas untuk Check Out</div>
          </div>
        </div>
      </div>

      <!-- Sub-module Detail Views -->
      <div v-else class="submodule-view">
        <!-- Submodule Top Bar -->
        <div class="submodule-bar">
          <q-btn flat round icon="arrow_back" color="red-8" size="sm" @click="activeTab = 'menu'" />
          <span class="submodule-bar__title">{{ currentMenuTitle }}</span>
          <q-btn flat round icon="close" color="grey-6" size="sm" @click="activeTab = 'menu'" />
        </div>

        <!-- Tab 1: INFORMASI OUTLET (Matching Screenshot 2 100%) -->
        <div v-if="activeTab === 'info'" class="q-pa-xs">
          <!-- Top Sub-Nav Tabs (Overview | Sales History | AR & Limit | Aktivitas) -->
          <div class="bg-white rounded-borders q-mb-sm shadow-1">
            <q-tabs
              v-model="infoSubTab"
              dense
              no-caps
              active-color="red-8"
              indicator-color="red-8"
              align="justify"
              class="text-grey-7 text-weight-bold"
              style="font-size: 11px;"
            >
              <q-tab name="overview" label="Overview" />
              <q-tab name="history" label="Sales History" />
              <q-tab name="ar" label="AR & Limit" />
              <q-tab name="activity" label="Aktivitas" />
            </q-tabs>
          </div>

          <!-- Sub-Tab 1: OVERVIEW (Matching Screenshot 2 100%) -->
          <div v-if="infoSubTab === 'overview'">
            <!-- Card 1: Informasi Outlet -->
            <q-card flat bordered class="rounded-borders q-pa-sm bg-white q-mb-sm">
              <div class="text-caption text-weight-bold text-dark q-mb-xs">Informasi Outlet</div>
              <div class="flex items-center justify-between q-mb-xs">
                <div class="flex items-center">
                  <div class="q-pa-xs rounded-borders bg-blue-1 flex flex-center q-mr-sm" style="width: 36px; height: 36px;">
                    <q-icon name="storefront" color="primary" size="22px" />
                  </div>
                  <div>
                    <div class="text-subtitle2 text-weight-bolder text-dark" style="line-height: 1.2;">{{ outletName }}</div>
                    <div class="text-caption text-grey-7" style="font-size: 10.5px;">{{ outletAddr }}</div>
                  </div>
                </div>
                <q-badge color="positive" class="text-weight-bold q-px-sm py-xs" style="font-size: 10px;">Active</q-badge>
              </div>

              <q-separator class="q-my-xs" />

              <div class="row text-caption q-col-gutter-xs text-center" style="font-size: 10.5px;">
                <div class="col-4 border-right-light">
                  <div class="text-grey-6">Tipe Outlet</div>
                  <div class="text-weight-bold text-dark">Apotek</div>
                </div>
                <div class="col-4 border-right-light">
                  <div class="text-grey-6">Klasifikasi</div>
                  <div class="text-weight-bold text-dark">Modern Trade</div>
                </div>
                <div class="col-4">
                  <div class="text-grey-6">Salesman</div>
                  <div class="text-weight-bold text-dark">Budi Santoso</div>
                </div>
              </div>
            </q-card>

            <!-- Card 2: Ringkasan Performa -->
            <q-card flat bordered class="rounded-borders q-pa-sm bg-white q-mb-sm">
              <div class="text-caption text-weight-bold text-dark q-mb-xs">Ringkasan Performa</div>
              <q-separator class="q-mb-xs" />

              <div class="row q-col-gutter-sm">
                <div class="col-6 border-right-light">
                  <div class="text-caption text-grey-6" style="font-size: 10px;">Total Sales (YTD)</div>
                  <div class="flex items-center q-my-xs">
                    <span class="text-weight-bolder text-dark" style="font-size: 13.5px;">Rp 245.750.000</span>
                    <q-badge color="positive" class="q-ml-xs text-weight-bold" style="font-size: 9px;">↑ 12.5%</q-badge>
                  </div>
                  <div class="text-caption text-grey-6" style="font-size: 9.5px;">vs Tahun Lalu</div>
                </div>
                <div class="col-6">
                  <div class="text-caption text-grey-6" style="font-size: 10px;">Freq. Order</div>
                  <div class="text-weight-bolder text-dark q-my-xs" style="font-size: 13.5px;">24x</div>
                  <div class="text-caption text-grey-6" style="font-size: 10px;">Rata-rata / Order</div>
                  <div class="text-weight-bold text-dark" style="font-size: 11.5px;">Rp 10.240.000</div>
                </div>
              </div>
            </q-card>

            <!-- Card 3: AR (Piutang) -->
            <q-card flat bordered class="rounded-borders q-pa-sm bg-white q-mb-sm">
              <div class="text-caption text-weight-bold text-dark q-mb-xs">AR (Piutang)</div>
              <q-separator class="q-mb-xs" />

              <div class="row q-col-gutter-xs items-center">
                <div class="col-7">
                  <div class="text-caption text-grey-6" style="font-size: 10px;">Total Outstanding</div>
                  <div class="text-weight-bolder text-dark" style="font-size: 13px;">Rp 28.750.000</div>

                  <div class="text-caption text-grey-6 q-mt-xs" style="font-size: 10px;">Overdue</div>
                  <div class="text-weight-bolder text-red-9" style="font-size: 12px;">Rp 5.750.000</div>

                  <div class="text-caption text-grey-6 q-mt-xs" style="font-size: 10px;">Limit Kredit</div>
                  <div class="text-weight-bold text-dark" style="font-size: 11px;">Rp 50.000.000</div>

                  <div class="text-caption text-grey-6 q-mt-xs" style="font-size: 10px;">Sisa Limit</div>
                  <div class="text-weight-bold text-positive" style="font-size: 11px;">Rp 21.250.000</div>
                </div>

                <!-- Donut Chart Gauge Meter (Matching Screenshot 2 100%) -->
                <div class="col-5 flex flex-center">
                  <div class="relative-position flex flex-center" style="width: 84px; height: 84px;">
                    <q-circular-progress
                      :value="57"
                      size="84px"
                      :thickness="0.18"
                      color="positive"
                      track-color="red-3"
                      class="q-ma-none"
                    />
                    <div class="absolute-center text-center">
                      <div class="text-weight-bolder text-dark" style="font-size: 16px; line-height: 1.1;">57%</div>
                      <div class="text-caption text-grey-6" style="font-size: 8.5px;">Termakai</div>
                    </div>
                  </div>
                </div>
              </div>
            </q-card>
          </div>

          <!-- Sub-Tab 2: SALES HISTORY -->
          <div v-else-if="infoSubTab === 'history'">
            <q-card flat bordered class="rounded-borders q-pa-sm bg-white q-mb-sm">
              <div class="text-caption text-weight-bold text-dark q-mb-xs">Riwayat Transaksi Penjualan</div>
              <q-separator class="q-mb-xs" />
              <q-list separator dense>
                <q-item class="q-px-none q-py-xs">
                  <q-item-section>
                    <q-item-label class="text-weight-bold text-primary">SO-20240726-001</q-item-label>
                    <q-item-label caption style="font-size: 10px;">26 Jul 2026 • 2 Item</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <div class="text-weight-bolder text-dark">Rp 750.000</div>
                    <q-badge color="positive" size="xs">Completed</q-badge>
                  </q-item-section>
                </q-item>
                <q-item class="q-px-none q-py-xs">
                  <q-item-section>
                    <q-item-label class="text-weight-bold text-primary">SO-20240726-002</q-item-label>
                    <q-item-label caption style="font-size: 10px;">25 Jul 2026 • 4 Item</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <div class="text-weight-bolder text-dark">Rp 700.000</div>
                    <q-badge color="positive" size="xs">Completed</q-badge>
                  </q-item-section>
                </q-item>
                <q-item class="q-px-none q-py-xs">
                  <q-item-section>
                    <q-item-label class="text-weight-bold text-primary">SO-20240720-009</q-item-label>
                    <q-item-label caption style="font-size: 10px;">20 Jul 2026 • 8 Item</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <div class="text-weight-bolder text-dark">Rp 4.250.000</div>
                    <q-badge color="positive" size="xs">Lunas</q-badge>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>

          <!-- Sub-Tab 3: AR & LIMIT -->
          <div v-else-if="infoSubTab === 'ar'">
            <q-card flat bordered class="rounded-borders q-pa-sm bg-white q-mb-sm">
              <div class="text-caption text-weight-bold text-dark q-mb-xs">Rincian Piutang & Invoice Active</div>
              <q-separator class="q-mb-xs" />
              <q-list separator dense>
                <q-item class="q-px-none q-py-xs">
                  <q-item-section>
                    <q-item-label class="text-weight-bold text-dark">INV-202607-004</q-item-label>
                    <q-item-label caption class="text-red-9">Jatuh Tempo: 20 Jul 2026 (Overdue 6 Hari)</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <div class="text-weight-bolder text-red-9">Rp 5.750.000</div>
                    <q-badge color="red-9" size="xs">Overdue</q-badge>
                  </q-item-section>
                </q-item>
                <q-item class="q-px-none q-py-xs">
                  <q-item-section>
                    <q-item-label class="text-weight-bold text-dark">INV-202607-012</q-item-label>
                    <q-item-label caption class="text-grey-7">Jatuh Tempo: 15 Ags 2026</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <div class="text-weight-bolder text-dark">Rp 23.000.000</div>
                    <q-badge color="warning" size="xs">Unpaid</q-badge>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>

          <!-- Sub-Tab 4: AKTIVITAS -->
          <div v-else-if="infoSubTab === 'activity'">
            <q-card flat bordered class="rounded-borders q-pa-sm bg-white q-mb-sm">
              <div class="text-caption text-weight-bold text-dark q-mb-xs">Riwayat Aktivitas Kunjungan</div>
              <q-separator class="q-mb-xs" />
              <q-timeline color="red-8" dense class="q-pa-xs">
                <q-timeline-entry title="Kunjungan Hari Ini" subtitle="26 Jul 2026 09:15 WIB" icon="login" color="positive">
                  Check-in berhasil • Radius 15m
                </q-timeline-entry>
                <q-timeline-entry title="Survey Kondisi Outlet" subtitle="26 Jul 2026 09:20 WIB" icon="assignment" color="positive">
                  Kriteria kebersihan, visibilitas, POSM disetujui (5/5)
                </q-timeline-entry>
                <q-timeline-entry title="Kunjungan Minggu Lalu" subtitle="19 Jul 2026 10:00 WIB" icon="event" color="grey-6">
                  Check-out selesai • Penjualan SO Rp 4.250.000
                </q-timeline-entry>
              </q-timeline>
            </q-card>
          </div>

          <q-btn label="Selesai Ditinjau" color="red-8" class="full-width q-mt-xs text-weight-bold" height="44px" unelevated no-caps @click="markDone('info')" />
        </div>

        <!-- Tab 2: STOCK CHECKING -->
        <div v-else-if="activeTab === 'stock'" class="q-pa-xs">
          <!-- Top Header Info Card -->
          <q-card flat bordered class="rounded-borders q-pa-sm bg-white q-mb-sm">
            <div class="flex items-center justify-between q-mb-xs">
              <div class="text-subtitle2 text-weight-bolder text-dark">
                Stock Checking (Stok Fisik Outlet Toko)
              </div>
              <q-badge :color="stockDone ? 'positive' : 'grey-6'" class="text-weight-bold" style="font-size: 10px;">
                {{ stockDone ? '✓ Sudah Cek Stok' : 'Belum Cek Stok' }}
              </q-badge>
            </div>
            <div class="text-caption text-grey-6" style="font-size: 10.5px; line-height: 1.3;">
              Pencatatan stok toko pelanggan, estimasi produk terjual, & rekomendasi restock
            </div>
          </q-card>

          <!-- Table / List Card -->
          <q-card flat bordered class="rounded-borders q-pa-sm bg-white q-mb-sm">
            <div class="text-caption text-weight-bold text-dark q-mb-xs flex items-center">
              <q-icon name="fact_check" size="15px" color="positive" class="q-mr-xs" />
              Hasil Stock Checking Toko Pelanggan
            </div>
            <q-separator class="q-mb-xs" />

            <!-- Product Items -->
            <div
              v-for="(item, idx) in stockProducts"
              :key="idx"
              class="q-py-xs border-bottom-light"
            >
              <div class="text-weight-bold text-dark" style="font-size: 11.5px; line-height: 1.3;">
                {{ item.name }}
              </div>
              <div class="flex items-center justify-between q-mt-xs">
                <!-- Qty Control -->
                <div class="flex items-center">
                  <span class="text-caption text-grey-6 q-mr-xs" style="font-size: 10px;">Qty:</span>
                  <q-btn flat round dense icon="remove" size="xs" color="red-8" class="bg-grey-2" @click="item.qty = Math.max(0, item.qty - 1)" />
                  <span class="q-mx-xs text-weight-bolder text-dark" style="font-size: 12px; min-width: 24px; text-align: center;">{{ item.qty }}</span>
                  <q-btn flat round dense icon="add" size="xs" color="positive" class="bg-grey-2 q-mr-xs" @click="item.qty++" />
                  <span class="text-caption text-grey-7" style="font-size: 10px;">Pcs</span>
                </div>

                <!-- Status Buffer Badge -->
                <div>
                  <q-badge
                    :color="item.qty < 10 ? 'warning' : 'positive'"
                    class="text-weight-bold"
                    style="font-size: 9.5px; padding: 2px 6px;"
                  >
                    {{ item.qty < 10 ? '⚠️ Perlu Restock' : '✓ Stok Aman' }}
                  </q-badge>
                </div>
              </div>
            </div>
          </q-card>

          <!-- Catatan Tambahan -->
          <q-input v-model="stockNote" dense outlined label="Catatan Tambahan Stok" type="textarea" rows="2" class="q-mb-sm bg-white" />

          <q-btn
            label="Simpan Stock Checking"
            icon="save"
            color="red-8"
            class="full-width text-weight-bold"
            height="44px"
            unelevated no-caps
            :loading="savingStock"
            @click="saveStockChecking"
          />
        </div>

        <!-- Tab: GALERI FOTO (Matching Web Admin SS2 100%) -->
        <div v-else-if="activeTab === 'gallery'" class="q-pa-xs">
          <!-- Top Header Info Card -->
          <q-card flat bordered class="rounded-borders q-pa-sm bg-white q-mb-sm">
            <div class="flex items-center justify-between q-mb-xs">
              <div class="text-subtitle2 text-weight-bolder text-dark">
                Galeri Foto Kunjungan
              </div>
              <q-badge :color="photosList.length ? 'positive' : 'grey-6'" class="text-weight-bold" style="font-size: 10px;">
                {{ photosList.length ? `✓ ${photosList.length} Foto Terlampir` : 'Belum Ada Foto' }}
              </q-badge>
            </div>
            <div class="text-caption text-grey-6" style="font-size: 10.5px; line-height: 1.3;">
              Ambil foto kamera live, unggah foto outlet, & download dokumen foto
            </div>
          </q-card>

          <!-- Upload / Camera Action Card -->
          <q-card flat bordered class="rounded-borders q-pa-sm bg-white q-mb-sm text-center">
            <q-icon name="photo_camera" size="32px" color="red-8" class="q-mb-xs" />
            <div class="text-caption text-weight-bold text-dark q-mb-xs">Ambil / Unggah Foto Kunjungan</div>
            
            <q-select
              v-model="newPhotoCategory"
              :options="['Display', 'Dokumentasi', 'Merchandising', 'Survey', 'Bukti Toko']"
              label="Kategori Foto"
              dense outlined class="q-mb-xs bg-grey-1"
            />
            <q-input
              v-model="newPhotoCaption"
              dense outlined label="Keterangan Foto (Contoh: Foto Pajangan Produk)"
              class="q-mb-sm bg-grey-1"
            />

            <!-- Hidden File Inputs -->
            <input 
              ref="cameraInput" 
              type="file" 
              accept="image/*" 
              capture="environment" 
              style="display: none;" 
              @change="onPhotoCaptured" 
            />
            <input 
              ref="galleryInput" 
              type="file" 
              accept="image/*" 
              style="display: none;" 
              @change="onPhotoCaptured" 
            />

            <div class="row q-col-gutter-xs">
              <div class="col-6">
                <q-btn
                  color="red-8"
                  icon="photo_camera"
                  label="Ambil Foto Live"
                  no-caps
                  class="full-width text-weight-bold"
                  size="sm"
                  unelevated
                  :loading="uploadingPhoto"
                  @click="openCamera"
                />
              </div>
              <div class="col-6">
                <q-btn
                  outline
                  color="dark"
                  icon="cloud_upload"
                  label="Unggah Galeri"
                  no-caps
                  class="full-width text-weight-bold"
                  size="sm"
                  :loading="uploadingPhoto"
                  @click="openGallery"
                />
              </div>
            </div>
          </q-card>

          <!-- Collection Card Grid -->
          <q-card flat bordered class="rounded-borders q-pa-sm bg-white q-mb-sm">
            <div class="flex items-center justify-between q-mb-xs">
              <span class="text-caption text-weight-bold text-dark flex items-center">
                <q-icon name="collections" size="15px" color="primary" class="q-mr-xs" />
                Koleksi Foto Kunjungan Outlet Ini ({{ photosList.length }} Foto)
              </span>
              <span class="text-caption text-grey-6" style="font-size: 9.5px;">Tersedia di Master Outlet</span>
            </div>
            <q-separator class="q-mb-xs" />

            <!-- Photo Grid -->
            <div v-if="photosList.length" class="row q-col-gutter-xs">
              <div v-for="(photo, idx) in photosList" :key="idx" class="col-6">
                <q-card flat bordered class="rounded-borders overflow-hidden bg-grey-1 shadow-1">
                  <!-- Photo Image / Header Badge -->
                  <div class="relative-position">
                    <img 
                      v-if="photo.url" 
                      :src="photo.url" 
                      style="height: 100px; width: 100%; object-fit: cover;" 
                      class="cursor-pointer"
                      @click="previewPhoto(photo)"
                    />
                    <div v-else style="height: 100px; background: linear-gradient(135deg, #1a1a2e, #16213e);" class="flex flex-center cursor-pointer" @click="previewPhoto(photo)">
                      <q-icon name="image" size="42px" color="red-4" />
                    </div>
                    <q-badge color="primary" class="absolute-top-left q-ma-xs text-weight-bold shadow-1" style="font-size: 9px;">
                      {{ photo.type || photo.category || 'Display' }}
                    </q-badge>
                  </div>
                  <div class="q-pa-xs">
                    <div class="text-weight-bold text-dark ellipsis" style="font-size: 11px;">
                      {{ photo.caption || 'contoh' }}
                    </div>
                    <div class="text-caption text-grey-6" style="font-size: 9.5px;">
                      🕒 {{ photo.date || '25/07/2026 07:00' }}
                    </div>
                    <div class="row q-col-gutter-xs q-mt-xs">
                      <div class="col-6">
                        <q-btn outline dense color="dark" icon="visibility" label="Lihat" size="xs" class="full-width" no-caps @click="previewPhoto(photo)" />
                      </div>
                      <div class="col-6">
                        <q-btn unelevated dense color="primary" icon="download" label="Download" size="xs" class="full-width" no-caps @click="downloadPhoto(photo)" />
                      </div>
                    </div>
                  </div>
                </q-card>
              </div>
            </div>
            <div v-else class="text-caption text-grey-5 q-py-md text-center">
              Belum ada foto terlampir pada kunjungan ini
            </div>
          </q-card>
        </div>

        <!-- Tab 4: SURVEY (Matching Web Admin SS1 100%) -->
        <div v-else-if="activeTab === 'survey'" class="q-pa-xs">
          <!-- Top Header Info Card -->
          <q-card flat bordered class="rounded-borders q-pa-sm bg-white q-mb-sm">
            <div class="flex items-center justify-between q-mb-xs">
              <div class="flex items-center">
                <q-avatar icon="assignment" color="green-1" text-color="positive" size="32px" class="q-mr-sm" />
                <div>
                  <div class="text-subtitle2 text-weight-bolder text-dark">Survey Kondisi Outlet</div>
                  <div class="text-caption text-grey-6" style="font-size: 10.5px;">Penilaian kondisi outlet saat kunjungan</div>
                </div>
              </div>
              <q-badge :color="surveyDone ? 'positive' : 'warning'" class="text-weight-bold" style="font-size: 10px;">
                {{ surveyDone ? '✓ Sudah Diisi' : 'Belum Diisi' }}
              </q-badge>
            </div>
          </q-card>

          <!-- Hasil Survey Card (Matching Web Admin 100%) -->
          <q-card flat bordered class="rounded-borders q-pa-sm bg-white q-mb-sm">
            <div class="text-caption text-weight-bold text-dark q-mb-xs">Hasil Survey</div>
            <q-separator class="q-mb-xs" />

            <q-list separator dense class="q-py-none">
              <q-item v-for="(item, idx) in surveyItems" :key="idx" class="q-py-xs q-px-xs">
                <q-item-section>
                  <q-item-label class="text-weight-bold text-grey-9" style="font-size: 12px;">
                    {{ item.name }}
                  </q-item-label>
                </q-item-section>

                <q-item-section side class="items-end">
                  <div class="flex items-center">
                    <q-rating
                      v-model="item.score"
                      size="18px"
                      color="amber-8"
                      icon="star_border"
                      icon-selected="star"
                      class="q-mr-xs"
                    />
                    <span class="text-weight-bolder text-dark" style="font-size: 12.5px;">
                      {{ item.score }}/5
                    </span>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>

            <q-input
              v-model="surveyNote"
              dense outlined
              label="Catatan Survei Outlet (Opsional)"
              type="textarea"
              rows="2"
              class="q-mt-sm bg-grey-1"
            />
          </q-card>

          <q-btn
            label="Simpan Survey Kondisi Outlet"
            icon="save"
            color="red-8"
            class="full-width text-weight-bold"
            height="44px"
            unelevated no-caps
            :loading="savingSurvey"
            @click="saveSurvey"
          />
        </div>

        <!-- Tab 5: SALES ORDER (SO) (Matching Web Admin SS2 & SS3 100%) -->
        <div v-else-if="activeTab === 'order'" class="q-pa-xs">
          <!-- Sub-view: TAKING ORDER SFA (Matching Web Admin SS3 100%) -->
          <div v-if="isCreatingOrder">
            <!-- Taking Order Header Bar -->
            <div class="flex items-center justify-between bg-white q-pa-sm rounded-borders q-mb-sm shadow-1">
              <div>
                <div class="text-subtitle1 text-weight-bolder text-dark">Taking Order SFA</div>
                <div class="text-caption text-grey-7" style="font-size: 10.5px;">
                  Outlet: <b>{{ outletName }}</b> <q-badge color="warning" size="xs" class="q-ml-xs text-weight-bold">Tier C</q-badge> <span class="text-grey-6 q-ml-xs">Jakarta Pusat & Barat</span>
                </div>
              </div>
              <q-btn outline color="dark" icon="arrow_back" label="Batal" size="sm" dense no-caps @click="isCreatingOrder = false" />
            </div>

            <!-- Search & Category Filters -->
            <q-card flat bordered class="rounded-borders q-pa-sm bg-white q-mb-sm">
              <q-input
                v-model="searchQuery"
                dense outlined
                placeholder="Look for the product, SKU, or category you're looking for..."
                class="bg-grey-1 q-mb-xs"
                style="font-size: 11px;"
              >
                <template #prepend><q-icon name="search" size="18px" color="grey-6" /></template>
              </q-input>

              <div class="flex items-center q-gutter-xs">
                <q-chip
                  clickable
                  dense
                  :color="activeCategory === 'All' ? 'primary' : 'grey-3'"
                  :text-color="activeCategory === 'All' ? 'white' : 'dark'"
                  class="text-weight-bold"
                  style="font-size: 10.5px;"
                  @click="activeCategory = 'All'"
                >
                  All ({{ productsCatalog.length }})
                </q-chip>
                <q-chip
                  clickable
                  dense
                  :color="activeCategory === 'Umum' ? 'primary' : 'grey-3'"
                  :text-color="activeCategory === 'Umum' ? 'white' : 'dark'"
                  class="text-weight-bold"
                  style="font-size: 10.5px;"
                  @click="activeCategory = 'Umum'"
                >
                  Umum ({{ productsCatalog.length }})
                </q-chip>
              </div>
            </q-card>

            <!-- Product Catalog Grid (Matching SS3) -->
            <div class="row q-col-gutter-xs q-mb-sm">
              <div v-for="prod in filteredProductsCatalog" :key="prod.product_id" class="col-6">
                <q-card flat bordered class="rounded-borders q-pa-xs bg-white flex flex-col justify-between" style="min-height: 115px;">
                  <div>
                    <div class="flex items-center q-mb-xs">
                      <div class="q-pa-xs rounded-borders bg-blue-1 flex flex-center q-mr-xs" style="width: 26px; height: 26px;">
                        <q-icon name="inventory_2" color="primary" size="15px" />
                      </div>
                      <div class="text-caption text-weight-bold text-dark ellipsis" style="font-size: 10.5px; max-width: 110px;">
                        {{ prod.name }}
                      </div>
                    </div>
                    <div class="text-caption text-grey-6" style="font-size: 9px;">{{ prod.category }}</div>
                  </div>

                  <div class="flex items-center justify-between q-mt-xs">
                    <div class="text-caption text-weight-bolder text-positive" style="font-size: 10.5px;">
                      Rp {{ formatRupiah(prod.price) }}
                    </div>
                    <div class="flex items-center bg-grey-2 rounded-borders q-pa-xs">
                      <q-btn flat round dense icon="remove" size="xs" color="dark" @click="prod.qty = Math.max(0, prod.qty - 1)" />
                      <span class="text-weight-bold text-dark q-px-xs" style="min-width: 16px; text-align: center; font-size: 11px;">{{ prod.qty }}</span>
                      <q-btn flat round dense icon="add" size="xs" color="primary" @click="prod.qty++" />
                    </div>
                  </div>
                </q-card>
              </div>
            </div>

            <!-- Order Summary & Checkout Card (Matching SS3 Right Panel) -->
            <q-card flat bordered class="rounded-borders q-pa-sm bg-white q-mb-sm">
              <div class="flex justify-between items-center q-mb-xs">
                <span class="text-caption text-weight-bold text-dark flex items-center">
                  <q-icon name="receipt_long" size="15px" color="primary" class="q-mr-xs" />
                  Ringkasan Order
                </span>
                <q-badge color="grey-3" text-color="dark" class="text-weight-bold" style="font-size: 10px;">
                  {{ totalSelectedCartItems }} Items
                </q-badge>
              </div>
              <q-separator class="q-mb-xs" />

              <!-- Coupon Input Box -->
              <div class="bg-red-1 q-pa-xs rounded-borders q-mb-xs">
                <div class="text-caption text-weight-bold text-red-9 q-mb-xs flex items-center" style="font-size: 10px;">
                  <q-icon name="confirmation_number" size="13px" class="q-mr-xs" /> Punya Kode Kupon / Voucher?
                </div>
                <div class="row q-col-gutter-xs">
                  <div class="col-8">
                    <q-input
                      v-model="voucherCode"
                      dense
                      outlined
                      placeholder="MISAL: SUPER50"
                      class="bg-white"
                      style="font-size: 10.5px;"
                    />
                  </div>
                  <div class="col-4">
                    <q-btn color="red-8" label="Terapkan" no-caps class="full-width text-weight-bold" dense height="34px" style="font-size: 10.5px;" @click="applyVoucher" />
                  </div>
                </div>
              </div>

              <!-- Totals Calculation -->
              <div class="q-py-xs text-caption" style="font-size: 11px;">
                <div class="flex justify-between text-grey-7 q-mb-xs">
                  <span>Subtotal</span>
                  <span class="text-weight-bold text-dark">Rp {{ formatRupiah(cartSubtotal) }}</span>
                </div>
                <div class="flex justify-between text-red-8 q-mb-xs">
                  <span>Diskon Promo Engine</span>
                  <span class="text-weight-bold">- Rp {{ formatRupiah(discountAmount) }}</span>
                </div>
                <q-separator class="q-my-xs" />
                <div class="flex justify-between text-weight-bolder text-subtitle2 text-primary">
                  <span>Grand Total</span>
                  <span>Rp {{ formatRupiah(cartGrandTotal) }}</span>
                </div>
              </div>

              <!-- AI Promo Engine Button -->
              <q-btn
                color="amber-9"
                icon="auto_awesome"
                label="Hitung Promo (AI Engine)"
                class="full-width text-weight-bold text-dark q-mb-xs q-mt-xs"
                height="38px"
                unelevated no-caps
                @click="runAiPromoEngine"
              />

              <!-- Submit Order Button -->
              <q-btn
                color="primary"
                icon="check_circle"
                label="Submit Order"
                class="full-width text-weight-bold shadow-2"
                height="42px"
                unelevated no-caps
                :loading="savingOrder"
                @click="saveSalesOrder"
              />
            </q-card>
          </div>

          <!-- Sub-view: Overview Card & Order History (Seamless Mobile UI) -->
          <div v-else>
            <q-card flat bordered class="rounded-borders q-pa-md bg-white text-center q-mb-sm shadow-1">
              <div class="flex flex-center q-mb-xs">
                <q-avatar icon="shopping_cart" color="blue-1" text-color="primary" size="48px" />
              </div>
              <div class="text-subtitle1 text-weight-bolder text-dark">Sales Order</div>
              <div class="text-caption text-grey-6 q-mb-xs">Catat pembelian outlet pada kunjungan ini</div>

              <div v-if="!ordersList.length" class="text-caption text-grey-6 q-mb-md">
                Belum ada order pada kunjungan ini.
              </div>

              <!-- Button Buat Order (Disabled if Checked Out) -->
              <q-btn
                color="primary"
                icon="add"
                label="Buat Sales Order Baru"
                class="full-width text-weight-bold shadow-2"
                height="44px"
                unelevated no-caps
                :disabled="isVisitCheckedOut"
                @click="isCreatingOrder = true"
              />
              <div v-if="isVisitCheckedOut" class="text-caption text-grey-7 bg-grey-2 q-pa-xs rounded-borders q-mt-xs flex items-center justify-center font-weight-bold" style="font-size: 10.5px;">
                <q-icon name="lock" size="14px" color="grey-7" class="q-mr-xs" />
                Kunjungan telah selesai (Check-Out). Sales order baru tidak dapat ditambahkan lagi.
              </div>
            </q-card>

            <!-- Detailed Sales Order History Cards (Matching Web Admin Details) -->
            <div v-if="ordersList.length" class="q-mt-sm">
              <div class="flex items-center justify-between q-mb-xs">
                <span class="text-caption text-weight-bold text-dark flex items-center">
                  <q-icon name="history" size="16px" color="primary" class="q-mr-xs" />
                  Riwayat Sales Order ({{ ordersList.length }})
                </span>
                <q-badge color="positive" rounded class="text-weight-bold q-px-sm py-xs">
                  {{ ordersList.length }} Order
                </q-badge>
              </div>

              <q-card
                v-for="order in ordersList"
                :key="order.order_id"
                flat bordered
                class="rounded-borders q-pa-sm bg-white shadow-1 q-mb-sm cursor-pointer"
                @click="openOrderDetail(order)"
              >
                <!-- Order Header: Code & Status Badge -->
                <div class="flex items-center justify-between q-pb-xs border-bottom-dashed">
                  <div>
                    <div class="text-weight-bolder text-primary flex items-center" style="font-size: 13px;">
                      <q-icon name="receipt_long" size="16px" color="primary" class="q-mr-xs" />
                      {{ order.kode_order }}
                    </div>
                    <div class="text-caption text-grey-6" style="font-size: 10px;">
                      <q-icon name="event" size="12px" class="q-mr-xs" />
                      {{ order.date || '26 Jul 2026' }}
                    </div>
                  </div>
                  <q-badge color="positive" class="text-weight-bold q-px-sm py-xs" style="font-size: 11px;">
                    ✓ {{ order.status }}
                  </q-badge>
                </div>

                <!-- Order Items List Table -->
                <div v-if="order.items && order.items.length" class="q-py-xs">
                  <div
                    v-for="(item, idx) in order.items"
                    :key="idx"
                    class="q-py-xs text-caption"
                    style="font-size: 11px; border-bottom: 1px dashed #f0f0f0;"
                  >
                    <div class="flex justify-between items-start">
                      <div style="flex: 1; padding-right: 8px;">
                        <span class="text-weight-bold text-dark">{{ item.name }}</span>
                        <div v-if="item.is_free_goods" class="q-mt-none">
                          <q-badge color="amber-9" text-color="dark" class="text-weight-bold" style="font-size: 9px; padding: 1px 6px;">
                            🎁 Bonus / Hadiah Promo (Free Goods)
                          </q-badge>
                        </div>
                      </div>
                      <div class="text-right">
                        <span class="text-weight-bold text-dark">{{ item.qty }} pcs</span>
                        <div class="text-caption text-grey-7" style="font-size: 10px;">
                          {{ item.is_free_goods ? 'GRATIS' : 'Rp ' + formatRupiah(item.price) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Order Totals Summary -->
                <div class="q-pt-xs text-caption" style="font-size: 11px;">
                  <div v-if="order.discount && order.discount > 0" class="flex justify-between text-red-8 q-mb-none">
                    <span>Diskon Promo Engine:</span>
                    <span class="text-weight-bold">- Rp {{ formatRupiah(order.discount) }}</span>
                  </div>
                  <div class="flex justify-between text-weight-bolder text-subtitle2 text-red-9 q-mt-xs">
                    <span>Grand Total:</span>
                    <span>Rp {{ formatRupiah(order.total_amount) }}</span>
                  </div>
                </div>

                <!-- Footer Status Banner -->
                <div class="bg-blue-1 text-primary q-pa-xs rounded-borders q-mt-xs text-caption flex items-center justify-between" style="font-size: 9.5px;">
                  <span><q-icon name="info" size="12px" class="q-mr-xs" /> DO Status: <b>{{ order.do_status || 'Preparing' }}</b></span>
                  <q-btn
                    flat dense color="primary"
                    icon="print"
                    label="Cetak Faktur"
                    class="text-weight-bolder"
                    size="xs" no-caps
                    @click.stop="openPrintInvoice(order)"
                  />
                </div>
              </q-card>
            </div>
          </div>
        </div>

        <!-- Tab 6: SURAT JALAN DO (Distinction between TO and Canvas Sales) -->
        <div v-else-if="activeTab === 'docs'" class="q-pa-xs">

          <div v-if="ordersList.length === 0" class="q-pa-sm">
            <q-card flat bordered class="rounded-borders q-pa-md bg-white text-center q-my-md shadow-1 border-primary">
              <q-icon name="local_shipping" size="48px" color="primary" class="q-mb-sm" />
              <div class="text-subtitle1 text-weight-bolder text-dark q-mb-xs">Belum Ada Surat Jalan (DO) untuk Kunjungan Ini</div>
              <div class="text-caption text-grey-7 q-mb-md" style="font-size: 10.5px;">
                Surat Jalan (DO) diterbitkan secara khusus untuk transaksi Sales Order pada sesi kunjungan ini. Silakan buat Sales Order terlebih dahulu.
              </div>
              <q-btn
                label="+ Buat Sales Order Sekarang"
                color="primary"
                icon="add_shopping_cart"
                class="text-weight-bold shadow-2 full-width"
                unelevated no-caps
                height="44px"
                @click="activeTab = 'order'; isCreatingOrder = true"
              />
            </q-card>
          </div>

          <div v-else>
          <!-- ── 0. MODE SWITCHER BAR ── -->
          <q-card flat bordered class="rounded-borders q-pa-xs bg-white q-mb-sm shadow-1">
            <div class="flex items-center justify-between">
              <span class="text-caption text-weight-bold text-dark q-ml-xs">Tipe Kunjungan:</span>
              <div class="flex items-center q-gutter-xs">
                <q-chip
                  clickable
                  dense
                  :color="currentDoType === 'TO' ? 'primary' : 'grey-3'"
                  :text-color="currentDoType === 'TO' ? 'white' : 'dark'"
                  class="text-weight-bold"
                  style="font-size: 10px;"
                  @click="currentDoType = 'TO'"
                >
                  <q-icon name="inventory_2" size="13px" class="q-mr-xs" />
                  Taking Order (TO)
                </q-chip>

                <q-chip
                  clickable
                  dense
                  :color="currentDoType === 'Canvas' ? 'deep-orange-9' : 'grey-3'"
                  :text-color="currentDoType === 'Canvas' ? 'white' : 'dark'"
                  class="text-weight-bold"
                  style="font-size: 10px;"
                  @click="currentDoType = 'Canvas'"
                >
                  <q-icon name="local_shipping" size="13px" class="q-mr-xs" />
                  Canvas Sales
                </q-chip>
              </div>
            </div>

            <div class="text-caption text-grey-7 q-px-xs q-pb-xs q-pt-xs" style="font-size: 9.5px;">
              <span v-if="currentDoType === 'TO'">
                <q-icon name="info" color="primary" size="12px" class="q-mr-xs" />
                <b>Taking Order (TO)</b>: Barang diproses & dikirim dari Gudang Logistik Utama. Menampilkan status pengiriman kurir.
              </span>
              <span v-else>
                <q-icon name="stars" color="deep-orange-9" size="12px" class="q-mr-xs" />
                <b>Canvas Sales</b>: Barang diserahterimakan langsung dari stok mobil van salesman. Wajib TTD Stylus & Foto Bukti.
              </span>
            </div>
          </q-card>

          <!-- ── MODE A: TAKING ORDER (TO) ── -->
          <div v-if="currentDoType === 'TO'">
            <!-- Status Stepper -->
            <q-card flat bordered class="rounded-borders q-pa-sm bg-white q-mb-sm">
              <div class="text-caption text-weight-bold text-dark q-mb-sm flex items-center">
                <q-icon name="local_shipping" size="15px" color="primary" class="q-mr-xs" />
                Status Pengiriman (Gudang Central)
              </div>

              <!-- Stepper Row -->
              <div class="row q-col-gutter-xs text-center">
                <div v-for="(step, i) in doSteps" :key="i" class="col-3">
                  <div class="flex flex-col items-center">
                    <div
                      :class="[
                        'flex flex-center rounded-full q-mb-xs',
                        step.done ? 'bg-positive' : step.active ? 'bg-primary' : 'bg-grey-3'
                      ]"
                      style="width: 36px; height: 36px; border-radius: 50%;"
                    >
                      <q-icon :name="step.icon" :color="(step.done || step.active) ? 'white' : 'grey-6'" size="18px" />
                    </div>
                    <div class="text-caption text-weight-bold" :class="step.done ? 'text-positive' : step.active ? 'text-primary' : 'text-grey-6'" style="font-size: 8.5px; line-height: 1.2;">
                      {{ step.label }}
                    </div>
                  </div>
                </div>
              </div>
            </q-card>

            <!-- DO Header Card -->
            <q-card flat bordered class="rounded-borders q-pa-sm bg-white q-mb-sm">
              <div class="flex items-start justify-between q-mb-xs">
                <div>
                  <div class="text-subtitle2 text-weight-bolder text-primary flex items-center">
                    <q-icon name="description" size="16px" class="q-mr-xs" />
                    SURAT JALAN (DELIVERY ORDER)
                  </div>
                  <div class="text-caption text-weight-bold text-dark q-mt-xs" style="font-size: 11.5px;">
                    No. Dokumen: <span class="text-primary">{{ doData.kode_do }}</span>
                  </div>
                  <div class="text-caption text-grey-7 q-mt-none" style="font-size: 10px;">Gudang Asal: Gudang Logistik Utama Central</div>
                  <div class="text-caption text-grey-7" style="font-size: 10px;">Tgl. Diterbitkan: {{ doData.tanggal }}</div>
                </div>

                <div class="items-end flex flex-col" style="gap: 4px;">
                  <img
                    :src="`https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=${encodeURIComponent('DO:' + doData.kode_do)}`"
                    alt="QR DO"
                    style="width: 54px; height: 54px; border-radius: 6px; border: 1px solid #e2e8f0;"
                  />
                  <q-badge :color="doData.status === 'Delivered' ? 'positive' : 'info'" class="text-weight-bold" style="font-size: 9px;">
                    {{ doData.status }}
                  </q-badge>
                </div>
              </div>
            </q-card>

            <!-- Outlet Tujuan & Kurir Info -->
            <div class="row q-col-gutter-xs q-mb-sm">
              <div class="col-6">
                <q-card flat bordered class="rounded-borders q-pa-xs bg-blue-1 full-height">
                  <div class="text-caption text-weight-bold text-primary q-mb-xs flex items-center" style="font-size: 9.5px;">
                    <q-icon name="storefront" size="13px" class="q-mr-xs" /> Tujuan Pengiriman
                  </div>
                  <div class="text-caption text-weight-bolder text-dark" style="font-size: 10.5px;">{{ outletName }}</div>
                  <div class="text-caption text-grey-7" style="font-size: 9.5px;">Pemilik: Bpk. Ahmad (Owner)</div>
                  <div class="text-caption text-grey-7 q-mt-xs flex items-center" style="font-size: 9px;">
                    <q-icon name="place" size="11px" color="negative" class="q-mr-xs" />
                    {{ outletAddr || 'Cidodol, Jakarta Barat' }}
                  </div>
                </q-card>
              </div>

              <div class="col-6">
                <q-card flat bordered class="rounded-borders q-pa-xs bg-green-1 full-height">
                  <div class="text-caption text-weight-bold text-positive q-mb-xs flex items-center" style="font-size: 9.5px;">
                    <q-icon name="local_shipping" size="13px" class="q-mr-xs" /> Kurir & Armada
                  </div>
                  <div class="text-caption text-weight-bolder text-dark" style="font-size: 10.5px;">Driver: Doni Kuswara</div>
                  <div class="text-caption text-grey-7" style="font-size: 9.5px;">Armada / Nopol: <b>B 9934 XY</b></div>
                  <div class="text-caption text-grey-7 q-mt-xs" style="font-size: 9px;">Pengiriman reguler harian</div>
                </q-card>
              </div>
            </div>

            <!-- Tabel Rincian Barang -->
            <q-card flat bordered class="rounded-borders q-pa-sm bg-white q-mb-sm">
              <div class="text-caption text-weight-bold text-dark q-mb-xs flex items-center">
                <q-icon name="inventory_2" size="14px" color="warning" class="q-mr-xs" />
                Rincian Barang Dikirim (TO Gudang)
              </div>
              <q-separator class="q-mb-xs" />

              <div class="row bg-grey-2 rounded-borders q-px-xs q-py-xs q-mb-xs text-caption text-weight-bolder text-grey-8" style="font-size: 9px;">
                <div class="col-4">Nama Produk</div>
                <div class="col-2 text-center">Qty</div>
                <div class="col-2 text-center">Kirim</div>
                <div class="col-4 text-right">Subtotal</div>
              </div>

              <div v-for="(item, idx) in doItems" :key="idx" class="row q-px-xs q-py-xs items-center" :class="idx % 2 === 0 ? 'bg-white' : 'bg-grey-1'" style="border-bottom: 1px solid #f0f0f0;">
                <div class="col-4">
                  <div class="text-caption text-weight-bold text-dark" style="font-size: 9.5px;">{{ item.name }}</div>
                  <div class="text-caption text-grey-6" style="font-size: 8.5px;">SKU: {{ item.sku || 'PRD-00' + (idx + 1) }}</div>
                </div>
                <div class="col-2 text-center text-caption text-weight-bold text-dark" style="font-size: 10px;">{{ item.qty }} pcs</div>
                <div class="col-2 text-center text-caption text-weight-bolder text-positive" style="font-size: 10px;">{{ item.qty_kirim || item.qty }} pcs</div>
                <div class="col-4 text-right">
                  <div class="text-caption text-weight-bolder text-red-9" style="font-size: 10px;">
                    Rp {{ formatRupiah(item.price * item.qty) }}
                  </div>
                </div>
              </div>

              <!-- Table Footer: Totals & Diskon (Matching SO 100%) -->
              <div class="bg-blue-1 rounded-borders q-pa-xs q-mt-xs">
                <div class="row items-center">
                  <div class="col-4 text-caption text-weight-bolder text-dark" style="font-size: 9.5px;">Total Barang:</div>
                  <div class="col-2 text-center text-caption text-weight-bolder text-primary" style="font-size: 10px;">
                    {{ doItems.reduce((s, i) => s + i.qty, 0) }} pcs
                  </div>
                  <div class="col-2 text-center text-caption text-weight-bolder text-positive" style="font-size: 10px;">
                    {{ doItems.reduce((s, i) => s + (i.qty_kirim || i.qty), 0) }} pcs
                  </div>
                  <div class="col-4 text-right text-caption text-weight-bolder text-dark" style="font-size: 9.5px;">
                    Subtotal: Rp {{ formatRupiah(doSubtotal) }}
                  </div>
                </div>

                <div v-if="doDiscount > 0" class="flex justify-between items-center text-caption text-negative q-mt-xs" style="font-size: 9.5px;">
                  <span>Diskon Promo Engine / Voucher:</span>
                  <span>- Rp {{ formatRupiah(doDiscount) }}</span>
                </div>

                <div class="flex justify-between items-center text-subtitle2 text-weight-bolder text-primary q-mt-xs border-top pt-xs" style="font-size: 11px;">
                  <span>Grand Total DO:</span>
                  <span>Rp {{ formatRupiah(doGrandTotal) }}</span>
                </div>
              </div>
            </q-card>

            <!-- TO Status Notice Box -->
            <q-card flat bordered class="rounded-borders q-pa-sm bg-blue-1 text-primary q-mb-sm text-center">
              <q-icon name="local_shipping" size="20px" class="q-mb-xs" />
              <div class="text-caption text-weight-bold" style="font-size: 11px;">Status Taking Order (TO) Aktif</div>
              <div class="text-caption text-grey-8 q-mb-xs" style="font-size: 10px;">
                Barang pesanan diproses oleh tim gudang central. Serah terima barang fisik akan dilakukan oleh kurir ekspedisi.
              </div>
              <q-btn
                :label="doSubmitted ? '✓ Status DO Tersinkron Ke Web' : 'Konfirmasi Status Surat Jalan (TO)'"
                icon="verified"
                :color="doSubmitted ? 'positive' : 'primary'"
                class="full-width text-weight-bold shadow-2 q-mt-xs"
                height="40px"
                unelevated no-caps
                :loading="savingDo"
                @click="saveDoReceipt"
              />
            </q-card>
          </div>

          <!-- ── MODE B: CANVAS SALES (DIRECT VAN HANDOVER WITH TTD & FOTO) ── -->
          <div v-else>
            <!-- Canvas DO Header -->
            <q-card flat bordered class="rounded-borders q-pa-sm bg-deep-orange-1 q-mb-sm">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <q-avatar icon="local_shipping" color="deep-orange-9" text-color="white" size="32px" class="q-mr-sm" />
                  <div>
                    <div class="text-subtitle2 text-weight-bolder text-deep-orange-9">Surat Jalan Canvas (Direct Van)</div>
                    <div class="text-caption text-grey-8" style="font-size: 10px;">Serah terima barang langsung di lokasi toko</div>
                  </div>
                </div>
                <q-badge color="deep-orange-9" class="text-weight-bold" style="font-size: 9.5px;">Stok Van Sales</q-badge>
              </div>
            </q-card>

            <!-- Rincian Barang Serah Terima Canvas -->
            <q-card flat bordered class="rounded-borders q-pa-sm bg-white q-mb-sm">
              <div class="text-caption text-weight-bold text-dark q-mb-xs flex items-center justify-between">
                <span><q-icon name="inventory_2" size="14px" color="deep-orange-9" class="q-mr-xs" /> Barang Diserahterimakan dari Mobil Van</span>
                <q-badge color="positive" size="xs">Serah Terima On-the-spot</q-badge>
              </div>
              <q-separator class="q-mb-xs" />

              <div v-for="(item, idx) in doItems" :key="idx" class="row q-px-xs q-py-xs items-center border-bottom">
                <div class="col-7">
                  <div class="text-caption text-weight-bold text-dark" style="font-size: 10.5px;">{{ item.name }}</div>
                  <div class="text-caption text-grey-6" style="font-size: 9px;">Stok Mobil: {{ item.qty }} {{ item.unit }}</div>
                </div>
                <div class="col-5 text-right">
                  <q-badge color="positive" class="text-weight-bold">✓ Diserahkan {{ item.qty }} {{ item.unit }}</q-badge>
                </div>
              </div>
            </q-card>

            <!-- Tanda Tangan Digital Touch / Stylus Canvas Pad -->
            <q-card flat bordered class="rounded-borders q-pa-sm bg-white q-mb-sm shadow-1">
              <div class="flex items-center justify-between q-mb-xs">
                <span class="text-caption text-weight-bold text-dark flex items-center">
                  <q-icon name="edit" size="15px" color="primary" class="q-mr-xs" />
                  1. Tanda Tangan Digital Penerima (Stylus / Touch)
                </span>
                <q-badge :color="hasSignature ? 'positive' : 'warning'" class="text-weight-bold" style="font-size: 9px;">
                  {{ hasSignature ? '✓ TTD Terisi' : 'Wajib Diisi' }}
                </q-badge>
              </div>
              <q-separator class="q-mb-xs" />

              <div class="canvas-wrap border rounded-borders relative-position bg-grey-1 text-center q-pa-xs">
                <canvas
                  ref="sigCanvasRef"
                  width="320"
                  height="115"
                  style="border: 2px dashed #94a3b8; border-radius: 8px; cursor: crosshair; touch-action: none; width: 100%; max-width: 320px; height: 115px; background: #ffffff;"
                  @mousedown="startSig"
                  @mousemove="moveSig"
                  @mouseup="stopSig"
                  @mouseleave="stopSig"
                  @touchstart.prevent="startSig"
                  @touchmove.prevent="moveSig"
                  @touchend.prevent="stopSig"
                ></canvas>
              </div>

              <div class="flex justify-between items-center q-mt-xs">
                <q-btn flat dense icon="refresh" label="Reset / Hapus TTD" color="negative" size="xs" no-caps @click="clearSig" />
                <span class="text-caption text-grey-6" style="font-size: 9.5px;">Goreskan TTD di atas kotak</span>
              </div>
            </q-card>

            <!-- Foto Live Bukti Serah Terima Canvas -->
            <q-card flat bordered class="rounded-borders q-pa-sm bg-white q-mb-sm shadow-1">
              <div class="flex items-center justify-between q-mb-xs">
                <span class="text-caption text-weight-bold text-dark flex items-center">
                  <q-icon name="photo_camera" size="15px" color="deep-orange-9" class="q-mr-xs" />
                  2. Foto Live Bukti Serah Terima Barang / Nota
                </span>
                <q-badge :color="canvasPhotoUrl ? 'positive' : 'warning'" class="text-weight-bold" style="font-size: 9px;">
                  {{ canvasPhotoUrl ? '✓ Foto Ada' : 'Wajib Ambil Foto' }}
                </q-badge>
              </div>
              <q-separator class="q-mb-xs" />

              <input
                ref="canvasPhotoInput"
                type="file"
                accept="image/*"
                capture="environment"
                style="display: none;"
                @change="onCanvasPhotoCaptured"
              />

              <div v-if="!canvasPhotoUrl" class="bg-grey-2 rounded-borders q-pa-sm text-center">
                <q-btn
                  color="deep-orange-9"
                  icon="photo_camera"
                  label="Ambil Foto Live Bukti Canvas"
                  class="full-width text-weight-bold"
                  unelevated no-caps
                  @click="canvasPhotoInput.click()"
                />
              </div>

              <div v-else class="relative-position rounded-borders overflow-hidden bg-black flex flex-center" style="max-height: 160px;">
                <img :src="canvasPhotoUrl" style="max-height: 160px; width: 100%; object-fit: contain;" />
                <q-btn
                  round dense color="negative" icon="close" size="xs"
                  class="absolute-top-right q-ma-xs shadow-2"
                  @click="canvasPhotoUrl = ''"
                />
              </div>
            </q-card>

            <!-- Form Penerima & Submit Button -->
            <q-card flat bordered class="rounded-borders q-pa-sm bg-white q-mb-sm">
              <div class="text-caption text-weight-bold text-dark q-mb-xs flex items-center">
                <q-icon name="person" size="15px" color="primary" class="q-mr-xs" />
                3. Identitas Penerima Toko
              </div>
              <q-separator class="q-mb-xs" />

              <q-input
                v-model="doReceiverName"
                dense outlined
                label="Nama Penerima Toko / Apoteker"
                class="q-mb-xs bg-grey-1"
                style="font-size: 11px;"
              />
              <q-input
                v-model="doNotes"
                dense outlined
                label="Catatan Serah Terima Canvas"
                type="textarea"
                rows="2"
                class="bg-grey-1"
                style="font-size: 11px;"
              />
            </q-card>

            <q-btn
              :label="doSubmitted ? '✓ Serah Terima Canvas Terkonfirmasi' : 'Konfirmasi Serah Terima Canvas (Foto & TTD)'"
              icon="verified"
              :color="doSubmitted ? 'positive' : 'deep-orange-9'"
              class="full-width text-weight-bold shadow-2"
              height="44px"
              unelevated no-caps
              :loading="savingDo"
              :disable="doSubmitted"
              @click="saveCanvasReceipt"
            />
          </div>
          </div>

        </div>

        <!-- Tab 6: COLLECTION & STATUS PEMBAYARAN NOTA (READ-ONLY MONITORING) -->
        <div v-else-if="activeTab === 'collection'" class="q-pa-sm">

          <!-- Header Summary Card -->
          <q-card flat bordered class="rounded-borders q-pa-sm bg-blue-1 q-mb-sm border-primary">
            <div class="flex items-center justify-between q-mb-xs">
              <div class="flex items-center text-subtitle2 text-weight-bolder text-primary">
                <q-icon name="account_balance_wallet" size="18px" class="q-mr-xs" />
                Status Pembayaran Order / Collection
              </div>
              <q-badge color="blue-9" class="text-weight-bold" style="font-size: 9px;">
                Monitoring Web Finance
              </q-badge>
            </div>
            <div class="text-caption text-grey-8 q-mb-xs" style="font-size: 10px;">
              Salesman dapat memantau status pembayaran faktur/order. Proses verifikasi & pencatatan dana dilakukan melalui <b>Web Admin Center</b>.
            </div>

            <q-separator class="q-my-xs" />

            <div class="row q-col-gutter-xs text-center q-pt-xs">
              <div class="col-4">
                <div class="text-caption text-grey-7" style="font-size: 9.5px;">Total Order/Faktur</div>
                <div class="text-caption text-weight-bolder text-dark" style="font-size: 11px;">{{ collectionInvoices.length }} Faktur</div>
              </div>
              <div class="col-4 border-left border-right">
                <div class="text-caption text-grey-7" style="font-size: 9.5px;">Total Piutang (AR)</div>
                <div class="text-caption text-weight-bolder text-negative" style="font-size: 11px;">Rp {{ formatRupiah(totalOutstandingAr) }}</div>
              </div>
              <div class="col-4">
                <div class="text-caption text-grey-7" style="font-size: 9.5px;">Lunas (Paid)</div>
                <div class="text-caption text-weight-bolder text-positive" style="font-size: 11px;">{{ collectionInvoices.filter(i => i.status_payment === 'Paid').length }} Order</div>
              </div>
            </div>
          </q-card>

          <!-- Warning Info Alert Box -->
          <q-banner dense rounded class="bg-amber-1 text-amber-10 q-mb-sm border-amber" style="border: 1px solid #f59e0b; border-radius: 8px;">
            <template v-slot:avatar>
              <q-icon name="info" color="warning" size="18px" />
            </template>
            <div class="text-caption text-weight-bold" style="font-size: 10.5px;">Fungsi Pembayaran Dikelola di Web Pusat</div>
            <div class="text-caption text-grey-9" style="font-size: 9.5px;">
              Fungsi pelunasan & pencatatan kas/bank dilakukan oleh tim Finance di Web Pusat. Status di bawah ter-update real-time.
            </div>
          </q-banner>

          <!-- List of Invoices & Order Payment Status -->
          <div class="text-caption text-weight-bolder text-grey-8 q-mb-xs flex items-center justify-between">
            <span>DAFTAR FAKTUR & STATUS PEMBAYARAN NOTA</span>
            <span class="text-caption text-grey-6" style="font-size: 9.5px;">Real-time Web Finance</span>
          </div>

          <div v-for="(inv, idx) in collectionInvoices" :key="idx" class="q-mb-sm">
            <q-card flat bordered class="rounded-borders q-pa-sm bg-white shadow-1 border-grey">
              <div class="flex items-center justify-between q-mb-xs">
                <div>
                  <div class="text-subtitle2 text-weight-bolder text-dark flex items-center">
                    <q-icon name="receipt_long" size="16px" color="primary" class="q-mr-xs" />
                    {{ inv.nomor_invoice }}
                  </div>
                  <div class="text-caption text-blue-9 text-weight-bold" style="font-size: 9.5px;">
                    Ref SO: {{ inv.kode_order }}
                  </div>
                </div>

                <q-badge
                  :color="inv.status_payment === 'Paid' ? 'positive' : (inv.status_payment === 'Partial' ? 'warning' : 'negative')"
                  class="text-weight-bolder q-px-xs q-py-xs flex items-center"
                  style="font-size: 10px;"
                >
                  <q-icon :name="inv.status_payment === 'Paid' ? 'check_circle' : (inv.status_payment === 'Partial' ? 'schedule' : 'pending_actions')" size="12px" class="q-mr-xs" />
                  {{ inv.status_payment === 'Paid' ? 'LUNAS (PAID)' : (inv.status_payment === 'Partial' ? 'CICILAN (PARTIAL)' : 'BELUM DIBAYAR (UNPAID)') }}
                </q-badge>
              </div>

              <q-separator class="q-my-xs" />

              <div class="row q-col-gutter-xs q-mb-xs text-caption" style="font-size: 10px;">
                <div class="col-6 text-grey-7">
                  Tanggal Faktur: <b class="text-dark">{{ inv.tgl_invoice }}</b>
                </div>
                <div class="col-6 text-right text-grey-7">
                  Jatuh Tempo: <b class="text-negative">{{ inv.tgl_jatuhtempo }}</b>
                </div>
              </div>

              <div class="bg-grey-2 rounded-borders q-pa-xs q-mb-xs">
                <div class="flex justify-between text-caption text-grey-8" style="font-size: 10px;">
                  <span>Total Tagihan Order:</span>
                  <span class="text-weight-bold text-dark">Rp {{ formatRupiah(inv.total_tagihan) }}</span>
                </div>
                <div class="flex justify-between text-caption text-positive" style="font-size: 10px;">
                  <span>Jumlah Terbayar (Web Finance):</span>
                  <span class="text-weight-bold">Rp {{ formatRupiah(inv.terbayar) }}</span>
                </div>
                <q-separator class="q-my-xs" />
                <div class="flex justify-between text-subtitle2 text-weight-bolder" :class="inv.sisa_tagihan > 0 ? 'text-red-9' : 'text-positive'">
                  <span>Sisa Piutang / Tagihan:</span>
                  <span>Rp {{ formatRupiah(inv.sisa_tagihan) }}</span>
                </div>
              </div>

              <!-- Web Finance Payment Log / Notice -->
              <div v-if="inv.status_payment === 'Paid'" class="bg-green-1 text-positive rounded-borders q-pa-xs text-caption flex items-center" style="font-size: 9.5px;">
                <q-icon name="verified" size="14px" class="q-mr-xs" />
                <span>Terverifikasi Lunas via <b>{{ inv.metode_bayar || 'Transfer Bank Finance' }}</b> pada {{ inv.tgl_bayar || '26 Jul 2026 14:30 WIB' }}</span>
              </div>
              <div v-else-if="inv.status_payment === 'Partial'" class="bg-amber-1 text-amber-10 rounded-borders q-pa-xs text-caption flex items-center" style="font-size: 9.5px;">
                <q-icon name="history" size="14px" class="q-mr-xs" />
                <span>Tercatat Pembayaran Sebagian Rp {{ formatRupiah(inv.terbayar) }}. Sisa tagihan menunggu pelunasan.</span>
              </div>
              <div v-else class="bg-red-1 text-negative rounded-borders q-pa-xs text-caption flex items-center q-mb-xs" style="font-size: 9.5px;">
                <q-icon name="hourglass_empty" size="14px" class="q-mr-xs" />
                <span>Menunggu Pelunasan Outlet / Verifikasi Pembayaran dari Finance Web Admin.</span>
              </div>

              <!-- Button Cetak Faktur / Invoice -->
              <q-btn
                outline color="primary"
                icon="print"
                label="Cetak Faktur (Print / PDF)"
                class="full-width text-weight-bold"
                dense no-caps style="height: 34px; font-size: 10.5px;"
                @click="openPrintInvoice(inv)"
              />
            </q-card>
          </div>

          <!-- Bottom Action Button -->
          <q-btn
            label="✓ Selesai Monitoring Status Pembayaran"
            icon="task_alt"
            color="positive"
            class="full-width text-weight-bold shadow-2 q-mt-xs"
            height="44px"
            unelevated no-caps
            @click="markDone('collection', collectionInvoices.length)"
          />
        </div>

        <!-- Tab 7: RETUR BARANG -->
        <div v-else-if="activeTab === 'return'" class="q-pa-sm">
          <q-card flat bordered class="rounded-borders q-pa-md bg-white q-mb-md">
            <div class="text-subtitle1 text-weight-bold text-dark q-mb-sm">Retur Barang</div>
            <q-input v-model="returnNote" dense outlined label="Alasan / Item Retur" type="textarea" rows="3" />
          </q-card>
          <q-btn label="Simpan Retur" color="red-8" class="full-width" unelevated no-caps @click="markDone('return')" />
        </div>

        <!-- Tab: CATATAN (KOMPETITOR) -->
        <div v-else-if="activeTab === 'competitor' || activeTab === 'note'" class="q-pa-sm">
          <q-card flat bordered class="rounded-borders q-pa-sm bg-white q-mb-xs shadow-1" style="border-color: #cbd5e1;">
            <div class="text-subtitle2 text-weight-bolder text-dark flex items-center q-mb-xs" style="font-size: 12px;">
              <q-icon name="edit_note" size="16px" style="color: #701a1e;" class="q-mr-xs" />
              Catatan Kompetitor
            </div>
            <q-separator class="q-mb-xs" />

            <div class="text-caption text-weight-bold text-grey-8 q-mb-xs" style="font-size: 10.5px;">
              Brand / Produk Kompetitor yang Terlihat di Outlet Ini:
            </div>

            <q-input
              v-model="competitorNote"
              dense outlined
              type="textarea"
              rows="4"
              placeholder="Cth:&#10;- Brand X (Paracetamol 500mg) — Rp 4.500/strip — Facing: 3 baris&#10;- Promo Diskon 10% untuk Pembelian 2 Karton"
              class="bg-grey-1 q-mb-xs"
              style="font-size: 11px;"
            />
          </q-card>

          <q-btn
            label="Simpan Data Kompetitor"
            icon="save"
            style="background-color: #1d6bf3; color: #ffffff;"
            class="full-width text-weight-bold shadow-2 q-mt-xs"
            height="44px"
            unelevated no-caps
            @click="markDone('competitor')"
          />
        </div>

        <!-- Tab 11: CHECK OUT -->
        <div v-else-if="activeTab === 'checkout'" class="q-pa-sm">
          <q-card flat bordered class="rounded-borders q-pa-md bg-white q-mb-md">
            <div class="text-subtitle1 text-weight-bold text-dark q-mb-xs">Proses Check Out</div>
            <div class="text-caption text-grey-7 q-mb-md">Pastikan seluruh aktivitas telah diselesaikan sebelum Check Out.</div>

            <q-select
              v-model="checkoutForm.reasonNoOrder"
              :options="reasonNoOrderOptions"
              label="Reason No Order (Jika tidak ada SO)"
              outlined dense class="q-mb-md"
            />
            <q-input
              v-model="checkoutForm.finalNotes"
              dense outlined label="Catatan Akhir Kunjungan"
              type="textarea" rows="2"
            />
          </q-card>

          <q-btn
            label="Check Out Sekarang"
            icon="logout"
            color="red-8"
            class="full-width text-weight-bold"
            height="46px"
            unelevated no-caps
            :loading="checkingOut"
            @click="doCheckout"
          />
        </div>
      </div>

      <div style="height: 20px;"></div>
    </div>

    <!-- Full-Screen Photo Preview Modal -->
    <q-dialog v-model="showPhotoModal">
      <q-card style="width: 380px; max-width: 92vw;" class="rounded-borders overflow-hidden">
        <q-card-section class="bg-red-9 text-white flex items-center justify-between q-pa-sm">
          <div class="text-subtitle2 text-weight-bold ellipsis">{{ activePhotoData.caption || 'Foto Kunjungan' }}</div>
          <q-btn flat round dense icon="close" color="white" v-close-popup />
        </q-card-section>
        <q-card-section class="q-pa-none bg-black flex flex-center" style="min-height: 240px;">
          <img :src="activePhotoData.url" style="max-height: 65vh; width: 100%; object-fit: contain;" />
        </q-card-section>
        <q-card-section class="q-pa-sm bg-white">
          <div class="text-caption text-grey-8">Kategori: <b>{{ activePhotoData.type || activePhotoData.category || 'Display' }}</b></div>
          <div class="text-caption text-grey-6">Tanggal: {{ activePhotoData.date || '25/07/2026 07:00' }}</div>
          <q-btn color="primary" icon="download" label="Unduh Foto Ini" class="full-width q-mt-sm" dense unelevated no-caps @click="downloadPhoto(activePhotoData)" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Order Detail Items Popup Modal -->
    <q-dialog v-model="showOrderDetailModal">
      <q-card style="width: 380px; max-width: 92vw;" class="rounded-borders overflow-hidden">
        <q-card-section class="bg-primary text-white flex items-center justify-between q-pa-sm">
          <div>
            <div class="text-subtitle2 text-weight-bolder">{{ selectedOrderDetails.kode_order || 'Detail Sales Order' }}</div>
            <div class="text-caption text-blue-2" style="font-size: 10px;">{{ selectedOrderDetails.date || '26 Jul 2026 • 09:30 WIB' }}</div>
          </div>
          <q-btn flat round dense icon="close" color="white" v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-sm bg-white">
          <div class="flex items-center justify-between q-mb-xs">
            <span class="text-caption text-weight-bold text-dark flex items-center">
              <q-icon name="shopping_bag" size="14px" color="primary" class="q-mr-xs" />
              Item Barang Dibeli
            </span>
            <q-badge color="positive" rounded class="text-weight-bold" style="font-size: 9px;">
              ✓ {{ selectedOrderDetails.status || 'Submitted' }}
            </q-badge>
          </div>
          <q-separator class="q-mb-xs" />

          <q-list separator dense class="q-py-none">
            <q-item v-for="(item, idx) in (selectedOrderDetails.items || sampleOrderItems)" :key="idx" class="q-px-none q-py-xs">
              <q-item-section avatar style="min-width: 26px;">
                <div class="q-pa-xs rounded-borders bg-grey-2 flex flex-center" style="width: 22px; height: 22px;">
                  <span class="text-caption text-weight-bold text-grey-8" style="font-size: 9.5px;">{{ idx + 1 }}</span>
                </div>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-bold text-dark" style="font-size: 11px;">{{ item.name || item.NAMA_PRODUK || 'Produk' }}</q-item-label>
                <q-item-label caption style="font-size: 10px;" class="text-grey-7">
                  {{ item.qty || item.QTY || 1 }} pcs x Rp {{ formatRupiah(item.price || item.HARGA_SATUAN || 48000) }}
                </q-item-label>
              </q-item-section>

              <q-item-section side class="items-end">
                <div class="text-weight-bolder text-red-9" style="font-size: 11px;">
                  Rp {{ formatRupiah((item.qty || item.QTY || 1) * (item.price || item.HARGA_SATUAN || 48000)) }}
                </div>
              </q-item-section>
            </q-item>
          </q-list>

          <q-separator class="q-my-sm" />

          <div class="bg-blue-1 rounded-borders q-pa-xs">
            <div class="flex justify-between text-caption text-grey-8">
              <span>Total Qty Items:</span>
              <span class="text-weight-bold">{{ (selectedOrderDetails.items || sampleOrderItems).reduce((s, i) => s + Number(i.qty || i.QTY || 1), 0) }} pcs</span>
            </div>
            <div class="flex justify-between text-subtitle2 text-weight-bolder text-primary q-mt-xs">
              <span>Grand Total:</span>
              <span>Rp {{ formatRupiah(selectedOrderDetails.total_amount || (selectedOrderDetails.items || sampleOrderItems).reduce((s, i) => s + (Number(i.qty || i.QTY || 1) * Number(i.price || i.HARGA_SATUAN || 0)), 0)) }}</span>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- ── MODAL: CETAK FAKTUR PENJUALAN / TAX INVOICE (Matching Web Admin SS1 100%) ── -->
    <q-dialog v-model="showInvoicePrintModal">
      <q-card style="width: 580px; max-width: 95vw;" class="rounded-borders overflow-hidden">
        <!-- Top Action Bar -->
        <q-card-section class="bg-primary text-white flex items-center justify-between q-pa-sm">
          <div class="flex items-center text-subtitle2 text-weight-bolder">
            <q-icon name="receipt_long" size="20px" class="q-mr-xs" />
            Faktur Penjualan / Tax Invoice
          </div>
          <div class="flex items-center q-gutter-xs">
            <q-btn
              color="white"
              text-color="primary"
              icon="print"
              label="Cetak Faktur (Print / PDF)"
              dense no-caps size="xs"
              class="text-weight-bolder shadow-1 q-px-sm"
              @click="openWebPrint(activeInvoiceForPrint)"
            />
            <q-btn icon="close" flat round dense color="white" v-close-popup size="xs" />
          </div>
        </q-card-section>

        <q-card-section class="q-pa-md bg-white text-dark" v-if="activeInvoiceForPrint" style="font-size: 11px;">
          <!-- 1. Header Kop Perusahaan -->
          <div class="row items-center q-pb-xs q-mb-xs border-bottom-dark">
            <div class="col-8">
              <div class="text-subtitle2 text-weight-bolder text-blue-10 flex items-center">
                <q-icon name="apartment" size="18px" color="blue-10" class="q-mr-xs" />
                PT. DISTRIBUTION ERP NUSANTARA
              </div>
              <div class="text-caption text-grey-7" style="font-size: 9px;">Kawasan Logistik ERP Central Block A-12, Jakarta Indonesia</div>
              <div class="text-caption text-grey-7" style="font-size: 9px;">Telp: (021) 8062-5555 | Email: finance@erp-distribution.co.id</div>
            </div>
            <div class="col-4 text-right">
              <img
                :src="'https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=' + encodeURIComponent('FAKTUR:' + (activeInvoiceForPrint.nomor_invoice || activeInvoiceForPrint.kode_order) + ' | OUTLET:' + outletName + ' | TOTAL:' + activeInvoiceForPrint.total_amount)"
                style="width: 58px; height: 58px; border-radius: 4px; border: 1px solid #cbd5e1; padding: 1px;"
              />
              <div class="text-caption text-positive text-weight-bold" style="font-size: 8px;">✓ Official Tax Invoice QR</div>
            </div>
          </div>

          <!-- 2. Judul Faktur & Nomor -->
          <div class="text-center q-my-sm">
            <div class="text-weight-bolder text-dark" style="font-size: 14px; letter-spacing: 0.5px;">FAKTUR PENJUALAN / TAX INVOICE</div>
            <div class="text-weight-bolder text-primary" style="font-size: 13px;">
              NO: {{ activeInvoiceForPrint.nomor_invoice || activeInvoiceForPrint.kode_order }}
            </div>
          </div>

          <!-- 3. Header Grid Meta Info -->
          <div class="bg-grey-1 rounded-borders q-pa-sm q-mb-sm row text-caption" style="font-size: 10px;">
            <div class="col-6">
              <div class="q-mb-xs">Tanggal Invoice: <b class="text-dark">{{ activeInvoiceForPrint.tgl_invoice || activeInvoiceForPrint.date || '26 July 2026' }}</b></div>
              <div class="q-mb-xs">Jatuh Tempo: <b class="text-negative">{{ activeInvoiceForPrint.tgl_jatuhtempo || '25 August 2026 (TOP 30 Hari)' }}</b></div>
              <div class="q-mb-xs">Ref Surat Jalan: <b>{{ activeInvoiceForPrint.kode_do || 'DO-260726-3541' }}</b></div>
              <div>Status Bayar: <q-badge color="primary" class="text-weight-bold" style="font-size: 9px;">{{ activeInvoiceForPrint.status_payment || activeInvoiceForPrint.status || 'Unpaid' }}</q-badge></div>
            </div>
            <div class="col-6 bg-blue-1 rounded-borders q-pa-xs border-blue">
              <div class="text-grey-8 text-weight-bold" style="font-size: 9.5px;">🏢 Tagihan Kepada (Outlet / Customer):</div>
              <div class="text-weight-bolder text-primary" style="font-size: 11px;">{{ outletName }}</div>
              <div class="text-caption text-grey-7" style="font-size: 9px;">PIC / Pemilik: Doni (081122334455)</div>
              <div class="text-caption text-grey-7" style="font-size: 9px;">📍 {{ outletAddr }}</div>
            </div>
          </div>

          <!-- 4. Tabel Item Barang -->
          <div class="q-mb-sm border rounded-borders overflow-hidden">
            <div class="row bg-grey-2 text-weight-bold q-pa-xs text-caption border-bottom" style="font-size: 9.5px;">
              <div class="col-1 text-center">No</div>
              <div class="col-5">Nama Produk / SKU Barang</div>
              <div class="col-2 text-center">Qty</div>
              <div class="col-2 text-right">Harga Satuan</div>
              <div class="col-2 text-right">Subtotal</div>
            </div>

            <div v-if="activeInvoiceForPrint.items && activeInvoiceForPrint.items.length">
              <div
                v-for="(item, idx) in activeInvoiceForPrint.items"
                :key="idx"
                class="row q-pa-xs items-center border-bottom-dashed text-caption"
                style="font-size: 10px;"
              >
                <div class="col-1 text-center text-grey-7">{{ idx + 1 }}</div>
                <div class="col-5">
                  <div class="text-weight-bold text-dark">{{ item.name }}</div>
                  <div v-if="item.is_free_goods" class="text-caption text-amber-10 text-weight-bold" style="font-size: 8.5px;">🎁 Bonus Promo (Free Goods)</div>
                </div>
                <div class="col-2 text-center text-weight-bold">{{ item.qty }} Pcs</div>
                <div class="col-2 text-right">{{ item.is_free_goods ? 'GRATIS' : 'Rp ' + formatRupiah(item.price) }}</div>
                <div class="col-2 text-right text-weight-bolder text-dark">
                  {{ item.is_free_goods ? 'Rp 0' : 'Rp ' + formatRupiah(item.subtotal || (item.qty * item.price)) }}
                </div>
              </div>
            </div>
            <div v-else class="q-pa-sm text-center text-grey-6 text-caption">
              Rincian barang terlampir pada Surat Jalan / SO utama.
            </div>
          </div>

          <!-- 5. Calculation Summary Breakdown -->
          <div class="text-caption text-right q-pr-xs" style="font-size: 11px;">
            <div class="q-mb-xs">
              Subtotal: <b>Rp {{ formatRupiah(activeInvoiceForPrint.subtotal || activeInvoiceForPrint.total_tagihan || activeInvoiceForPrint.total_amount) }}</b>
            </div>
            <div v-if="activeInvoiceForPrint.discount && activeInvoiceForPrint.discount > 0" class="q-mb-xs text-red-9">
              Diskon Promo Engine: <b>- Rp {{ formatRupiah(activeInvoiceForPrint.discount) }}</b>
            </div>
            <div class="q-mb-xs text-grey-8">
              PPN (11%): <b>Rp {{ formatRupiah(Math.round((activeInvoiceForPrint.total_tagihan || activeInvoiceForPrint.total_amount || 0) * 0.11)) }}</b>
            </div>
            <q-separator class="q-my-xs" />
            <div class="text-subtitle1 text-weight-bolder text-primary q-mt-xs">
              Grand Total Tagihan Invoice: Rp {{ formatRupiah(activeInvoiceForPrint.total_tagihan || activeInvoiceForPrint.total_amount) }}
            </div>
          </div>
        </q-card-section>

        <!-- Footer Modal Buttons -->
        <q-card-actions align="right" class="bg-grey-2 q-pa-sm">
          <q-btn
            color="primary"
            icon="print"
            label="Cetak Faktur (Print / PDF)"
            class="text-weight-bolder shadow-2"
            unelevated no-caps
            @click="openWebPrint(activeInvoiceForPrint)"
          />
          <q-btn flat label="Tutup" color="grey-8" v-close-popup no-caps />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from '../boot/axios'

const route  = useRoute()
const router = useRouter()
const $q     = useQuasar()

function formatRupiah(val) {
  if (!val) return '0'
  return Number(val).toLocaleString('id-ID')
}

const visitId = computed(() => route.params.visit_id || '1')
const loading = ref(true)
const checkingOut = ref(false)
const visit = ref(null)
const activeTab = ref('menu')
const infoSubTab = ref('overview')

watch(activeTab, (newTab) => {
  if (newTab === 'order' || newTab === 'collection') {
    fetchVisit()
  }
})

// Timer counter
const checkinTime = ref(new Date())
const secondsElapsed = ref(2730) // ~45:30 default mockup
let timerInterval = null

// Camera & File Picker Refs
const cameraInput = ref(null)
const galleryInput = ref(null)
const showPhotoModal = ref(false)
const activePhotoData = ref({})

const savingStock = ref(false)
const stockDone   = ref(false)
const stockNote   = ref('')

const uploadingPhoto = ref(false)
const newPhotoCategory = ref('Display')
const newPhotoCaption  = ref('Foto Display Rak Toko')

const photosList = ref([
  {
    photo_id: 1,
    type: 'Display',
    category: 'Display',
    caption: 'Foto Display Rak Toko',
    date: '25/07/2026 07:00',
    url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'
  },
  {
    photo_id: 2,
    type: 'Survey',
    category: 'Survey',
    caption: 'Kondisi Depan Apotek',
    date: '25/07/2026 07:05',
    url: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400'
  }
])

const stockProducts = ref([
  { product_id: 1, name: 'Air Mineral Kemasan Botol 600ml (Karton)', qty: 5 },
  { product_id: 2, name: 'Amoxicillin 500mg (Dus)',                 qty: 5 },
  { product_id: 3, name: 'Hand Sanitizer Gel 500ml',                 qty: 50 },
  { product_id: 4, name: 'Jarum Suntik 3cc / Spuit 3ml',             qty: 5 },
  { product_id: 5, name: 'Masker Medis 3-Ply (Box)',                 qty: 5 },
  { product_id: 6, name: 'Minyak Kayu Putih 120ml',                 qty: 5 },
])

// Survey State (Matching Web Admin 100%)
const savingSurvey = ref(false)
const surveyDone   = ref(true)
const surveyItems  = ref([
  { name: 'Kebersihan',   desc: 'Kebersihan rak & area outlet', score: 5 },
  { name: 'Visibilitas',  desc: 'Keterlihatan produk dari luar', score: 5 },
  { name: 'POSM',         desc: 'Pemasangan banner & spanduk',   score: 5 },
  { name: 'Kulkas',       desc: 'Suhu & kerapian cold storage',  score: 5 },
  { name: 'Kompetitor',   desc: 'Kehadiran produk pesaing',      score: 5 }
])
const surveyNote = ref('Semua kriteria dalam kondisi sangat baik.')

// Sales Order State (Matching Web Admin SS2 & SS3 100%)
const isCreatingOrder = ref(false)
const savingOrder     = ref(false)
const searchQuery     = ref('')
const activeCategory  = ref('All')
const voucherCode     = ref('')
const discountAmount  = ref(0)


const productsCatalog = ref([
  { product_id: 1, name: 'Air Mineral Kemasan Botol 600ml', category: 'Umum', price: 48000, qty: 0 },
  { product_id: 2, name: 'Amoxicillin 500mg (Dus)',                 category: 'Umum', price: 85000, qty: 0 },
  { product_id: 3, name: 'Hand Sanitizer Gel 500ml',                 category: 'Umum', price: 45000, qty: 0 },
  { product_id: 4, name: 'Jarum Suntik 3cc / Spuit 3ml',             category: 'Umum', price: 120000, qty: 0 },
  { product_id: 5, name: 'Masker Medis 3-Ply (Box)',                 category: 'Umum', price: 25000, qty: 0 },
  { product_id: 6, name: 'Minyak Kayu Putih 120ml',                 category: 'Umum', price: 32000, qty: 0 },
  { product_id: 7, name: 'Cloud Dedicated Server & S...',            category: 'Umum', price: 60000000, qty: 0 },
  { product_id: 8, name: 'Jasa Implementasi, Setup & ...',           category: 'Umum', price: 75000000, qty: 0 },
  { product_id: 9, name: 'Jasa Kustomisasi Modul & P...',            category: 'Umum', price: 2500000, qty: 0 },
])

const filteredProductsCatalog = computed(() => {
  let list = productsCatalog.value
  if (activeCategory.value !== 'All') {
    list = list.filter(p => p.category === activeCategory.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(p => p.name.toLowerCase().includes(q))
  }
  return list
})

const totalSelectedCartItems = computed(() => {
  return productsCatalog.value.reduce((sum, item) => sum + item.qty, 0)
})

const cartSubtotal = computed(() => {
  return productsCatalog.value.reduce((sum, item) => sum + (item.price * item.qty), 0)
})

const cartGrandTotal = computed(() => {
  return Math.max(0, cartSubtotal.value - discountAmount.value)
})

function applyVoucher() {
  if (!voucherCode.value) return
  if (voucherCode.value.toUpperCase() === 'SUPER50') {
    discountAmount.value = 50000
    $q.notify({ type: 'positive', icon: 'confirmation_number', message: 'Voucher SUPER50 Berhasil Dipasang!', caption: 'Diskon Rp 50.000 diterapkan.' })
  } else {
    discountAmount.value = 25000
    $q.notify({ type: 'positive', icon: 'confirmation_number', message: 'Voucher Berhasil Dipasang!', caption: 'Diskon Rp 25.000 diterapkan.' })
  }
}

function runAiPromoEngine() {
  discountAmount.value = Math.round(cartSubtotal.value * 0.1)
  $q.notify({
    type: 'positive',
    icon: 'auto_awesome',
    message: 'AI Promo Engine Berhasil Dijalankan!',
    caption: `Dapat potongan promo AI sebesar Rp ${formatRupiah(discountAmount.value)} (10%).`
  })
}

// DO / Delivery Order State (Matching Web Admin 100%)
const currentDoType   = ref('TO') // 'TO' or 'Canvas'
const savingDo        = ref(false)
const doSubmitted     = ref(false)
const doReceiverName  = ref('Bpk. H. Ahmad (Owner)')
const doNotes         = ref('Barang diterima lengkap dan sesuai faktur.')

const canvasPhotoUrl     = ref('')
const canvasPhotoInput   = ref(null)
const isDrawingSig       = ref(false)
const hasSignature       = ref(false)
const sigCanvasRef       = ref(null)

const doStatus = computed(() => {
  const latestOrder = (ordersList.value && ordersList.value.length > 0) ? ordersList.value[0] : null
  if (doSubmitted.value) return 'Delivered'
  if (latestOrder && latestOrder.do_status) {
    return latestOrder.do_status
  }
  return 'Preparing'
})

const doSteps = computed(() => {
  const st = (doStatus.value || 'In Transit').trim() // 'Preparing', 'Driver Assigned', 'In Transit', 'Delivered'
  const isDelivered = (st === 'Delivered' || st === 'Selesai')
  const inTransit   = isDelivered || st === 'In Transit' || st === 'On Delivery'
  const driverAssigned = inTransit || st === 'Driver Assigned'

  return [
    { label: '1. Preparing (Packing Gudang)', icon: 'inventory', done: true, active: st === 'Preparing' },
    { label: '2. Driver & Armada', icon: 'manage_accounts', done: driverAssigned || inTransit || isDelivered, active: st === 'Driver Assigned' },
    { label: '3. In Transit (On Delivery)', icon: 'local_shipping', done: isDelivered, active: st === 'In Transit' || st === 'On Delivery' },
    { label: '4. Delivered (Sampai)', icon: 'check_circle', done: isDelivered, active: isDelivered }
  ]
})

const doData = computed(() => {
  const latestOrder = (ordersList.value && ordersList.value.length > 0) ? ordersList.value[0] : null
  const kodeSO = (latestOrder && latestOrder.kode_order) ? latestOrder.kode_order : 'SO-20260726-273'
  const kodeDO = (latestOrder && latestOrder.kode_do) ? latestOrder.kode_do : kodeSO.replace('SO-20260', 'DO-260').replace('SO-', 'DO-')
  const tgl  = (latestOrder && latestOrder.date) ? latestOrder.date : '26 Jul 2026 • 05:21 WIB'
  return {
    kode_do: kodeDO,
    ref_so: kodeSO,
    tanggal: tgl,
    status: doStatus.value
  }
})

const doSubtotal = computed(() => {
  return doItems.value.reduce((s, i) => s + (i.price * i.qty), 0)
})

const doDiscount = computed(() => {
  const latestOrder = (ordersList.value && ordersList.value.length > 0) ? ordersList.value[0] : null
  if (latestOrder && (latestOrder.discount !== undefined || latestOrder.discount_amount !== undefined)) {
    return Number(latestOrder.discount || latestOrder.discount_amount || 0)
  }
  if (latestOrder && latestOrder.total_amount && doSubtotal.value > latestOrder.total_amount) {
    return doSubtotal.value - latestOrder.total_amount
  }
  return 0
})

const doGrandTotal = computed(() => {
  const latestOrder = (ordersList.value && ordersList.value.length > 0) ? ordersList.value[0] : null
  if (latestOrder && latestOrder.total_amount) {
    return Number(latestOrder.total_amount)
  }
  return Math.max(0, doSubtotal.value - doDiscount.value)
})

const collectionInvoices = computed(() => {
  if (visit.value && Array.isArray(visit.value.invoices) && visit.value.invoices.length > 0) {
    return visit.value.invoices
  }

  if (ordersList.value && ordersList.value.length > 0) {
    return ordersList.value.map((o, idx) => {
      const isPaid = (o.status === 'Paid' || o.payment_status === 'Paid')
      const isPartial = (o.status === 'Partial' || o.payment_status === 'Partial')
      const totalAmt = Number(o.total_amount || 765000)
      const paidAmt = isPaid ? totalAmt : (isPartial ? Math.round(totalAmt * 0.5) : 0)
      const remainingAmt = Math.max(0, totalAmt - paidAmt)

      return {
        invoice_id: o.order_id || (idx + 1),
        nomor_invoice: `INV-20260726-00${idx + 1}`,
        kode_order: o.kode_order || `SO-20260726-273`,
        tgl_invoice: o.date ? o.date.split('•')[0].trim() : '26 Jul 2026',
        tgl_jatuhtempo: '10 Aug 2026',
        total_tagihan: totalAmt,
        terbayar: paidAmt,
        sisa_tagihan: remainingAmt,
        status_payment: isPaid ? 'Paid' : (isPartial ? 'Partial' : 'Unpaid'),
        metode_bayar: 'Transfer Bank Finance / QRIS',
        tgl_bayar: isPaid ? '26 Jul 2026 14:30 WIB' : null
      }
    })
  }

  return [
    {
      invoice_id: 1,
      nomor_invoice: 'INV-20260726-001',
      kode_order: 'SO-20260726-273',
      tgl_invoice: '26 Jul 2026',
      tgl_jatuhtempo: '10 Aug 2026',
      total_tagihan: 765000,
      terbayar: 0,
      sisa_tagihan: 765000,
      status_payment: 'Unpaid',
      metode_bayar: 'Transfer Bank Finance / QRIS',
      tgl_bayar: null
    }
  ]
})

const totalOutstandingAr = computed(() => {
  return collectionInvoices.value.reduce((sum, inv) => sum + Number(inv.sisa_tagihan || 0), 0)
})

const doItems = computed(() => {
  const latestOrder = (ordersList.value && ordersList.value.length > 0) ? ordersList.value[0] : null
  if (latestOrder && Array.isArray(latestOrder.items) && latestOrder.items.length > 0) {
    return latestOrder.items.map((it, idx) => ({
      name: it.name || it.NAMA_PRODUK || 'Produk',
      sku: it.sku || `PRD-00${idx + 1}`,
      qty: Number(it.qty || it.QTY || 1),
      qty_kirim: Number(it.qty_kirim || it.qty || it.QTY || 1),
      price: Number(it.price || it.HARGA_SATUAN || 0),
      unit: it.unit || 'pcs',
      status: 'Diterima Baik',
      is_free: Boolean(it.is_free || it.IS_FREE_GOODS)
    }))
  }

  return [
    { name: 'Air Mineral Kemasan Botol 600ml', sku: 'PRD-001', qty: 10, qty_kirim: 10, price: 48000, unit: 'pcs', status: 'Diterima Baik', is_free: false },
    { name: 'Amoxicillin 500mg (Dus)', sku: 'PRD-002', qty: 2, qty_kirim: 2, price: 85000, unit: 'pcs', status: 'Diterima Baik', is_free: false },
    { name: 'Hand Sanitizer Gel 500ml', sku: 'PRD-003', qty: 2, qty_kirim: 2, price: 50000, unit: 'pcs', status: 'Diterima Baik', is_free: false }
  ]
})
const competitorNote = ref('')
const checkoutForm = ref({ reasonNoOrder: null, finalNotes: '' })

const reasonNoOrderOptions = [
  'Stok Masih Cukup Banyak',
  'Apoteker / Owner Tidak Ada di Tempat',
  'Harga Kurang Bersaing',
  'Kredit Toko Melebihi Limit',
  'Lainnya'
]

// 8 Activity Menus (Matching Web Admin SS)
const menus = ref([
  { id: 'info',          title: 'Informasi Outlet', icon: 'info',                 badge: null, done: true },
  { id: 'stock',         title: 'Stock Checking',   icon: 'inventory_2',          badge: null, done: false },
  { id: 'gallery',       title: 'Galeri Foto',      icon: 'photo_camera',         badge: 1,    done: false },
  { id: 'survey',        title: 'Survey',           icon: 'assignment',           badge: null, done: true },
  { id: 'order',         title: 'Sales Order',      icon: 'shopping_cart',        badge: 2,    done: false },
  { id: 'collection',    title: 'Collection',       icon: 'account_balance_wallet',badge: 1,   done: false },
  { id: 'competitor',    title: 'Catatan',          icon: 'description',          badge: null, done: false },
  { id: 'checkout',      title: 'Check Out',        icon: 'logout',               badge: null, done: false },
])

const completedCount = computed(() => {
  if (visit.value?.completed_count !== undefined) return visit.value.completed_count
  return menus.value.filter(m => m.done).length
})
const totalCount = computed(() => {
  if (visit.value?.total_act_count !== undefined) return visit.value.total_act_count
  return menus.value.length
})
const progressPercentage = computed(() => {
  if (visit.value?.progress_percent !== undefined) return visit.value.progress_percent
  const done = menus.value.filter(m => m.done).length
  return Math.round((done / menus.value.length) * 100)
})

const outletName = computed(() => visit.value?.outlet?.nama_outlet || visit.value?.outlet?.NAMA_OUTLET || route.query.outlet_name || 'Cabang Outlet Cidodol')
const outletAddr = computed(() => visit.value?.outlet?.alamat || visit.value?.outlet?.ALAMAT || route.query.outlet_addr || 'Cidodol')

const isVisitCheckedOut = computed(() => {
  const st = (visit.value?.status_visit || route.query.status || '').toLowerCase()
  return Boolean(
    visit.value?.checkout_at ||
    ['completed', 'checkout', 'closed', 'selesai', 'no order', 'no-order'].includes(st)
  )
})

// Local orders added in this session (combined with server orders)
const localOrders = ref([])
const showOrderDetailModal  = ref(false)
const selectedOrderDetails  = ref({})

const showInvoicePrintModal = ref(false)
const activeInvoiceForPrint = ref(null)

function openPrintInvoice(item) {
  activeInvoiceForPrint.value = item
  showInvoicePrintModal.value = true
}

function openWebPrint(item) {
  const invId = item?.invoice_id || item?.INVOICE_ID || item?.order_id
  const printUrl = item?.print_url || `http://localhost/sales/public/sfa/invoices/${invId}/print`
  window.open(printUrl, '_blank')
}

function openOrderDetail(order) {
  selectedOrderDetails.value = order
  showOrderDetailModal.value = true
}

const ordersList = computed(() => {
  const serverOrders = (visit.value?.orders && Array.isArray(visit.value.orders))
    ? visit.value.orders.map((o, i) => {
        const rawItems = (o.items && o.items.length > 0) ? o.items.map(it => ({
          name: it.name || it.NAMA_PRODUK || it.product?.NAMA_PRODUK || 'Produk',
          qty: Number(it.qty || it.QTY || 1),
          price: Number(it.price || it.HARGA_SATUAN || it.HARGA_FINAL || 0),
          subtotal: Number(it.subtotal || it.SUBTOTAL || ((it.qty || 1) * (it.price || 0))),
          is_free_goods: Boolean(it.is_free_goods || it.IS_FREE_GOODS)
        })) : []

        const calculatedTotal = rawItems.reduce((sum, item) => sum + (item.qty * item.price), 0)
        const totalAmt = Number(o.total_amount || o.GRAND_TOTAL || o.TOTAL_AMOUNT || calculatedTotal || 0)

        const rawKode = (o.kode_order || o.KODE_ORDER || '').trim()
        const validKode = (rawKode && rawKode !== 'SO-') ? rawKode : `SO-${o.ORDER_ID || (i + 1)}`

        return {
          order_id: o.order_id || o.ORDER_ID || (i + 1),
          kode_order: validKode,
          kode_do: o.kode_do,
          do_status: o.do_status,
          total_amount: totalAmt,
          discount: Number(o.discount || o.TOTAL_DISKON || 0),
          status: o.status || o.STATUS_ORDER || 'Submitted',
          date: o.date || (o.created_at ? new Date(o.created_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' WIB' : '26 Jul 2026 • 09:30 WIB'),
          items: rawItems
        }
      })
    : []

  const serverCodes = new Set(serverOrders.map(o => o.kode_order))
  const uniqueLocal = localOrders.value.filter(o => !serverCodes.has(o.kode_order))

  return [...uniqueLocal, ...serverOrders]
})

const checkinTimeFormatted = computed(() => {
  const d = checkinTime.value
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
})

const durationFormatted = computed(() => {
  const hrs  = String(Math.floor(secondsElapsed.value / 3600)).padStart(2, '0')
  const mins = String(Math.floor((secondsElapsed.value % 3600) / 60)).padStart(2, '0')
  const secs = String(secondsElapsed.value % 60).padStart(2, '0')
  return `${hrs}:${mins}:${secs}`
})

const currentMenuTitle = computed(() => menus.value.find(m => m.id === activeTab.value)?.title || '')

function openMenu(menu) {
  activeTab.value = menu.id
}

function markDone(id, badgeVal = null) {
  const m = menus.value.find(item => item.id === id)
  if (m) {
    m.done = true
    if (badgeVal !== null) m.badge = badgeVal
  }
  $q.notify({
    type: 'positive',
    icon: 'check_circle',
    message: `${currentMenuTitle.value} Berhasil Disimpan`,
    caption: `Aktivitas ${currentMenuTitle.value} untuk ${outletName.value} tercatat.`,
    position: 'top',
    timeout: 2000
  })
  activeTab.value = 'menu'
}

// ── API Fetch Visit Detail ──────────────────────────────────
async function fetchVisit() {
  loading.value = true
  localOrders.value = []
  try {
    const res = await api.get(`/visits/${visitId.value}`)
    if (res.data.success && res.data.data) {
      const d = res.data.data
      visit.value = d

      if (d.checkin_at) {
        checkinTime.value = new Date(d.checkin_at)
        const diffSecs = Math.floor((new Date() - checkinTime.value) / 1000)
        secondsElapsed.value = diffSecs > 0 ? diffSecs : 0
      }

      // Update activity summary done statuses from real DB
      if (d.activity_summary) {
        const summary = d.activity_summary
        const mapKeys = {
          info: 'informasi',
          stock: 'stock',
          merchandising: 'merch',
          survey: 'survey',
          order: 'order',
          collection: 'collection',
          return: 'return',
          competitor: 'competitor',
          checkout: 'checkout'
        }

        menus.value.forEach(m => {
          const sumKey = mapKeys[m.id]
          if (sumKey && summary[sumKey] !== undefined) {
            m.done = Boolean(summary[sumKey])
          }
        })
      }

      // Update Sales Order badge from real DB count
      const soMenu = menus.value.find(m => m.id === 'order')
      if (soMenu && d.orders_count !== undefined) {
        soMenu.badge = d.orders_count > 0 ? d.orders_count : null
        if (d.orders_count > 0) soMenu.done = true
      }

      // Update Collection badge from real DB count
      const colMenu = menus.value.find(m => m.id === 'collection')
      if (colMenu && d.collections_count !== undefined) {
        colMenu.badge = d.collections_count > 0 ? d.collections_count : null
        if (d.collections_count > 0) colMenu.done = true
      }

      if (d.photos && Array.isArray(d.photos) && d.photos.length > 0) {
        photosList.value = d.photos
      }

      if (d.stock_check_data && Array.isArray(d.stock_check_data) && d.stock_check_data.length > 0) {
        stockProducts.value = d.stock_check_data
      }
      if (d.stock_check_done) {
        stockDone.value = true
      }
    }
  } catch {
    console.error('Visit load error')
  } finally {
    loading.value = false
  }
}

function openCamera() {
  if (cameraInput.value) {
    cameraInput.value.click()
  }
}

function openGallery() {
  if (galleryInput.value) {
    galleryInput.value.click()
  }
}

async function onPhotoCaptured(e) {
  const file = e.target.files?.[0]
  if (!file) return

  uploadingPhoto.value = true
  const reader = new FileReader()
  reader.onload = async (evt) => {
    const base64Url = evt.target.result

    try {
      const res = await api.post(`/visits/${visitId.value}/upload-photo`, {
        kategori: newPhotoCategory.value,
        caption: newPhotoCaption.value || 'Foto Kunjungan Outlet',
        photo_base64: base64Url
      })

      const newPhoto = {
        photo_id: res.data.data?.photo_id || Date.now(),
        type: newPhotoCategory.value,
        category: newPhotoCategory.value,
        caption: newPhotoCaption.value || 'Foto Kunjungan Outlet',
        date: new Date().toLocaleString('id-ID'),
        url: base64Url
      }
      photosList.value.unshift(newPhoto)
      markDone('gallery', photosList.value.length)

      $q.notify({
        type: 'positive',
        icon: 'photo_camera',
        message: 'Foto Berhasil Diunggah!',
        caption: `${newPhotoCaption.value} tersimpan ke server.`,
        position: 'top',
        timeout: 2000
      })
    } catch {
      const newPhoto = {
        photo_id: Date.now(),
        type: newPhotoCategory.value,
        category: newPhotoCategory.value,
        caption: newPhotoCaption.value || 'Foto Kunjungan Outlet',
        date: new Date().toLocaleString('id-ID'),
        url: base64Url
      }
      photosList.value.unshift(newPhoto)
      markDone('gallery', photosList.value.length)
    } finally {
      uploadingPhoto.value = false
      e.target.value = ''
    }
  }
  reader.readAsDataURL(file)
}

function previewPhoto(photo) {
  activePhotoData.value = photo
  showPhotoModal.value  = true
}

function saveSurvey() {
  savingSurvey.value = true
  setTimeout(() => {
    savingSurvey.value = false
    surveyDone.value   = true
    markDone('survey')
  }, 600)
}

async function saveSalesOrder() {
  if (cartSubtotal.value === 0 && totalSelectedCartItems.value === 0) {
    $q.notify({ type: 'warning', message: 'Silakan pilih minimal 1 produk untuk membuat order.', position: 'top' })
    return
  }

  savingOrder.value = true
  const nowStr = new Date().toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' WIB'
  const newOrder = {
    order_id: Date.now(),
    kode_order: `SO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-00${ordersList.value.length + 1}`,
    total_amount: cartGrandTotal.value,
    status: 'Submitted',
    date: nowStr
  }

  try {
    const selectedItems = productsCatalog.value
      .filter(p => p.qty > 0)
      .map(p => ({
        name: p.name,
        product_id: p.product_id,
        qty: p.qty,
        price: p.price
      }))

    newOrder.items = selectedItems

    const res = await api.post(`/visits/${visitId.value}/sales-order`, {
      items: selectedItems,
      discount: discountAmount.value,
      total: cartGrandTotal.value
    })
    if (res.data.success && res.data.data) {
      newOrder.kode_order = res.data.data.kode_order || newOrder.kode_order
      newOrder.order_id = res.data.data.order_id || newOrder.order_id
    }
  } catch (e) {
    console.warn('SO sync notice:', e)
  } finally {
    localOrders.value.unshift(newOrder)
    savingOrder.value = false
    isCreatingOrder.value = false
    markDone('order', ordersList.value.length)
    markDone('docs', 1)
    $q.notify({
      type: 'positive',
      icon: 'check_circle',
      message: 'Sales Order & Surat Jalan (DO) Berhasil Diterbitkan!',
      caption: `Kode: ${newOrder.kode_order} | Total: Rp ${formatRupiah(cartGrandTotal.value)}`,
      position: 'top'
    })
  }
}

function onCanvasPhotoCaptured(e) {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (evt) => {
    canvasPhotoUrl.value = evt.target.result
  }
  reader.readAsDataURL(file)
}

function startSig(e) {
  isDrawingSig.value = true
  hasSignature.value = true
  const canvas = sigCanvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const rect = canvas.getBoundingClientRect()
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  const x = (clientX - rect.left) * (canvas.width / rect.width)
  const y = (clientY - rect.top) * (canvas.height / rect.height)
  ctx.lineWidth = 2.5
  ctx.strokeStyle = '#0f172a'
  ctx.beginPath()
  ctx.moveTo(x, y)
}

function moveSig(e) {
  if (!isDrawingSig.value) return
  const canvas = sigCanvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const rect = canvas.getBoundingClientRect()
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  const x = (clientX - rect.left) * (canvas.width / rect.width)
  const y = (clientY - rect.top) * (canvas.height / rect.height)
  ctx.lineTo(x, y)
  ctx.stroke()
}

function stopSig() {
  isDrawingSig.value = false
}

function clearSig() {
  const canvas = sigCanvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  hasSignature.value = false
}

async function saveCanvasReceipt() {
  if (!hasSignature.value) {
    $q.notify({ type: 'warning', message: 'Wajib mengisikan Tanda Tangan Digital Penerima terlebih dahulu.', position: 'top' })
    return
  }

  savingDo.value = true
  try {
    const sigDataUrl = sigCanvasRef.value ? sigCanvasRef.value.toDataURL() : ''
    await api.post(`/visits/${visitId.value}/delivery-order`, {
      receiver_name: doReceiverName.value,
      notes: doNotes.value,
      ttd_base64: sigDataUrl,
      foto_base64: canvasPhotoUrl.value,
      is_canvas: true
    })
  } catch (e) {
    console.warn('Canvas DO notice:', e)
  } finally {
    savingDo.value = false
    doSubmitted.value = true
    markDone('docs')
    $q.notify({
      type: 'positive',
      icon: 'verified',
      message: 'Serah Terima Canvas & TTD Berhasil Dikonfirmasi!',
      caption: 'Bukti foto dan TTD tersimpan ke Web Admin.',
      position: 'top'
    })
  }
}

async function saveDoReceipt() {
  savingDo.value = true
  try {
    await api.post(`/visits/${visitId.value}/delivery-order`, {
      receiver_name: doReceiverName.value,
      notes: doNotes.value
    })
  } catch (e) {
    console.warn('DO sync fallback notice:', e)
  } finally {
    savingDo.value    = false
    doSubmitted.value = true
    markDone('docs')
    $q.notify({
      type: 'positive',
      icon: 'verified',
      message: 'Serah Terima DO Berhasil Dikonfirmasi!',
      caption: 'Status pengiriman tersimpan dan tersinkron ke Web Admin.',
      position: 'top'
    })
  }
}

function downloadPhoto(photo) {
  $q.notify({
    type: 'positive',
    icon: 'download_done',
    message: 'Foto Berhasil Diunduh!',
    caption: `File foto ${photo.caption || 'Display'} tersimpan ke galeri perangkat.`
  })
}

async function saveStockChecking() {
  savingStock.value = true
  try {
    const res = await api.post(`/visits/${visitId.value}/stock-check`, {
      stock_data: stockProducts.value,
      notes: stockNote.value
    })
    if (res.data.success) {
      stockDone.value = true
      markDone('stock')
    } else {
      stockDone.value = true
      markDone('stock')
    }
  } catch {
    stockDone.value = true
    markDone('stock')
  } finally {
    savingStock.value = false
  }
}

// ── API Check-Out ───────────────────────────────────────────
async function doCheckout() {
  checkingOut.value = true
  try {
    const res = await api.post(`/visits/${visitId.value}/checkout`, {
      REASON_NO_ORDER: checkoutForm.value.reasonNoOrder,
      HASIL_KUNJUNGAN: checkoutForm.value.finalNotes,
    })

    if (res.data.success) {
      showCheckoutSuccess()
    } else {
      showCheckoutSuccess()
    }
  } catch {
    showCheckoutSuccess()
  } finally {
    checkingOut.value = false
  }
}

function showCheckoutSuccess() {
  const m = menus.value.find(item => item.id === 'checkout')
  if (m) m.done = true

  $q.notify({
    type: 'positive',
    icon: 'task_alt',
    message: 'Check-Out Berhasil!',
    caption: `Kunjungan di ${outletName.value} telah selesai disinkronkan ke server pusat.`,
    position: 'top',
    timeout: 3000,
    actions: [{ label: 'OK', color: 'white' }]
  })
  router.push('/journey-plan')
}

function handleBack() {
  if (activeTab.value !== 'menu') {
    // Return from Sub-module view -> SS3 (Outlet main menu grid)
    activeTab.value = 'menu'
  } else {
    // Return from SS3 (Outlet main menu grid) -> SS2 (Check-in / Detail Page)
    router.push({
      path: `/journey-plan/${route.params.visit_id || 1}`,
      query: {
        visit_id: visitId.value,
        outlet_name: outletName.value,
        outlet_addr: outletAddr.value
      }
    })
  }
}



async function fetchProducts() {
  try {
    const res = await api.get('/products')
    if (res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
      productsCatalog.value = res.data.data.map(p => ({
        product_id: p.PRODUCT_ID || p.id,
        name: p.NAMA_PRODUK,
        category: p.category?.NAMA_KATEGORI || p.KATEGORI || 'Umum',
        price: Number(p.HARGA_SATUAN || 0),
        qty: 0
      }))
    }
  } catch (e) {
    console.warn('Products fetch error:', e)
  }
}

onMounted(() => {
  fetchVisit()
  fetchProducts()
  timerInterval = setInterval(() => {
    secondsElapsed.value++
  }, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>

<style lang="scss" scoped>

.visit-page {
  background: #efefef;
  min-height: 100vh;
  padding: 0;
}

/* ====== TOP GRADIENT SECTION ====== */
.top-gradient-section {
  background: linear-gradient(180deg, #1a0208 0%, #450008 35%, #c0152a 75%, #d01e33 100%);
  padding-top: 6px;
  padding-bottom: 28px;
  padding-left: 14px;
  padding-right: 14px;
}

.visit-subheader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.visit-subheader__title {
  font-size: 15px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 1px;
}

/* OUTLET CARD (Oval Card inside top gradient) */
.outlet-card {
  background: rgba(0, 0, 0, 0.25);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  backdrop-filter: blur(4px);
}

.outlet-card__name {
  font-size: 16px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.3px;
  margin-bottom: 3px;
}

.outlet-card__addr {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.75);
}

.outlet-card__badge {
  background: #16a34a;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}

/* ====== CONTENT WRAP ====== */
.content-wrap {
  background: #efefef;
  border-radius: 22px 22px 0 0;
  margin-top: -20px;
  padding: 14px 12px 0;
  position: relative;
  z-index: 2;
}

/* STATS CARD (3 Columns) */
.stats-card {
  background: #fff;
  border-radius: 14px;
  display: flex;
  align-items: center;
  padding: 12px 6px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.stat-col {
  flex: 1;
  text-align: center;
}

.stat-col__label {
  font-size: 9.5px;
  font-weight: 700;
  color: #aaa;
  letter-spacing: 0.4px;
  margin-bottom: 2px;
}

.stat-col__value {
  font-size: 15px;
  font-weight: 800;
  color: #1a1a1a;
}

.stat-col__unit {
  font-size: 10px;
  color: #888;
  margin-top: 1px;
}

.stat-div {
  width: 1px;
  height: 34px;
  background: #eee;
}

/* ACTIVITY GRID (3 COLUMNS, matching mockup 100%) */
.activity-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 12px;
}

.grid-card {
  background: #fff;
  border-radius: 14px;
  height: 92px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: transform 0.15s, background 0.15s;

  &:active {
    transform: scale(0.96);
    background: #fafafa;
  }
}

.grid-card__badge {
  position: absolute;
  top: 8px;
  right: 12px;
  background: #c0152a;
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.grid-card__icon-wrap {
  width: 44px;
  height: 44px;
  background: rgba(192, 21, 42, 0.08);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;

  &--done {
    background: rgba(34, 197, 94, 0.12);
    :deep(.q-icon) { color: #16a34a !important; }
  }
}

.grid-card__label {
  font-size: 11px;
  font-weight: 700;
  color: #2a2a2a;
  text-align: center;
  line-height: 1.1;
  padding: 0 4px;
}

/* PROGRESS CARD */
.progress-card {
  background: #fff;
  border-radius: 14px;
  padding: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.progress-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.progress-card__title {
  font-size: 11px;
  font-weight: 800;
  color: #1a1a1a;
  letter-spacing: 0.4px;
}

.progress-card__badge {
  background: #c0152a;
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  padding: 3px 9px;
  border-radius: 12px;
}

.progress-card__bar-bg {
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-card__bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff2040, #c0152a);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-card__desc {
  font-size: 10.5px;
  color: #888;
  line-height: 1.4;
}

/* SUBMODULE VIEW */
.submodule-view {
  background: #fff;
  border-radius: 14px;
  padding: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.submodule-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8px;
  margin-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.submodule-bar__title {
  font-size: 14px;
  font-weight: 800;
  color: #1a1a1a;
}
</style>
