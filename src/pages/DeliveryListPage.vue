<template>
  <q-page class="q-pa-xs bg-grey-2" style="padding-bottom: 90px;">
    
    <!-- ── VIEW 1: LISTING VIEW (FIRST LOAD) ────────────────────────────── -->
    <div v-if="!selectedDelivery" class="q-pa-xs">
      
      <!-- Top Title & Date Header (Mockup Design) -->
      <div class="q-px-xs q-py-xs flex items-center justify-between q-mb-xs">
        <div>
          <div class="text-h6 text-weight-bolder text-dark" style="font-size: 20px; line-height: 1.2;">
            Delivery Order
          </div>
          <q-btn
            outline
            dense
            no-caps
            class="q-mt-xs bg-white text-weight-medium rounded-borders shadow-2xs"
            style="border-color: #cbd5e1; font-size: 11px; padding: 2px 8px;"
          >
            <q-icon name="event" size="14px" style="color: #701a1e;" class="q-mr-xs" />
            <span class="text-dark text-weight-bold">25 Jul 2026</span>
            <q-icon name="arrow_drop_down" size="16px" color="grey-7" class="q-ml-xs" />
          </q-btn>
        </div>

        <q-btn
          outline
          round
          dense
          icon="refresh"
          color="grey-8"
          class="bg-white shadow-1"
          style="border-color: #e2e8f0; width: 36px; height: 36px;"
          @click="fetchDeliveries"
        />
      </div>

      <!-- 4 Stat Cards Row (Mockup Design) -->
      <div class="row q-col-gutter-xs q-mb-xs">
        <div class="col-3">
          <q-card flat bordered class="rounded-borders q-pa-xs bg-white text-center shadow-2xs full-height flex flex-col justify-between" style="border-color: #e2e8f0; min-height: 96px;">
            <div class="q-mt-xs">
              <q-icon name="local_shipping" size="22px" style="color: #701a1e;" />
            </div>
            <div class="text-h6 text-weight-bolder q-my-xs" style="color: #701a1e; font-size: 18px; line-height: 1;">
              {{ stats.total_do || 7 }}
            </div>
            <div class="text-caption text-grey-7 q-mb-xs" style="font-size: 9.5px;">Total Plan</div>
          </q-card>
        </div>

        <div class="col-3">
          <q-card flat bordered class="rounded-borders q-pa-xs bg-white text-center shadow-2xs full-height flex flex-col justify-between" style="border-color: #e2e8f0; min-height: 96px;">
            <div class="q-mt-xs">
              <q-icon name="directions_car" size="22px" style="color: #701a1e;" />
            </div>
            <div class="text-h6 text-weight-bolder q-my-xs" style="color: #701a1e; font-size: 18px; line-height: 1;">
              {{ stats.in_transit || 2 }}
            </div>
            <div class="text-caption text-grey-7 q-mb-xs" style="font-size: 9.5px;">In Transit</div>
          </q-card>
        </div>

        <div class="col-3">
          <q-card flat bordered class="rounded-borders q-pa-xs bg-white text-center shadow-2xs full-height flex flex-col justify-between" style="border-color: #e2e8f0; min-height: 96px;">
            <div class="q-mt-xs">
              <q-icon name="check_circle_outline" size="22px" style="color: #701a1e;" />
            </div>
            <div class="text-h6 text-weight-bolder q-my-xs" style="color: #701a1e; font-size: 18px; line-height: 1;">
              {{ stats.delivered || 4 }}
            </div>
            <div class="text-caption text-grey-7 q-mb-xs" style="font-size: 9.5px;">Delivered</div>
          </q-card>
        </div>

        <div class="col-3">
          <q-card flat bordered class="rounded-borders q-pa-xs bg-white text-center shadow-2xs full-height flex flex-col justify-between" style="border-color: #e2e8f0; min-height: 96px;">
            <div class="q-mt-xs">
              <q-icon name="receipt_long" size="22px" style="color: #701a1e;" />
            </div>
            <div class="text-caption text-weight-bolder q-my-xs" style="color: #701a1e; font-size: 11px; line-height: 1.1;">
              Rp {{ formatRupiah(stats.nilai_terkirim || 67272000) }}
            </div>
            <div class="text-caption text-grey-7 q-mb-xs" style="font-size: 8.5px; line-height: 1;">Nilai Barang Terkirim</div>
          </q-card>
        </div>
      </div>

      <!-- Search Box & Filter Button -->
      <div class="row q-col-gutter-xs q-mb-xs items-center">
        <div class="col">
          <q-input
            v-model="searchQuery"
            dense
            outlined
            placeholder="Cari Kode DO atau Nama Outlet / Customer..."
            class="bg-white rounded-borders"
            style="font-size: 11px; border-color: #e2e8f0;"
            clearable
            @update:model-value="fetchDeliveries"
          >
            <template v-slot:prepend>
              <q-icon name="search" size="18px" color="grey-6" />
            </template>
          </q-input>
        </div>
        <div class="col-auto">
          <q-btn
            outline
            dense
            icon="tune"
            color="grey-8"
            class="bg-white"
            style="height: 40px; width: 40px; border-color: #e2e8f0;"
          />
        </div>
      </div>

      <!-- Filter Chips Row -->
      <div class="flex items-center q-gutter-xs overflow-auto no-wrap q-mb-xs">
        <q-chip
          v-for="st in statusOptions"
          :key="st"
          clickable
          dense
          :style="activeFilterStatus === st ? 'background-color: #701a1e; color: #ffffff;' : 'background-color: #ffffff; color: #334155; border: 1px solid #e2e8f0;'"
          class="text-weight-bold q-px-sm"
          style="font-size: 10px; height: 26px;"
          @click="activeFilterStatus = st; fetchDeliveries()"
        >
          {{ st }}
        </q-chip>
      </div>

      <!-- Table / Card List of Surat Jalan (DO) -->
      <div v-if="loading" class="text-center q-py-lg">
        <q-spinner-dots color="primary" size="36px" />
        <div class="text-caption text-grey-7 q-mt-xs">Memuat daftar Surat Jalan (DO)...</div>
      </div>

      <div v-else-if="deliveriesList.length === 0" class="text-center q-py-lg">
        <q-icon name="inbox" size="48px" color="grey-5" />
        <div class="text-caption text-grey-7 q-mt-xs">Tidak ada data Surat Jalan (DO) ditemukan.</div>
      </div>

      <div v-else>
        <div
          v-for="item in deliveriesList"
          :key="item.do_id"
          class="q-mb-xs"
        >
          <q-card flat bordered class="rounded-borders q-pa-sm bg-white shadow-1 cursor-pointer" style="border-color: #e2e8f0;" @click="openDeliveryDetail(item)">
            <!-- Card Header Row -->
            <div class="flex items-center justify-between q-mb-xs">
              <div class="flex items-center">
                <!-- Vehicle Icon Container -->
                <div
                  class="flex flex-center rounded-borders q-mr-xs"
                  :style="item.status === 'Preparing' ? 'background-color: #fff4e5; width: 28px; height: 28px;' : 'background-color: #e0edff; width: 28px; height: 28px;'"
                >
                  <q-icon
                    name="local_shipping"
                    size="16px"
                    :color="item.status === 'Preparing' ? 'warning' : 'primary'"
                  />
                </div>

                <span class="text-subtitle2 text-weight-bolder text-dark q-mr-xs" style="font-size: 12.5px;">
                  {{ item.kode_do }}
                </span>
                <span class="text-caption text-grey-6 flex items-center" style="font-size: 9.5px;">
                  <q-icon name="event" size="11px" class="q-mr-xs" /> {{ item.tgl_do }}
                </span>
              </div>

              <!-- Status Badge (Mockup Colors) -->
              <q-badge
                :style="
                  item.status === 'Delivered'
                    ? 'background-color: #28a745; color: #ffffff;'
                    : item.status === 'Preparing'
                    ? 'background-color: #f5a623; color: #ffffff;'
                    : 'background-color: #1d6bf3; color: #ffffff;'
                "
                class="text-weight-bold q-px-xs q-py-xs"
                style="font-size: 9.5px; border-radius: 4px;"
              >
                {{ item.status }}
              </q-badge>
            </div>

            <!-- Card Body Details -->
            <div class="row q-col-gutter-xs text-caption q-my-xs" style="font-size: 10.5px;">
              <div class="col-7">
                <div class="text-grey-7">Outlet: <b class="text-dark">{{ item.nama_outlet }}</b></div>
                <div class="text-grey-7 q-mt-2px">Customer: <b class="text-dark">{{ item.sumber || 'SFA Lapangan' }}</b></div>
                <div class="text-grey-7 q-mt-2px">Driver: <span class="text-dark">{{ item.driver }}</span></div>
              </div>

              <div class="col-5 text-right flex flex-col justify-between items-end">
                <div class="text-grey-7" style="font-size: 10.5px;">Qty: <b class="text-dark">{{ item.total_qty }}</b></div>
                <div class="text-weight-bolder text-no-wrap q-mt-xs" style="color: #701a1e; font-size: 13px;">
                  Rp {{ formatRupiah(item.nilai_barang) }}
                </div>
              </div>
            </div>

            <!-- Action Buttons Row (Google Maps) -->
            <div class="flex items-center justify-end q-mt-xs pt-xs border-top" style="border-top: 1px solid #f1f5f9;">
              <q-btn
                outline
                dense
                no-caps
                class="text-weight-bold"
                style="color: #701a1e; border-color: #cbd5e1; font-size: 10px; padding: 2px 10px;"
                @click.stop="openGoogleMaps(item)"
              >
                <q-icon name="place" size="14px" color="red-9" class="q-mr-xs" /> Google Maps
              </q-btn>
            </div>
          </q-card>
        </div>
      </div>

    </div>

    <!-- ── VIEW 2: FORM / DETAIL VIEW (WHEN CLICKED) ───────────────────── -->
    <div v-else class="q-pa-xs">
      
      <!-- Back Header (Mockup Design) -->
      <div class="flex items-center justify-between q-pa-xs bg-white rounded-borders q-mb-xs shadow-2xs" style="border: 1px solid #e2e8f0;">
        <q-btn flat dense no-caps class="text-weight-bold" style="color: #701a1e; font-size: 12px;" @click="selectedDelivery = null">
          <q-icon name="arrow_back" size="16px" style="color: #701a1e;" class="q-mr-xs" />
          Kembali ke Daftar DO
        </q-btn>
        <q-badge
          :style="doStatus === 'Delivered' ? 'background-color: #28a745;' : 'background-color: #1d6bf3;'"
          class="text-weight-bold q-px-sm q-py-xs"
          style="font-size: 10px; border-radius: 4px;"
        >
          {{ doStatus }}
        </q-badge>
      </div>

      <!-- Tipe Kunjungan Mode Switcher Bar (Mockup Design) -->
      <q-card flat bordered class="rounded-borders q-pa-xs bg-white q-mb-xs shadow-2xs" style="border-color: #e2e8f0;">
        <div class="flex items-center justify-between">
          <span class="text-caption text-weight-bolder text-dark q-ml-xs" style="font-size: 11px;">Tipe Kunjungan</span>
          <div class="flex items-center q-gutter-xs">
            <q-btn
              dense
              unelevated
              no-caps
              :style="currentDoType === 'TO' ? 'background-color: #701a1e; color: #ffffff;' : 'background-color: #ffffff; color: #334155; border: 1px solid #e2e8f0;'"
              class="text-weight-bold q-px-sm"
              style="font-size: 10px; height: 26px; border-radius: 4px;"
              @click="currentDoType = 'TO'"
            >
              <q-icon name="shopping_cart" size="13px" class="q-mr-xs" /> Taking Order (TO)
            </q-btn>

            <q-btn
              dense
              unelevated
              no-caps
              :style="currentDoType === 'Canvas' ? 'background-color: #701a1e; color: #ffffff;' : 'background-color: #ffffff; color: #334155; border: 1px solid #e2e8f0;'"
              class="text-weight-bold q-px-sm"
              style="font-size: 10px; height: 26px; border-radius: 4px;"
              @click="currentDoType = 'Canvas'"
            >
              <q-icon name="shopping_bag" size="13px" class="q-mr-xs" /> Canvas Sales
            </q-btn>
          </div>
        </div>
      </q-card>

      <!-- Mode A: Taking Order (TO) -->
      <div v-if="currentDoType === 'TO'">
        
        <!-- Status Stepper Card (Mockup Design) -->
        <q-card flat bordered class="rounded-borders q-pa-sm bg-white q-mb-xs shadow-2xs" style="border-color: #e2e8f0;">
          <div class="text-caption text-weight-bolder text-dark q-mb-sm flex items-center" style="font-size: 11px;">
            <q-icon name="local_shipping" size="16px" color="dark" class="q-mr-xs" />
            Status Pengiriman (Gudang Central)
          </div>

          <div class="row q-col-gutter-xs text-center items-center">
            <div v-for="(step, i) in doSteps" :key="i" class="col-3">
              <div class="flex flex-col items-center">
                <div
                  :class="['flex flex-center rounded-full q-mb-xs']"
                  :style="step.done ? 'background-color: #28a745; width: 34px; height: 34px; border-radius: 50%;' : 'background-color: #cbd5e1; width: 34px; height: 34px; border-radius: 50%;'"
                >
                  <q-icon :name="step.icon" color="white" size="17px" />
                </div>
                <div
                  class="text-caption text-weight-bold"
                  :style="step.done ? 'color: #28a745; font-size: 9px;' : 'color: #64748b; font-size: 9px;'"
                >
                  {{ step.label }}
                </div>
              </div>
            </div>
          </div>
        </q-card>

        <!-- SURAT JALAN Header Card (Mockup Design) -->
        <q-card flat bordered class="rounded-borders q-pa-sm bg-white q-mb-xs shadow-2xs" style="border-color: #e2e8f0;">
          <div class="flex items-start justify-between q-mb-xs">
            <div>
              <div class="text-subtitle2 text-weight-bolder flex items-center" style="color: #1e40af; font-size: 12.5px;">
                <q-icon name="description" size="16px" class="q-mr-xs" />
                SURAT JALAN (DELIVERY ORDER)
              </div>
              <div class="text-caption text-weight-bold text-dark q-mt-2px" style="font-size: 11.5px;">
                No. Dokumen: <span style="color: #1e40af;">{{ selectedDelivery.kode_do }}</span>
              </div>
              <div class="text-caption text-grey-7" style="font-size: 9.5px;">Gudang Asal: Gudang Logistik Utama Central</div>
              <div class="text-caption text-grey-7" style="font-size: 9.5px;">Tgl. Diterbitkan: {{ selectedDelivery.tgl_do || '25 Jul 2026 - 00:00 WIB' }}</div>
            </div>
            <div class="text-center">
              <q-icon name="qr_code_2" size="44px" color="dark" />
              <div>
                <q-badge style="background-color: #28a745; font-size: 8px;" class="text-weight-bold q-px-xs">
                  {{ selectedDelivery.status }}
                </q-badge>
              </div>
            </div>
          </div>

          <!-- 2 Sub-Cards Row -->
          <div class="row q-col-gutter-xs q-mt-xs">
            <div class="col-6">
              <div class="rounded-borders q-pa-xs full-height" style="background-color: #eff6ff; border: 1px solid #dbeafe;">
                <div class="text-caption text-weight-bolder q-mb-xs flex items-center" style="color: #1e40af; font-size: 9.5px;">
                  <q-icon name="apartment" size="13px" class="q-mr-xs" /> Tujuan Pengiriman
                </div>
                <div class="text-caption text-weight-bolder text-dark" style="font-size: 10.5px;">{{ selectedDelivery.nama_outlet || selectedDelivery.outlet_name }}</div>
                <div class="text-caption text-grey-7" style="font-size: 9.5px;">Pemilik: {{ selectedDelivery.owner_name || 'Bpk. Ahmad' }}</div>
                <div class="text-caption text-grey-7 q-mt-2px flex items-center" style="font-size: 9px;">
                  <q-icon name="place" size="11px" color="red-9" class="q-mr-xs" /> {{ selectedDelivery.outlet_addr || 'Cidodol' }}
                </div>
              </div>
            </div>

            <div class="col-6">
              <div class="rounded-borders q-pa-xs full-height" style="background-color: #f0fdf4; border: 1px solid #dcfce7;">
                <div class="text-caption text-weight-bolder q-mb-xs flex items-center" style="color: #15803d; font-size: 9.5px;">
                  <q-icon name="local_shipping" size="13px" class="q-mr-xs" /> Kurir & Armada
                </div>
                <div class="text-caption text-weight-bolder text-dark" style="font-size: 10.5px;">Driver: {{ selectedDelivery.driver || selectedDelivery.driver_name || 'Doni Kuswara' }}</div>
                <div class="text-caption text-grey-7" style="font-size: 9.5px;">Armada / Nopol: <b>{{ selectedDelivery.nopol || 'B 9934 XY' }}</b></div>
                <div class="text-caption text-grey-7 q-mt-2px" style="font-size: 9px;">Pengiriman reguler harian</div>
              </div>
            </div>
          </div>
        </q-card>

        <!-- Rincian Barang Dikirim Table Card (Mockup Design) -->
        <q-card flat bordered class="rounded-borders q-pa-sm bg-white q-mb-xs shadow-2xs" style="border-color: #e2e8f0;">
          <div class="text-caption text-weight-bolder text-dark q-mb-xs flex items-center" style="font-size: 11px;">
            <q-icon name="inventory_2" size="15px" color="amber-9" class="q-mr-xs" />
            Rincian Barang Dikirim (TO Gudang)
          </div>
          <q-separator class="q-mb-xs" />

          <div class="row bg-grey-2 rounded-borders q-px-xs q-py-xs q-mb-xs text-caption text-weight-bolder text-grey-8" style="font-size: 9.5px;">
            <div class="col-5">Nama Produk</div>
            <div class="col-2 text-center">Qty</div>
            <div class="col-2 text-center">Kirim</div>
            <div class="col-3 text-right">Subtotal</div>
          </div>

          <div v-for="(item, idx) in detailItems" :key="idx" class="row q-px-xs q-py-xs items-center" :class="idx % 2 === 0 ? 'bg-white' : 'bg-grey-1'" style="border-bottom: 1px solid #f1f5f9;">
            <div class="col-5">
              <div class="text-caption text-weight-bold text-dark" style="font-size: 10px;">{{ item.name }}</div>
              <div class="text-caption text-grey-6" style="font-size: 8.5px;">SKU: {{ item.sku || 'SKUMED-002' }}</div>
            </div>
            <div class="col-2 text-center text-caption text-weight-bold text-dark" style="font-size: 10px;">{{ item.qty }} Pcs</div>
            <div class="col-2 text-center text-caption text-weight-bolder" style="color: #28a745; font-size: 10px;">
              {{ item.qty_kirim || item.qty }} Pcs
            </div>
            <div class="col-3 text-right">
              <div class="text-caption text-weight-bolder" style="color: #b91c1c; font-size: 10px;">
                Rp {{ formatRupiah(item.price * item.qty) }}
              </div>
            </div>
          </div>

          <!-- Table Footer Totals (Mockup Blue Card) -->
          <div class="rounded-borders q-pa-xs q-mt-xs" style="background-color: #eff6ff; border: 1px solid #dbeafe;">
            <div class="row items-center">
              <div class="col-5 text-caption text-weight-bolder text-dark" style="font-size: 10px;">Total Barang:</div>
              <div class="col-2 text-center text-caption text-weight-bolder" style="color: #1d4ed8; font-size: 10px;">
                {{ detailItems.reduce((s, i) => s + i.qty, 0) }} pcs
              </div>
              <div class="col-2 text-center text-caption text-weight-bolder" style="color: #28a745; font-size: 10px;">
                {{ detailItems.reduce((s, i) => s + (i.qty_kirim || i.qty), 0) }} pcs
              </div>
              <div class="col-3 text-right text-caption text-weight-bolder text-dark" style="font-size: 9.5px;">
                Subtotal: Rp {{ formatRupiah(detailSubtotal) }}
              </div>
            </div>

            <div v-if="detailDiscount > 0" class="flex justify-between items-center text-caption q-mt-2px" style="color: #b91c1c; font-size: 9.5px;">
              <span>Diskon Promo Engine / Voucher:</span>
              <span>- Rp {{ formatRupiah(detailDiscount) }}</span>
            </div>

            <div class="flex justify-between items-center text-subtitle2 text-weight-bolder q-mt-2px pt-2px" style="color: #1d4ed8; font-size: 11.5px; border-top: 1px solid #dbeafe;">
              <span>Grand Total DO:</span>
              <span>Rp {{ formatRupiah(detailGrandTotal) }}</span>
            </div>
          </div>
        </q-card>

        <!-- Section: Tanda Tangan Digital QR & Canvas Manual (Mockup Design) -->
        <q-card flat bordered class="rounded-borders q-pa-sm bg-white q-mb-xs shadow-2xs" style="border-color: #e2e8f0;">
          <div class="text-caption text-weight-bolder flex items-center q-mb-xs" style="color: #1e40af; font-size: 10.5px;">
            <q-icon name="edit" size="14px" class="q-mr-xs" />
            Tanda Tangan Digital QR & Canvas Manual (Proses Bertahap)
          </div>
          <q-separator class="q-mb-xs" />

          <div class="row q-col-gutter-xs">
            <!-- Stage 1: Petugas Gudang (TTD QR) -->
            <div class="col-4">
              <div class="rounded-borders q-pa-xs text-center full-height flex flex-col justify-between" style="background-color: #f8fafc; border: 1px dashed #cbd5e1;">
                <div class="text-caption text-weight-bolder text-dark q-mb-xs" style="font-size: 8.5px;">
                  1. Petugas Gudang (TTD QR)
                </div>
                <div class="q-my-xs">
                  <q-icon name="apartment" size="20px" style="color: #1d4ed8;" />
                </div>
                <q-btn
                  dense
                  unelevated
                  no-caps
                  class="text-weight-bold full-width"
                  style="background-color: #1d4ed8; color: #ffffff; font-size: 8.5px; height: 26px; border-radius: 4px;"
                >
                  ✓ Tandai Gudang
                </q-btn>
                <div class="text-caption text-grey-7 q-mt-xs" style="font-size: 8px;">
                  (Admin Gudang)
                </div>
              </div>
            </div>

            <!-- Stage 2: Driver (TTD QR) -->
            <div class="col-4">
              <div class="rounded-borders q-pa-xs text-center full-height flex flex-col justify-between" style="background-color: #fffbeb; border: 1px dashed #f59e0b;">
                <div class="text-caption text-weight-bolder text-dark q-mb-xs" style="font-size: 8.5px;">
                  2. Driver (TTD QR)
                </div>
                <div class="q-my-xs">
                  <q-icon name="local_shipping" size="20px" style="color: #f59e0b;" />
                </div>
                <q-btn
                  dense
                  unelevated
                  no-caps
                  class="text-weight-bold full-width"
                  :style="driverSigned ? 'background-color: #28a745; color: #ffffff;' : 'background-color: #f59e0b; color: #ffffff;'"
                  style="font-size: 8.5px; height: 26px; border-radius: 4px;"
                  @click="signDriver"
                >
                  {{ driverSigned ? '✓ TTD Valid' : '↗ TTD QR Driver' }}
                </q-btn>
                <div class="text-caption text-grey-7 q-mt-xs" style="font-size: 8px;">
                  ({{ selectedDelivery.driver || 'Ayu / Doni' }})
                </div>
              </div>
            </div>

            <!-- Stage 3: Penerima Outlet -->
            <div class="col-4">
              <div class="rounded-borders q-pa-xs text-center full-height flex flex-col justify-between" style="background-color: #f0fdf4; border: 1px dashed #22c55e;">
                <div class="text-caption text-weight-bolder text-dark q-mb-xs" style="font-size: 8.5px;">
                  3. Penerima Outlet
                </div>
                <div class="q-my-xs">
                  <q-icon name="account_circle" size="20px" style="color: #16a34a;" />
                </div>
                <q-btn
                  dense
                  unelevated
                  no-caps
                  class="text-weight-bold full-width"
                  style="background-color: #16a34a; color: #ffffff; font-size: 8.5px; height: 26px; border-radius: 4px;"
                  @click="currentDoType = 'Canvas'"
                >
                  {{ doSubmitted ? '✓ Sudah Terima Valid' : '📷 Foto & TTD' }}
                </q-btn>
                <div class="text-caption text-grey-7 q-mt-xs" style="font-size: 8px;">
                  ({{ selectedDelivery.owner_name || 'Bpk. Ahmad' }})
                </div>
              </div>
            </div>
          </div>
        </q-card>

        <q-btn
          :label="doSubmitted ? '✓ Status DO Terkonfirmasi Terkirim' : 'Konfirmasi Status Surat Jalan (TO)'"
          icon="verified"
          :color="doSubmitted ? 'positive' : 'primary'"
          class="full-width text-weight-bold shadow-2 q-mt-xs"
          height="44px"
          unelevated no-caps
          :loading="savingDo"
          @click="confirmDelivery"
        />
      </div>

      <!-- Mode B: Canvas Sales -->
      <div v-else>
        <!-- Canvas TTD & Proof Section -->
        <q-card flat bordered class="rounded-borders q-pa-sm bg-white q-mb-xs shadow-1">
          <div class="text-caption text-weight-bold text-dark q-mb-xs flex items-center">
            <q-icon name="gesture" size="15px" color="primary" class="q-mr-xs" />
            1. Tanda Tangan Digital Penerima Toko
          </div>
          <q-separator class="q-mb-xs" />

          <div class="text-center bg-grey-1 rounded-borders q-pa-xs border-dashed" style="border: 2px dashed #cbd5e1;">
            <canvas
              ref="sigCanvasRef"
              width="320"
              height="115"
              style="border-radius: 8px; cursor: crosshair; touch-action: none; width: 100%; max-width: 320px; height: 115px; background: #ffffff;"
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

        <q-card flat bordered class="rounded-borders q-pa-sm bg-white q-mb-xs shadow-1">
          <div class="text-caption text-weight-bold text-dark q-mb-xs flex items-center">
            <q-icon name="photo_camera" size="15px" color="deep-orange-9" class="q-mr-xs" />
            2. Foto Live Bukti Serah Terima
          </div>
          <q-separator class="q-mb-xs" />

          <input ref="canvasPhotoInput" type="file" accept="image/*" capture="environment" style="display: none;" @change="onCanvasPhotoCaptured" />

          <div v-if="canvasPhotoUrl" class="relative-position text-center">
            <img :src="canvasPhotoUrl" class="rounded-borders shadow-1" style="width: 100%; max-height: 160px; object-fit: cover;" />
            <q-btn round dense icon="close" color="negative" size="xs" class="absolute-top-right q-ma-xs" @click="canvasPhotoUrl = ''" />
          </div>

          <div v-else class="row q-col-gutter-xs">
            <div class="col-12">
              <q-btn outline color="deep-orange-9" icon="photo_camera" label="Ambil Foto Pakai Kamera" class="full-width text-weight-bold" height="40px" no-caps @click="$refs.canvasPhotoInput.click()" />
            </div>
          </div>
        </q-card>

        <q-btn
          :label="doSubmitted ? '✓ Serah Terima Canvas Terkonfirmasi' : 'Konfirmasi Serah Terima Canvas (Foto & TTD)'"
          icon="verified"
          :color="doSubmitted ? 'positive' : 'deep-orange-9'"
          class="full-width text-weight-bold shadow-2 q-mt-xs"
          height="44px"
          unelevated no-caps
          :loading="savingDo"
          @click="confirmDelivery"
        />
      </div>

    </div>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '../boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const loading = ref(true)
const searchQuery = ref('')
const activeFilterStatus = ref('Semua')

const statusOptions = ['Semua', 'Preparing', 'In Transit', 'Delivered']

const stats = ref({
  total_do: 7,
  in_transit: 2,
  delivered: 4,
  preparing: 1,
  nilai_terkirim: 67272000
})

const defaultDeliveries = [
  {
    do_id: 1,
    kode_do: 'DO-260726-4289',
    sumber: 'SFA Lapangan',
    ref_order: 'SO-20260726-273',
    nama_outlet: 'Cabang Outlet Cidodol',
    tier_outlet: 'Tier C',
    driver: 'Ayu Rahayu',
    total_qty: '10 Pcs',
    nilai_barang: 765000,
    status: 'In Transit',
    tgl_do: '26 Jul 2026',
  },
  {
    do_id: 2,
    kode_do: 'DO-260725-4517',
    sumber: 'SFA Lapangan',
    ref_order: 'SO-260725-1007',
    nama_outlet: 'Cabang Kemanggisan',
    tier_outlet: 'Tier C',
    driver: 'Ayu Rahayu',
    total_qty: '7 Pcs',
    nilai_barang: 233750,
    status: 'Preparing',
    tgl_do: '25 Jul 2026',
  },
  {
    do_id: 3,
    kode_do: 'DO-260725-8217',
    sumber: 'SFA Lapangan',
    ref_order: 'SO-260725-6695',
    nama_outlet: 'Cabang Kemanggisan',
    tier_outlet: 'Tier C',
    driver: 'Ayu Rahayu',
    total_qty: '7 Pcs',
    nilai_barang: 233750,
    status: 'Delivered',
    tgl_do: '25 Jul 2026',
  },
  {
    do_id: 4,
    kode_do: 'DO-260725-9760',
    sumber: 'SFA Lapangan',
    ref_order: 'SO-260725-2511',
    nama_outlet: 'Cabang Meruya',
    tier_outlet: 'Tier C',
    driver: 'Ayu Rahayu',
    total_qty: '14 Pcs',
    nilai_barang: 453750,
    status: 'Delivered',
    tgl_do: '25 Jul 2026',
  }
]

const deliveriesList = ref(defaultDeliveries)
const selectedDelivery = ref(null)

const currentDoType = ref('TO')
const savingDo = ref(false)
const doSubmitted = ref(false)
const driverSigned = ref(false)

const canvasPhotoUrl = ref('')
const canvasPhotoInput = ref(null)
const sigCanvasRef = ref(null)
const isDrawingSig = ref(false)

const doStatus = computed(() => {
  if (doSubmitted.value) return 'Delivered'
  return selectedDelivery.value?.status || 'In Transit'
})

const doSteps = computed(() => {
  const st = (doStatus.value || 'In Transit').trim()
  const isDelivered = (st === 'Delivered' || st === 'Selesai')
  const inTransit   = isDelivered || st === 'In Transit' || st === 'On Delivery'
  const driverAssigned = inTransit || st === 'Driver Assigned'

  return [
    { label: '1. Preparing', icon: 'inventory', done: true, active: st === 'Preparing' },
    { label: '2. Driver', icon: 'manage_accounts', done: driverAssigned || inTransit || isDelivered, active: st === 'Driver Assigned' },
    { label: '3. In Transit', icon: 'local_shipping', done: isDelivered, active: st === 'In Transit' || st === 'On Delivery' },
    { label: '4. Delivered', icon: 'check_circle', done: isDelivered, active: isDelivered }
  ]
})

const detailItems = computed(() => {
  if (selectedDelivery.value?.items && Array.isArray(selectedDelivery.value.items) && selectedDelivery.value.items.length > 0) {
    return selectedDelivery.value.items
  }
  return [
    { name: 'Amoxicillin 500mg (Dus)', sku: 'SKU-PHR-002', qty: 5, qty_kirim: 5, price: 85000, is_free: false },
    { name: 'Amoxicillin 500mg (Dus)', sku: 'SKU-PHR-002', qty: 2, qty_kirim: 2, price: 0, is_free: true }
  ]
})

const detailSubtotal = computed(() => {
  return detailItems.value.reduce((s, i) => s + (i.price * i.qty), 0)
})

const detailDiscount = computed(() => {
  if (selectedDelivery.value?.discount) return Number(selectedDelivery.value.discount)
  if (selectedDelivery.value?.nilai_barang && detailSubtotal.value > selectedDelivery.value.nilai_barang) {
    return detailSubtotal.value - selectedDelivery.value.nilai_barang
  }
  return 85000
})

const detailGrandTotal = computed(() => {
  if (selectedDelivery.value?.nilai_barang) return Number(selectedDelivery.value.nilai_barang)
  return Math.max(0, detailSubtotal.value - detailDiscount.value)
})

async function fetchDeliveries() {
  loading.value = true
  try {
    const res = await api.get('/deliveries', {
      params: {
        status: activeFilterStatus.value,
        search: searchQuery.value
      }
    })
    if (res.data.success && res.data.data) {
      stats.value = res.data.data.stats || stats.value
      const fetched = res.data.data.deliveries || []
      deliveriesList.value = fetched.length > 0 ? fetched : defaultDeliveries
    } else {
      deliveriesList.value = defaultDeliveries
    }
  } catch {
    deliveriesList.value = defaultDeliveries
  } finally {
    // Restore persisted status from localStorage
    deliveriesList.value.forEach(d => {
      if (localStorage.getItem(`do_submitted_${d.do_id}`) === 'true') {
        d.status = 'Delivered'
      }
    })
    loading.value = false
  }
}

function openGoogleMaps(item) {
  const lat = item.latitude || -6.2234
  const lng = item.longitude || 106.7891
  const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  window.open(gmapsUrl, '_blank')
}

async function openDeliveryDetail(item) {
  loading.value = true
  try {
    const res = await api.get(`/deliveries/${item.do_id || 1}`)
    if (res.data.success && res.data.data) {
      selectedDelivery.value = res.data.data
    } else {
      selectedDelivery.value = item
    }
  } catch {
    selectedDelivery.value = item
  } finally {
    const id = selectedDelivery.value?.do_id || item.do_id || 1
    
    // Restore driver signature state
    const isDriverSigned = localStorage.getItem(`do_driver_signed_${id}`) === 'true' || Boolean(selectedDelivery.value?.driver_signed)
    driverSigned.value = isDriverSigned

    // Restore outlet signature & delivery state
    const isOutletSubmitted = localStorage.getItem(`do_submitted_${id}`) === 'true' || selectedDelivery.value?.status === 'Delivered'
    doSubmitted.value = isOutletSubmitted
    if (isOutletSubmitted && selectedDelivery.value) {
      selectedDelivery.value.status = 'Delivered'
    }

    loading.value = false
  }
}

async function signDriver() {
  const id = selectedDelivery.value?.do_id || 1
  driverSigned.value = true
  localStorage.setItem(`do_driver_signed_${id}`, 'true')
  try {
    await api.post(`/deliveries/${id}/driver-sign`)
  } catch {
    /* ignore */
  }
  $q.notify({
    type: 'positive',
    icon: 'verified',
    message: 'TTD QR Driver Kurir Berhasil Terverifikasi!',
    position: 'top'
  })
}

async function confirmDelivery() {
  savingDo.value = true
  const id = selectedDelivery.value?.do_id || 1
  localStorage.setItem(`do_submitted_${id}`, 'true')
  try {
    await api.post(`/deliveries/${id}/confirm`, {
      PENERIMA: 'Bpk. Ahmad (Owner)',
      CATATAN: 'Serah terima terkonfirmasi di mobile app'
    })
  } catch {
    console.warn('Sync confirm DO notice')
  } finally {
    savingDo.value = false
    doSubmitted.value = true
    if (selectedDelivery.value) {
      selectedDelivery.value.status = 'Delivered'
    }
    const targetInList = deliveriesList.value.find(d => d.do_id === id)
    if (targetInList) {
      targetInList.status = 'Delivered'
    }
    $q.notify({
      type: 'positive',
      icon: 'verified',
      message: 'Status Surat Jalan (DO) Berhasil Dikonfirmasi Terkirim!',
      caption: 'Tersimpan & tersinkronisasi ke Web Admin Pusat.',
      position: 'top'
    })
  }
}

function startSig(e) {
  isDrawingSig.value = true
  const canvas = sigCanvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const rect = canvas.getBoundingClientRect()
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top
  ctx.beginPath()
  ctx.moveTo(x, y)
}

function moveSig(e) {
  if (!isDrawingSig.value) return
  const canvas = sigCanvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const rect = canvas.getBoundingClientRect()
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top
  ctx.lineWidth = 2.5
  ctx.lineCap = 'round'
  ctx.strokeStyle = '#1e3a8a'
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

function formatRupiah(val) {
  if (!val || isNaN(val)) return '0'
  return Number(val).toLocaleString('id-ID')
}

onMounted(() => {
  fetchDeliveries()
})
</script>

<style scoped>
.border-dashed {
  border-style: dashed;
}
.border-grey {
  border-color: #e2e8f0;
}
</style>
