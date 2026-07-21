<template>
  <q-page class="bg-grey-2">
    <!-- Loading State -->
    <div v-if="loading" class="flex flex-center" style="height: 80vh;">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <div v-else-if="visit" class="vah-wrapper shadow-2">
      
      <!-- Left Sidebar (Desktop/Tablet) -->
      <div class="vah-sidebar gt-sm">
        <div class="vah-sidebar-header">
          <div class="vah-outlet-name">{{ visit.outlet?.NAMA_OUTLET || 'Unknown Outlet' }}</div>
          <div class="vah-outlet-meta">
            <q-icon name="person" /> {{ visit.outlet?.CONTACT_PERSON || '-' }}
            &nbsp; <q-badge color="grey-3" text-color="grey-9" label="Tier C" />
          </div>
          <div class="vah-progress-bar">
            <div class="vah-progress-fill" :style="{ width: progressPercentage + '%' }"></div>
          </div>
          <div class="text-caption text-grey-5 q-mt-xs">1/9 aktivitas selesai (11%)</div>
        </div>

        <q-scroll-area style="height: calc(100% - 100px);">
          <q-list padding class="text-grey-4">
            <q-item v-for="menu in menus" :key="menu.id" clickable v-ripple
              :active="activeTab === menu.id"
              active-class="bg-primary text-white"
              @click="activeTab = menu.id"
              class="q-mb-xs"
            >
              <q-item-section avatar>
                <q-icon :name="menu.icon" :color="activeTab === menu.id ? 'white' : menu.iconColor" size="20px" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold" style="font-size: 13px;">{{ menu.title }}</q-item-label>
                <q-item-label caption :class="activeTab === menu.id ? 'text-blue-2' : 'text-grey-6'" style="font-size: 11px;">
                  {{ menu.subtitle }}
                </q-item-label>
              </q-item-section>
              <q-item-section side v-if="menu.done">
                <q-icon name="check_circle" color="positive" size="18px" />
              </q-item-section>
              <q-item-section side v-else>
                <q-icon name="radio_button_unchecked" color="grey-7" size="18px" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </div>

      <!-- Right Content Area -->
      <div class="vah-content">
        
        <!-- Mobile Header (Hidden on Desktop) -->
        <div class="lt-md bg-primary text-white q-pa-md shadow-2">
          <!-- State: In Grid Menu -->
          <div v-if="activeTab === 'menu'">
            <div class="flex items-center q-mb-sm">
              <q-btn flat round dense icon="arrow_back" color="white" @click="confirmExit" />
              <div class="text-subtitle1 text-weight-bold q-ml-sm text-uppercase">Aktivitas Kunjungan</div>
            </div>
            <div>
              <div class="flex items-center justify-between">
                <h6 class="text-h6 text-weight-bolder q-my-none">{{ visit.outlet?.NAMA_OUTLET || 'Unknown Outlet' }}</h6>
                <q-badge color="positive" rounded class="q-px-sm q-py-xs shadow-1">
                  <q-icon name="check_circle" color="white" class="q-mr-xs" /> Checked-In
                </q-badge>
              </div>
              <div class="text-caption text-grey-4 q-mt-xs"><q-icon name="place" /> {{ visit.outlet?.ALAMAT }}</div>
            </div>
          </div>
          
          <!-- State: Inside Module -->
          <div v-else class="flex items-center">
            <q-btn flat round dense icon="arrow_back" color="white" @click="activeTab = 'menu'" />
            <div class="text-subtitle1 text-weight-bold q-ml-sm text-uppercase">{{ menus.find(m => m.id === activeTab)?.title }}</div>
          </div>
        </div>

        <div class="q-pa-md">
          
          <div v-show="activeTab === 'menu'" class="lt-md">
            <div class="row q-col-gutter-sm">
              <div class="col-4" v-for="menu in menus" :key="menu.id">
                <q-card 
                  v-ripple 
                  class="text-center q-pa-xs rounded-borders cursor-pointer column flex-center h-100" 
                  :class="menu.done ? 'bg-green-1' : 'bg-white shadow-1'"
                  style="border: 1px solid #e2e8f0; height: 100px;"
                  @click="activeTab = menu.id"
                >
                  <div 
                    class="q-pa-xs q-mb-xs flex flex-center" 
                    :class="menu.done ? 'bg-green-2' : 'bg-blue-1'"
                    style="border-radius: 12px; width: 42px; height: 42px;"
                  >
                    <q-icon 
                      :name="menu.done ? 'check_circle' : menu.icon" 
                      :color="menu.done ? 'positive' : 'primary'" 
                      size="24px" 
                    />
                  </div>
                  <div class="text-caption text-weight-bold text-grey-9" style="line-height: 1.1; font-size: 10.5px;">{{ menu.title }}</div>
                </q-card>
              </div>
            </div>

            <!-- Progres Kunjungan Card -->
            <q-card flat bordered class="q-mt-md rounded-borders bg-white q-pa-md shadow-1">
              <div class="flex items-center justify-between q-mb-xs">
                <div class="text-caption text-weight-bold text-dark">Progres Aktivitas Kunjungan</div>
                <q-badge color="primary" class="text-weight-bold">{{ progressPercentage }}% Selesai</q-badge>
              </div>
              <div class="vah-progress-bar q-mt-xs" style="height: 6px; background: #e2e8f0;">
                <div class="vah-progress-fill" :style="{ width: progressPercentage + '%' }"></div>
              </div>
              <div class="text-caption text-grey-6 q-mt-xs">Lengkapi seluruh aktivitas kunjungan di atas sebelum melakukan Check-Out.</div>
            </q-card>
          </div>

          <!-- Tab 1: INFO -->
          <div v-show="activeTab === 'info'">
            <div class="flex items-center q-mb-md">
              <div class="bg-blue-1 flex flex-center q-mr-md" style="width: 48px; height: 48px; border-radius: 12px;">
                <q-icon name="storefront" size="28px" color="primary" />
              </div>
              <div>
                <h5 class="vah-panel-title">Informasi Outlet</h5>
                <div class="vah-panel-subtitle">Profil, kontak, dan data finansial outlet</div>
              </div>
              <q-space />
              <q-btn flat round icon="close" color="grey-6" class="gt-sm" @click="confirmExit" />
            </div>

            <div class="info-grid">
              <div class="info-card">
                <div class="info-card-label">AR OUTSTANDING</div>
                <div class="info-card-value">Rp 0</div>
                <div class="info-card-sub">dari limit Rp 65,000,000</div>
              </div>
              <div class="info-card">
                <div class="info-card-label">TERMIN PEMBAYARAN</div>
                <div class="info-card-value" style="font-size: 15px;">COD, Net 14 Hari</div>
                <div class="info-card-sub">Pilihan pembayaran aktif</div>
              </div>
              <div class="info-card">
                <div class="info-card-label">TIER OUTLET</div>
                <div class="info-card-value">C</div>
              </div>
              <div class="info-card">
                <div class="info-card-label">JARAK CHECK-IN</div>
                <div class="info-card-value text-positive">15 m</div>
                <div class="info-card-sub">dari titik GPS outlet</div>
              </div>
            </div>

            <q-card flat bordered class="q-mt-lg rounded-borders">
              <q-card-section class="bg-grey-1 text-weight-bold flex items-center">
                <q-icon name="contacts" class="q-mr-sm" /> Kontak & Lokasi
              </q-card-section>
              <q-separator />
              <q-list dense class="q-pa-sm">
                <q-item>
                  <q-item-section style="max-width: 150px;" class="text-grey-7 text-weight-medium">Pemilik / PIC</q-item-section>
                  <q-item-section class="text-weight-bold">{{ visit.outlet?.CONTACT_PERSON || 'Cindy' }}</q-item-section>
                </q-item>
                <q-item>
                  <q-item-section style="max-width: 150px;" class="text-grey-7 text-weight-medium">Telepon</q-item-section>
                  <q-item-section class="text-weight-bold">{{ visit.outlet?.PHONE || '081122334455' }}</q-item-section>
                </q-item>
                <q-item>
                  <q-item-section style="max-width: 150px;" class="text-grey-7 text-weight-medium">Alamat</q-item-section>
                  <q-item-section class="text-weight-bold">{{ visit.outlet?.ALAMAT || 'Jalan Kemanggisan' }}</q-item-section>
                </q-item>
                <q-item>
                  <q-item-section style="max-width: 150px;" class="text-grey-7 text-weight-medium">Territory</q-item-section>
                  <q-item-section class="text-weight-bold">{{ visit.outlet?.TERRITORY || 'Cinere' }}</q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>

          <!-- Tab 2: STOCK CHECKING -->
          <div v-show="activeTab === 'stock'">
            <div class="flex items-center q-mb-md">
              <div class="bg-blue-1 flex flex-center q-mr-md" style="width: 48px; height: 48px; border-radius: 12px;">
                <q-icon name="dataset" size="28px" color="primary" />
              </div>
              <div>
                <h5 class="vah-panel-title">Stock Checking</h5>
                <div class="vah-panel-subtitle">Data sisa stok produk di rak dan gudang</div>
              </div>
              <q-space />
              <q-btn flat round icon="close" color="grey-6" class="gt-sm" @click="activeTab = 'menu'" />
            </div>

            <q-card flat bordered class="rounded-borders bg-white">
              <div class="q-pa-md" style="border-bottom: 1px solid #e2e8f0;">
                <q-input v-model="stockSearch" dense outlined rounded placeholder="Cari nama produk..." class="bg-grey-1">
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>

              <q-list separator>
                <q-item v-for="item in filteredStock" :key="item.id" class="q-py-md">
                  <q-item-section avatar>
                    <div class="bg-grey-3 flex flex-center" style="width: 48px; height: 48px; border-radius: 8px;">
                      <q-icon name="image" color="grey-5" size="24px" />
                    </div>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold text-dark" style="font-size: 13px; line-height: 1.2; margin-bottom: 4px;">{{ item.name }}</q-item-label>
                    <q-item-label caption class="text-primary text-weight-bold" style="font-size: 10px; text-transform: uppercase;">{{ item.category }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <div class="flex items-center no-wrap bg-grey-1 rounded-borders q-pa-xs" style="border: 1px solid #e2e8f0;">
                      <q-btn round dense unelevated icon="remove" color="white" text-color="dark" size="sm" @click="item.qty > 0 && item.qty--" />
                      <div class="text-weight-bold text-center q-mx-xs" style="width: 28px; font-size: 15px; color: #0f172a;">{{ item.qty }}</div>
                      <q-btn round dense unelevated icon="add" color="primary" size="sm" @click="item.qty++" />
                    </div>
                  </q-item-section>
                </q-item>
                
                <q-item v-if="filteredStock.length === 0">
                  <q-item-section class="text-center text-grey-6 q-py-xl">
                    <q-icon name="search_off" size="48px" class="q-mb-sm mx-auto" />
                    <div class="text-weight-bold">Produk tidak ditemukan</div>
                  </q-item-section>
                </q-item>
              </q-list>

              <div class="q-pa-md bg-grey-1" style="border-top: 1px solid #e2e8f0;">
                <q-btn color="primary" class="full-width text-weight-bold shadow-3" rounded icon="save" label="Simpan Stok" @click="saveStock" />
              </div>
            </q-card>
          </div>

          <!-- Tab 3: SALES ORDER -->
          <div v-show="activeTab === 'order'">
            <div class="flex items-center q-mb-md">
              <div class="bg-blue-1 flex flex-center q-mr-md" style="width: 48px; height: 48px; border-radius: 12px;">
                <q-icon name="shopping_bag" size="28px" color="primary" />
              </div>
              <div>
                <h5 class="vah-panel-title">Sales Order</h5>
                <div class="vah-panel-subtitle">Katalog digital & keranjang pesanan</div>
              </div>
              <q-space />
              <q-btn flat round icon="close" color="grey-6" class="gt-sm" @click="activeTab = 'menu'" />
            </div>

            <q-card flat bordered class="rounded-borders bg-white column" style="height: calc(100vh - 200px); min-height: 500px;">
              <div class="q-pa-md" style="border-bottom: 1px solid #e2e8f0;">
                <q-input v-model="orderSearch" dense outlined rounded placeholder="Cari nama obat/alkes..." class="bg-grey-1">
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>

              <!-- Promo Accordion Inside Sales Order -->
              <div class="q-px-md q-pt-md">
                <q-expansion-item
                  class="shadow-1 overflow-hidden border-primary"
                  style="border-radius: 10px; border: 1px solid #bfdbfe;"
                  icon="local_activity"
                  label="3 Promo Spesial Tersedia"
                  caption="Ketuk untuk melihat detail"
                  header-class="bg-blue-50 text-primary text-weight-bold"
                  expand-icon-class="text-primary"
                >
                  <q-card class="bg-white">
                    <q-list separator>
                      <q-item v-for="(promo, index) in activePromos" :key="index" class="q-py-md">
                        <q-item-section avatar>
                          <div class="flex flex-center rounded-borders" :style="{ background: promo.bg, width: '40px', height: '40px' }">
                            <q-icon :name="promo.icon" color="white" size="20px" />
                          </div>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label class="text-weight-bold text-dark" style="font-size: 13px;">{{ promo.title }}</q-item-label>
                          <q-item-label caption class="text-grey-7">{{ promo.subtitle }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card>
                </q-expansion-item>
              </div>

              <q-scroll-area class="col q-mt-sm">
                <q-list separator>
                  <q-item v-for="item in filteredOrder" :key="item.id" class="q-py-md">
                    <q-item-section avatar>
                      <div class="bg-grey-3 flex flex-center" style="width: 60px; height: 60px; border-radius: 8px;">
                        <q-icon name="image" color="grey-5" size="28px" />
                      </div>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-weight-bold text-dark" style="font-size: 13px; line-height: 1.2; margin-bottom: 4px;">{{ item.name }}</q-item-label>
                      <q-item-label caption class="text-primary text-weight-bold" style="font-size: 10px; text-transform: uppercase;">{{ item.category }}</q-item-label>
                      <q-item-label class="text-weight-bolder text-orange q-mt-xs">{{ formatCurrency(item.price) }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <div class="flex items-center no-wrap bg-grey-1 rounded-borders q-pa-xs" style="border: 1px solid #e2e8f0;">
                        <q-btn round dense unelevated icon="remove" color="white" text-color="dark" size="sm" @click="item.qty > 0 && item.qty--" />
                        <div class="text-weight-bold text-center q-mx-xs" style="width: 28px; font-size: 15px; color: #0f172a;">{{ item.qty }}</div>
                        <q-btn round dense unelevated icon="add" color="primary" size="sm" @click="item.qty++" />
                      </div>
                    </q-item-section>
                  </q-item>
                  
                  <q-item v-if="filteredOrder.length === 0">
                    <q-item-section class="text-center text-grey-6 q-py-xl">
                      <q-icon name="search_off" size="48px" class="q-mb-sm mx-auto" />
                      <div class="text-weight-bold">Produk tidak ditemukan</div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-scroll-area>

              <div class="q-pa-md bg-grey-1 flex items-center justify-between" style="border-top: 1px solid #e2e8f0;">
                <div>
                  <div class="text-caption text-grey-7 text-weight-bold">Total Pesanan</div>
                  <div class="text-h6 text-weight-bolder text-dark">{{ formatCurrency(totalOrderValue) }}</div>
                </div>
                <q-btn color="primary" class="text-weight-bold shadow-3" rounded icon="shopping_cart_checkout" label="Proses" @click="submitOrder" />
              </div>
            </q-card>
          </div>

          <!-- Tab 4: MERCHANDISING -->
          <div v-show="activeTab === 'merchandising'">
            <div class="flex items-center q-mb-md">
              <div class="bg-blue-1 flex flex-center q-mr-md" style="width: 48px; height: 48px; border-radius: 12px;">
                <q-icon name="photo_camera" size="28px" color="primary" />
              </div>
              <div>
                <h5 class="vah-panel-title">Merchandising</h5>
                <div class="vah-panel-subtitle">Dokumentasi planogram & POSM</div>
              </div>
              <q-space />
              <q-btn flat round icon="close" color="grey-6" class="gt-sm" @click="activeTab = 'menu'" />
            </div>

            <q-card flat bordered class="rounded-borders bg-white">
              <div class="q-pa-md" style="border-bottom: 1px solid #e2e8f0;">
                <div class="text-caption text-grey-8">Ambil foto untuk setiap kategori berikut sebagai bukti kunjungan dan visibilitas produk.</div>
              </div>

              <q-list separator>
                <q-item v-for="task in merchTasks" :key="task.id" class="q-pa-md column">
                  <div class="row items-center justify-between q-mb-sm">
                    <div>
                      <div class="text-weight-bold text-dark" style="font-size: 14px;">{{ task.title }}</div>
                      <div class="text-caption text-grey-6" style="line-height: 1.2;">{{ task.description }}</div>
                    </div>
                    <q-icon v-if="task.photo" name="check_circle" color="positive" size="24px" />
                  </div>
                  
                  <div v-if="!task.photo" 
                       class="bg-grey-2 rounded-borders flex flex-center cursor-pointer q-mt-sm" 
                       style="height: 120px; border: 2px dashed #cbd5e1;"
                       v-ripple
                       @click="takePhoto(task)"
                  >
                    <div class="text-center text-grey-6">
                      <q-icon name="add_a_photo" size="32px" class="q-mb-xs" />
                      <div class="text-caption text-weight-bold">Ketuk untuk Kamera</div>
                    </div>
                  </div>

                  <div v-else class="q-mt-sm relative-position">
                    <div class="bg-blue-1 rounded-borders flex flex-center" style="height: 120px; border: 1px solid #bfdbfe;">
                      <q-icon name="image" color="primary" size="48px" style="opacity: 0.5;" />
                      <div class="absolute-bottom text-center text-primary text-caption text-weight-bold q-pb-sm">IMG_MERCH_{{ task.id }}.jpg</div>
                    </div>
                    <q-btn round dense color="negative" icon="delete" size="sm" class="absolute-top-right q-ma-sm shadow-2" @click="removePhoto(task)" />
                  </div>
                </q-item>
              </q-list>

              <div class="q-pa-md bg-grey-1" style="border-top: 1px solid #e2e8f0;">
                <q-btn color="primary" class="full-width text-weight-bold shadow-3" rounded icon="cloud_upload" label="Upload & Simpan" @click="submitMerch" />
              </div>
            </q-card>
          </div>

          <!-- Tab 5: COLLECTION (AR) -->
          <div v-show="activeTab === 'collection'">
            <div class="flex items-center q-mb-md">
              <div class="bg-blue-1 flex flex-center q-mr-md" style="width: 48px; height: 48px; border-radius: 12px;">
                <q-icon name="account_balance_wallet" size="28px" color="primary" />
              </div>
              <div>
                <h5 class="vah-panel-title">Collection (AR)</h5>
                <div class="vah-panel-subtitle">Penagihan faktur jatuh tempo</div>
              </div>
              <q-space />
              <q-btn flat round icon="close" color="grey-6" class="gt-sm" @click="activeTab = 'menu'" />
            </div>

            <q-card flat bordered class="rounded-borders bg-white">
              <div class="q-pa-md bg-orange-1 text-orange-9 flex items-center" style="border-bottom: 1px solid #e2e8f0;">
                <q-icon name="warning" size="24px" class="q-mr-sm" />
                <div class="text-caption text-weight-bold">Terdapat tagihan yang telah melewati jatuh tempo.</div>
              </div>

              <q-list separator>
                <q-item v-for="inv in invoices" :key="inv.id" class="q-pa-md column">
                  <div class="row justify-between q-mb-sm">
                    <div>
                      <div class="text-weight-bold text-dark" style="font-size: 14px;">{{ inv.id }}</div>
                      <div class="text-caption text-grey-7 text-weight-medium">Jatuh tempo: {{ inv.dueDate }}</div>
                    </div>
                    <div class="text-right">
                      <div class="text-weight-bolder text-negative" style="font-size: 14px;">{{ formatCurrency(inv.total) }}</div>
                      <q-badge :color="inv.status === 'Overdue' ? 'negative' : 'warning'" class="q-mt-xs">{{ inv.status }}</q-badge>
                    </div>
                  </div>
                  <div class="q-mt-sm">
                    <q-input 
                      v-model.number="inv.paidAmount" 
                      type="number" 
                      outlined 
                      dense 
                      placeholder="Input nominal bayar..."
                      prefix="Rp"
                      class="bg-grey-1"
                    />
                  </div>
                </q-item>
              </q-list>

              <div class="q-pa-md" style="border-top: 1px solid #e2e8f0;">
                <div class="text-caption text-weight-bold text-grey-8 q-mb-sm">Metode Pembayaran</div>
                <q-select v-model="paymentMethod" :options="paymentOptions" outlined dense class="bg-white q-mb-md" />
                
                <div class="flex justify-between items-center q-mb-md">
                  <div class="text-caption text-weight-bold text-grey-7">Total Diterima</div>
                  <div class="text-h6 text-weight-bolder text-primary">{{ formatCurrency(totalCollection) }}</div>
                </div>
                <q-btn color="primary" class="full-width text-weight-bold shadow-3" rounded icon="receipt_long" label="Proses Pembayaran" @click="submitCollection" />
              </div>
            </q-card>
          </div>

          <!-- Tab 6: RETURN BARANG -->
          <div v-show="activeTab === 'return'">
            <div class="flex items-center q-mb-md">
              <div class="bg-blue-1 flex flex-center q-mr-md" style="width: 48px; height: 48px; border-radius: 12px;">
                <q-icon name="assignment_return" size="28px" color="primary" />
              </div>
              <div>
                <h5 class="vah-panel-title">Retur Barang</h5>
                <div class="vah-panel-subtitle">Penarikan produk rusak / expired</div>
              </div>
              <q-space />
              <q-btn flat round icon="close" color="grey-6" class="gt-sm" @click="activeTab = 'menu'" />
            </div>

            <q-card flat bordered class="rounded-borders bg-white">
              <!-- Return Form -->
              <div class="q-pa-md bg-blue-grey-1" style="border-bottom: 1px solid #e2e8f0;">
                <div class="text-caption text-weight-bold text-dark q-mb-sm">Pilih Produk Retur</div>
                <q-select v-model="returnForm.product" :options="productOptions" outlined dense bg-color="white" placeholder="Pilih produk..." class="q-mb-md" />
                
                <div class="row q-col-gutter-md q-mb-md">
                  <div class="col-4">
                    <div class="text-caption text-weight-bold text-dark q-mb-sm">Jumlah</div>
                    <q-input v-model.number="returnForm.qty" type="number" outlined dense bg-color="white" placeholder="0" />
                  </div>
                  <div class="col-8">
                    <div class="text-caption text-weight-bold text-dark q-mb-sm">Alasan Retur</div>
                    <q-select v-model="returnForm.reason" :options="returnReasons" outlined dense bg-color="white" placeholder="Pilih alasan..." />
                  </div>
                </div>
                <q-btn color="secondary" class="full-width text-weight-bold shadow-2" rounded icon="add" label="Tambahkan ke Daftar" @click="addReturnItem" />
              </div>

              <!-- List of Returned Items -->
              <div class="q-pa-md" v-if="returnedItems.length > 0">
                <div class="text-caption text-weight-bold text-grey-8 q-mb-sm">Daftar Produk Diretur ({{ returnedItems.length }})</div>
                <q-list separator bordered class="rounded-borders">
                  <q-item v-for="(item, idx) in returnedItems" :key="item.id" class="q-py-md">
                    <q-item-section>
                      <q-item-label class="text-weight-bold text-dark" style="font-size: 13px;">{{ item.product }}</q-item-label>
                      <q-item-label caption class="text-negative text-weight-bold q-mt-xs">
                        <q-icon name="warning" size="14px" class="q-mr-xs" />{{ item.reason }}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <div class="flex items-center">
                        <div class="text-weight-bolder text-dark q-mr-md" style="font-size: 16px;">{{ item.qty }}x</div>
                        <q-btn round dense flat icon="delete" color="negative" @click="removeReturnItem(idx)" />
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
              <div class="q-pa-xl text-center text-grey-5" v-else>
                <q-icon name="inventory" size="48px" class="q-mb-sm" />
                <div>Belum ada produk yang diretur.</div>
              </div>

              <!-- Submit -->
              <div class="q-pa-md" style="border-top: 1px solid #e2e8f0;">
                <q-btn color="primary" class="full-width text-weight-bold shadow-3" rounded icon="assignment_return" label="Proses Retur" @click="submitReturn" />
              </div>
            </q-card>
          </div>

          <!-- Tab 7: LAPORAN KOMPETITOR -->
          <div v-show="activeTab === 'competitor'">
            <div class="flex items-center q-mb-md">
              <div class="bg-blue-1 flex flex-center q-mr-md" style="width: 48px; height: 48px; border-radius: 12px;">
                <q-icon name="radar" size="28px" color="primary" />
              </div>
              <div>
                <h5 class="vah-panel-title">Laporan Kompetitor</h5>
                <div class="vah-panel-subtitle">Intelijen pasar & pantauan pesaing</div>
              </div>
              <q-space />
              <q-btn flat round icon="close" color="grey-6" class="gt-sm" @click="activeTab = 'menu'" />
            </div>

            <q-card flat bordered class="rounded-borders bg-white">
              <div class="q-pa-md">
                <div class="text-caption text-weight-bold text-dark q-mb-xs">Nama Merek / Perusahaan Pesaing</div>
                <q-input v-model="competitorForm.brand" outlined dense placeholder="Contoh: Kalbe / Dexa / Kimia Farma" class="bg-grey-1 q-mb-md" />

                <div class="text-caption text-weight-bold text-dark q-mb-xs">Kategori Aktivitas</div>
                <q-select v-model="competitorForm.category" :options="competitorCategories" outlined dense class="bg-grey-1 q-mb-md" />

                <div class="text-caption text-weight-bold text-dark q-mb-xs">Deskripsi Temuan Lapangan</div>
                <q-input v-model="competitorForm.description" type="textarea" outlined rows="3" placeholder="Jelaskan detail promo, potongan harga, atau peluncuran produk baru pesaing..." class="bg-grey-1 q-mb-md" />

                <div class="text-caption text-weight-bold text-dark q-mb-xs">Foto Bukti (Opsional)</div>
                <div v-if="!competitorForm.photo" 
                     class="bg-grey-2 rounded-borders flex flex-center cursor-pointer q-mb-md" 
                     style="height: 100px; border: 2px dashed #cbd5e1;"
                     v-ripple
                     @click="takeCompetitorPhoto"
                >
                  <div class="text-center text-grey-6">
                    <q-icon name="add_a_photo" size="28px" class="q-mb-xs" />
                    <div class="text-caption text-weight-bold">Ketuk untuk Foto Brosur / Banner Pesaing</div>
                  </div>
                </div>
                <div v-else class="q-mb-md relative-position">
                  <div class="bg-blue-1 rounded-borders flex flex-center" style="height: 100px; border: 1px solid #bfdbfe;">
                    <q-icon name="image" color="primary" size="40px" style="opacity: 0.5;" />
                    <div class="absolute-bottom text-center text-primary text-caption text-weight-bold q-pb-xs">KOMPETITOR_PROOF.jpg</div>
                  </div>
                  <q-btn round dense color="negative" icon="delete" size="sm" class="absolute-top-right q-ma-xs shadow-2" @click="removeCompetitorPhoto" />
                </div>
              </div>

              <div class="q-pa-md bg-grey-1" style="border-top: 1px solid #e2e8f0;">
                <q-btn color="primary" class="full-width text-weight-bold shadow-3" rounded icon="send" label="Kirim Laporan Pesaing" @click="submitCompetitorReport" />
              </div>
            </q-card>
          </div>

          <!-- Tab: SURVEY -->
          <div v-show="activeTab === 'survey'">
            <div class="flex items-center q-mb-md">
              <div class="bg-blue-1 flex flex-center q-mr-md" style="width: 48px; height: 48px; border-radius: 12px;">
                <q-icon name="assignment" size="28px" color="primary" />
              </div>
              <div>
                <h5 class="vah-panel-title">Survey Outlet</h5>
                <div class="vah-panel-subtitle">Kondisi & survei kepuasan pelanggan</div>
              </div>
              <q-space />
              <q-btn flat round icon="close" color="grey-6" class="gt-sm" @click="activeTab = 'menu'" />
            </div>

            <q-card flat bordered class="rounded-borders bg-white">
              <div class="q-pa-md">
                <!-- Rating -->
                <div class="text-caption text-weight-bold text-dark q-mb-xs">1. Tingkat Kepuasan Layanan Pengiriman</div>
                <div class="q-mb-md flex items-center bg-grey-1 q-pa-sm rounded-borders">
                  <q-rating v-model="surveyForm.rating" size="2em" color="amber" icon="star_border" icon-selected="star" />
                  <div class="q-ml-sm text-caption text-weight-bold text-grey-8">({{ surveyForm.rating }} dari 5 Bintang)</div>
                </div>

                <!-- Stock Availability -->
                <div class="text-caption text-weight-bold text-dark q-mb-xs">2. Ketersediaan Stok Bulan Ini</div>
                <q-select v-model="surveyForm.stockAvailability" :options="stockAvailabilityOptions" outlined dense class="bg-grey-1 q-mb-md" />

                <!-- Promos Installed -->
                <div class="text-caption text-weight-bold text-dark q-mb-xs">3. POSM / Materi Promosi Terpasang</div>
                <div class="bg-grey-1 q-pa-sm rounded-borders q-mb-md column q-gutter-y-xs">
                  <q-checkbox v-for="opt in promoCheckboxes" :key="opt" v-model="surveyForm.promosInstalled" :val="opt" :label="opt" class="text-caption" dense />
                </div>

                <!-- Feedback -->
                <div class="text-caption text-weight-bold text-dark q-mb-xs">4. Masukan / Saran dari Apoteker / Dokter</div>
                <q-input v-model="surveyForm.feedback" type="textarea" outlined rows="3" placeholder="Tuliskan keluhan atau saran pelayanan..." class="bg-grey-1 q-mb-md" />
              </div>

              <div class="q-pa-md bg-grey-1" style="border-top: 1px solid #e2e8f0;">
                <q-btn color="primary" class="full-width text-weight-bold shadow-3" rounded icon="save" label="Simpan Hasil Survey" @click="submitSurvey" />
              </div>
            </q-card>
          </div>

          <!-- Tab 8: CHECK-OUT -->
          <div v-show="activeTab === 'checkout'">
            <div class="flex items-center q-mb-md">
              <div class="bg-red-1 flex flex-center q-mr-md" style="width: 48px; height: 48px; border-radius: 12px;">
                <q-icon name="exit_to_app" size="28px" color="negative" />
              </div>
              <div>
                <h5 class="vah-panel-title">Check-Out Kunjungan</h5>
                <div class="vah-panel-subtitle">Rangkuman akhir & waktu penyelesaian</div>
              </div>
              <q-space />
              <q-btn flat round icon="close" color="grey-6" class="gt-sm" @click="activeTab = 'menu'" />
            </div>

            <q-card flat bordered class="rounded-borders bg-white">
              <div class="q-pa-md">
                <!-- Activity Summary List -->
                <div class="text-caption text-weight-bold text-dark q-mb-xs">Rangkuman Aktivitas Kunjungan</div>
                <q-list bordered separator class="rounded-borders bg-grey-1 q-mb-md">
                  <q-item v-for="m in menus.filter(item => item.id !== 'checkout')" :key="m.id" dense class="q-py-sm">
                    <q-item-section avatar style="min-width: 32px;">
                      <q-icon :name="m.done ? 'check_circle' : 'radio_button_unchecked'" :color="m.done ? 'positive' : 'grey-5'" size="20px" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-weight-bold" style="font-size: 12px;">{{ m.title }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-badge :color="m.done ? 'positive' : 'grey-5'" style="font-size: 10px;">{{ m.done ? 'Selesai' : 'Tidak Diisi' }}</q-badge>
                    </q-item-section>
                  </q-item>
                </q-list>

                <!-- Reason No Order (If Sales Order not done) -->
                <div v-if="!menus.find(m => m.id === 'order')?.done" class="q-mb-md bg-orange-1 q-pa-sm rounded-borders" style="border: 1px solid #fed7aa;">
                  <div class="text-caption text-weight-bold text-orange-9 q-mb-xs">
                    <q-icon name="info" class="q-mr-xs" /> Alasan Tidak Ada Order (Reason No Order)
                  </div>
                  <q-select v-model="checkoutForm.reasonNoOrder" :options="reasonNoOrderOptions" outlined dense bg-color="white" placeholder="Pilih alasan..." />
                </div>

                <!-- Final Notes -->
                <div class="text-caption text-weight-bold text-dark q-mb-xs">Catatan Akhir Kunjungan</div>
                <q-input v-model="checkoutForm.finalNotes" type="textarea" outlined rows="3" placeholder="Tuliskan kesimpulan hasil kunjungan hari ini..." class="bg-grey-1 q-mb-md" />
              </div>

              <div class="q-pa-md bg-grey-1" style="border-top: 1px solid #e2e8f0;">
                <q-btn color="negative" class="full-width text-weight-bold shadow-3" rounded icon="logout" label="Akhiri Kunjungan (Check Out)" :loading="checkingOut" @click="handleCheckOut" />
              </div>
            </q-card>
          </div>

          <!-- MOCK PANELS FOR OTHER TABS -->
          <div v-show="activeTab !== 'info' && activeTab !== 'checkout' && activeTab !== 'menu' && activeTab !== 'stock' && activeTab !== 'order' && activeTab !== 'merchandising' && activeTab !== 'collection' && activeTab !== 'return' && activeTab !== 'competitor' && activeTab !== 'survey'">
            <q-card flat class="rounded-borders shadow-1 q-pa-xl text-center bg-white q-mt-md">
              <q-icon name="construction" size="64px" color="grey-4" />
              <div class="text-h6 text-grey-7 q-mt-md">Modul Sedang Dikembangkan</div>
              <div class="text-caption text-grey-6">Fitur ini akan ditambahkan di fase berikutnya.</div>
            </q-card>
          </div>



        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()

// Default to 'menu' on mobile, 'info' on desktop
const activeTab = ref($q.screen.lt.md ? 'menu' : 'info')
const loading = ref(true)
const checkingOut = ref(false)
const visit = ref(null)

const progressPercentage = ref(11)

// --- Stock Checking (Mock Data) ---
const stockSearch = ref('')
const stockItems = ref([
  { id: 1, name: 'Paracetamol 500mg (Strip)', category: 'Obat Bebas', qty: 0 },
  { id: 2, name: 'Amoxicillin 500mg (Box)', category: 'Obat Resep', qty: 5 },
  { id: 3, name: 'Vitamin C 1000mg (Botol)', category: 'Vitamin & Suplemen', qty: 0 },
  { id: 4, name: 'Betadine Antiseptic 60ml', category: 'P3K', qty: 2 },
  { id: 5, name: 'Masker Medis 3-Ply (Box)', category: 'Alat Kesehatan', qty: 0 },
  { id: 6, name: 'Cairan Infus NaCl 0.9% 500ml', category: 'Cairan Medis', qty: 10 }
])
const filteredStock = computed(() => {
  if (!stockSearch.value) return stockItems.value
  return stockItems.value.filter(i => i.name.toLowerCase().includes(stockSearch.value.toLowerCase()))
})
const saveStock = () => {
  $q.notify({ type: 'positive', message: 'Data stok berhasil disimpan!' })
  const stockMenu = menus.value.find(m => m.id === 'stock')
  if (stockMenu) stockMenu.done = true
  progressPercentage.value = 22 // 2/9 activities
  activeTab.value = 'menu'
}

// --- Sales Order (Mock Data) ---
const activePromos = ref([
  { title: 'Diskon 10% Alkes', subtitle: 'Khusus Tier A & B', bg: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)', icon: 'local_offer' },
  { title: 'Beli 10 Gratis 1', subtitle: 'Semua Paracetamol', bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', icon: 'redeem' },
  { title: 'Cashback Rp50rb', subtitle: 'Min. order 2 Juta', bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', icon: 'payments' }
])

const orderSearch = ref('')
const orderItems = ref([
  { id: 1, name: 'Paracetamol 500mg (Strip)', category: 'Obat Bebas', price: 12000, qty: 0 },
  { id: 2, name: 'Amoxicillin 500mg (Box)', category: 'Obat Resep', price: 85000, qty: 0 },
  { id: 3, name: 'Vitamin C 1000mg (Botol)', category: 'Vitamin & Suplemen', price: 45000, qty: 0 },
  { id: 4, name: 'Betadine Antiseptic 60ml', category: 'P3K', price: 32000, qty: 0 },
  { id: 5, name: 'Masker Medis 3-Ply (Box)', category: 'Alat Kesehatan', price: 25000, qty: 0 },
  { id: 6, name: 'Cairan Infus NaCl 0.9% 500ml', category: 'Cairan Medis', price: 18000, qty: 0 }
])

const filteredOrder = computed(() => {
  if (!orderSearch.value) return orderItems.value
  return orderItems.value.filter(i => i.name.toLowerCase().includes(orderSearch.value.toLowerCase()))
})

const totalOrderValue = computed(() => {
  return orderItems.value.reduce((total, item) => total + (item.price * item.qty), 0)
})

const formatCurrency = (val) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)
}

const submitOrder = () => {
  if (totalOrderValue.value === 0) {
    $q.notify({ type: 'warning', message: 'Keranjang belanja masih kosong!' })
    return
  }
  $q.notify({ type: 'positive', message: `Pesanan senilai ${formatCurrency(totalOrderValue.value)} berhasil dibuat!` })
  const orderMenu = menus.value.find(m => m.id === 'order')
  if (orderMenu) orderMenu.done = true
  progressPercentage.value = 33 // 3/9 activities
  activeTab.value = 'menu'
}

// --- Merchandising (Mock Data) ---
const merchTasks = ref([
  { id: 1, title: 'Foto Etalase Depan', description: 'Pastikan nama apotek/RS terlihat jelas', photo: null },
  { id: 2, title: 'Foto Rak Obat Bebas', description: 'Fokus pada penyusunan planogram paracetamol/vitamin', photo: null },
  { id: 3, title: 'Foto POSM / Poster', description: 'Bukti pemasangan poster promo alkes', photo: null }
])

const takePhoto = (task) => {
  // Simulate taking a photo by setting a mock string
  task.photo = 'uploaded'
  $q.notify({ type: 'positive', message: `Foto untuk '${task.title}' berhasil diambil.` })
}

const removePhoto = (task) => {
  task.photo = null
}

const submitMerch = () => {
  const allDone = merchTasks.value.every(t => t.photo !== null)
  if (!allDone) {
    $q.notify({ type: 'warning', message: 'Harap lengkapi seluruh tugas foto (Merchandising) sebelum menyimpan!' })
    return
  }
  $q.notify({ type: 'positive', message: 'Data dokumentasi Merchandising berhasil diunggah!' })
  const merchMenu = menus.value.find(m => m.id === 'merchandising')
  if (merchMenu) merchMenu.done = true
  progressPercentage.value = 44 // 4/9 activities
  activeTab.value = 'menu'
}

// --- Collection (Mock Data) ---
const invoices = ref([
  { id: 'INV-2607-001', date: '01 Jul 2026', dueDate: '15 Jul 2026', total: 2500000, paidAmount: null, status: 'Overdue' },
  { id: 'INV-2607-045', date: '10 Jul 2026', dueDate: '24 Jul 2026', total: 1250000, paidAmount: null, status: 'Pending' }
])
const paymentMethod = ref('Tunai')
const paymentOptions = ['Tunai', 'Transfer Bank', 'Giro/Cek']

const totalCollection = computed(() => {
  return invoices.value.reduce((total, inv) => total + Number(inv.paidAmount || 0), 0)
})

const submitCollection = () => {
  if (totalCollection.value === 0) {
    $q.notify({ type: 'warning', message: 'Belum ada nominal pembayaran yang diinput!' })
    return
  }
  $q.notify({ type: 'positive', message: `Pembayaran ${paymentMethod.value} senilai ${formatCurrency(totalCollection.value)} berhasil diproses!` })
  const colMenu = menus.value.find(m => m.id === 'collection')
  if (colMenu) colMenu.done = true
  progressPercentage.value = 55 // 5/9 activities
  activeTab.value = 'menu'
}

// --- Retur Barang (Mock Data) ---
const returnForm = ref({
  product: null,
  qty: null,
  reason: null
})
const returnReasons = ['Kedaluwarsa (Expired)', 'Kemasan Rusak', 'Cacat Produksi (Bad Stock)', 'Lainnya']
const returnedItems = ref([])

const productOptions = computed(() => stockItems.value.map(i => i.name))

const addReturnItem = () => {
  if (!returnForm.value.product || !returnForm.value.qty || !returnForm.value.reason) {
    $q.notify({ type: 'warning', message: 'Harap lengkapi produk, jumlah, dan alasan retur!' })
    return
  }
  returnedItems.value.push({ ...returnForm.value, id: Date.now() })
  returnForm.value.product = null
  returnForm.value.qty = null
  returnForm.value.reason = null
}

const removeReturnItem = (index) => {
  returnedItems.value.splice(index, 1)
}

const submitReturn = () => {
  if (returnedItems.value.length === 0) {
    $q.notify({ type: 'warning', message: 'Daftar retur masih kosong!' })
    return
  }
  $q.notify({ type: 'positive', message: `${returnedItems.value.length} produk berhasil dicatat sebagai Retur!` })
  const retMenu = menus.value.find(m => m.id === 'return')
  if (retMenu) retMenu.done = true
  progressPercentage.value = 66 // 6/9 activities
  activeTab.value = 'menu'
}

// --- Laporan Kompetitor (Mock Data) ---
const competitorForm = ref({
  brand: '',
  category: 'Promo Diskon / Harga',
  description: '',
  photo: null
})

const competitorCategories = [
  'Promo Diskon / Harga',
  'Peluncuran Produk Baru',
  'Display & Merchandising Pesaing',
  'Program Hadiah / Bonus',
  'Lainnya'
]

const takeCompetitorPhoto = () => {
  competitorForm.value.photo = 'uploaded'
  $q.notify({ type: 'positive', message: 'Foto bukti aktivitas kompetitor berhasil diambil.' })
}

const removeCompetitorPhoto = () => {
  competitorForm.value.photo = null
}

const submitCompetitorReport = () => {
  if (!competitorForm.value.brand || !competitorForm.value.description) {
    $q.notify({ type: 'warning', message: 'Harap isi nama merek kompetitor dan deskripsi aktivitas!' })
    return
  }
  $q.notify({ type: 'positive', message: 'Laporan Intelijen Pasar / Kompetitor berhasil disimpan!' })
  const compMenu = menus.value.find(m => m.id === 'competitor')
  if (compMenu) compMenu.done = true
  progressPercentage.value = 77 // 7/9 activities
  activeTab.value = 'menu'
}

// --- Survey Outlet (Mock Data) ---
const surveyForm = ref({
  rating: 4,
  stockAvailability: 'Cukup',
  promosInstalled: ['Poster Promo Medis', 'Brosur Katalog Obat'],
  feedback: ''
})

const stockAvailabilityOptions = ['Sangat Cukup', 'Cukup', 'Sering Kosong / Out of Stock']
const promoCheckboxes = ['Poster Promo Medis', 'Standing Banner', 'Brosur Katalog Obat', 'Stiker Etalase']

const submitSurvey = () => {
  $q.notify({ type: 'positive', message: 'Hasil survei kepuasan & kondisi outlet berhasil disimpan!' })
  const surveyMenu = menus.value.find(m => m.id === 'survey')
  if (surveyMenu) surveyMenu.done = true
  progressPercentage.value = 88 // 8/9 activities
  activeTab.value = 'menu'
}

// --- Check Out (Mock Data) ---
const checkoutForm = ref({
  reasonNoOrder: null,
  finalNotes: ''
})

const reasonNoOrderOptions = [
  'Stok Masih Cukup Banyak',
  'Apoteker / Owner Tidak Ada di Tempat',
  'Harga Kurang Bersaing',
  'Kredit Toko Melebihi Limit',
  'Lainnya'
]

const handleCheckOut = () => {
  const orderMenu = menus.value.find(m => m.id === 'order')
  if (!orderMenu?.done && !checkoutForm.value.reasonNoOrder) {
    $q.notify({ type: 'warning', message: 'Harap pilih alasan jika tidak ada pemesanan barang (Reason No Order)!' })
    return
  }

  checkingOut.value = true
  setTimeout(() => {
    checkingOut.value = false
    $q.notify({ type: 'positive', message: 'Check-Out Berhasil! Kunjungan disahkan sebagai Selesai.' })
    router.push('/journey-plan')
  }, 1000)
}

const menus = ref([
  { id: 'info', title: 'Informasi Outlet', subtitle: 'Profil & data', icon: 'storefront', iconColor: 'blue-grey-7', done: true },
  { id: 'stock', title: 'Stock Checking', subtitle: 'Cek stok rak', icon: 'dataset', iconColor: 'blue-grey-7', done: false },
  { id: 'merchandising', title: 'Merchandising', subtitle: 'Foto display', icon: 'photo_camera', iconColor: 'blue-grey-7', done: false },
  { id: 'survey', title: 'Survey', subtitle: 'Kondisi outlet', icon: 'assignment', iconColor: 'blue-grey-7', done: false },
  { id: 'order', title: 'Sales Order', subtitle: 'Buat pesanan', icon: 'shopping_bag', iconColor: 'blue-grey-7', done: false },
  { id: 'collection', title: 'Collection', subtitle: 'Tagihan piutang', icon: 'account_balance_wallet', iconColor: 'blue-grey-7', done: false },
  { id: 'return', title: 'Return Barang', subtitle: 'Tarik barang rusak', icon: 'assignment_return', iconColor: 'blue-grey-7', done: false },
  { id: 'competitor', title: 'Kompetitor', subtitle: 'Aktivitas pesaing', icon: 'radar', iconColor: 'blue-grey-7', done: false },
  { id: 'checkout', title: 'Check Out', subtitle: 'Akhiri kunjungan', icon: 'exit_to_app', iconColor: 'negative', done: false }
])


const loadVisit = () => {
  loading.value = true
  
  // MOCK DATA (No API call)
  setTimeout(() => {
    visit.value = {
      VISIT_ID: route.params.visit_id || 1,
      outlet: {
        NAMA_OUTLET: 'Apotek Sehat Jaya',
        ALAMAT: 'Jl. Sudirman No. 45, Jakarta Pusat',
        CONTACT_PERSON: 'Bapak Budi (Apoteker)',
        PHONE: '081234567890',
        TERRITORY: 'Jakarta Pusat'
      }
    }
    loading.value = false
  }, 500)
}


const confirmExit = () => {
  $q.dialog({
    title: 'Keluar Kunjungan?',
    message: 'Kunjungan ini belum di check-out. Data yang belum tersimpan mungkin hilang.',
    cancel: true,
    ok: 'Ya, Keluar'
  }).onOk(() => {
    router.go(-1)
  })
}

onMounted(() => {
  loadVisit()
})
</script>

<style lang="scss" scoped>
.rounded-borders {
  border-radius: 12px;
}

/* VAH WRAPPER */
.vah-wrapper {
  display: flex;
  background: #f1f5f9;
  flex-direction: column;
}

@media (min-width: 1024px) {
  .vah-wrapper {
    min-height: calc(100vh - 85px);
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    margin: 16px;
    flex-direction: row;
    overflow: hidden;
  }
}

.vah-sidebar {
  width: 270px;
  flex-shrink: 0;
  background: #1e293b;
  display: flex;
  flex-direction: column;
}

.vah-sidebar-header {
  padding: 20px 20px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.vah-outlet-name {
  font-size: 15px;
  font-weight: 800;
  color: #f1f5f9;
  line-height: 1.3;
  margin-bottom: 4px;
}

.vah-outlet-meta {
  font-size: 11px;
  color: #94a3b8;
}

.vah-progress-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  margin: 12px 0 0;
  overflow: hidden;
}

.vah-progress-fill {
  height: 100%;
  background: #3b82f6;
  border-radius: 2px;
  transition: width 0.3s;
}

.vah-content {
  flex: 1;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.vah-panel-title {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.vah-panel-subtitle {
  font-size: 13px;
  color: #64748b;
  margin: 2px 0 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 14px;
  margin-bottom: 20px;
}

.info-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e2e8f0;
}

.info-card-label {
  font-size: 10px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-card-value {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  margin-top: 4px;
}

.info-card-sub {
  font-size: 11px;
  color: #64748b;
}
</style>
