<template>
  <q-layout view="lHh Lpr lFf" class="main-layout">

    <!-- ===== HEADER: Transparent, no background, no border ===== -->
    <q-header class="vistra-header" elevated>
      <div class="header-content">
        <!-- LEFT: Logo + Brand -->
        <div class="header-left">
          <img src="/images/logo.png" alt="Vistra" class="header-logo" />
          <div class="header-brand-text">
            <span class="brand-name">VISTRA</span>
            <span class="brand-sub">INTELLIGENT CRM SOLUTIONS</span>
          </div>
        </div>
        <!-- RIGHT: Notif + Avatar -->
        <div class="header-right">
          <div class="notif-wrap">
            <q-icon name="notifications" size="26px" color="white" />
            <span class="notif-badge">3</span>
          </div>
          <q-avatar size="38px" class="cursor-pointer header-avatar" @click="logout">
            <img :src="userAvatar" />
          </q-avatar>
        </div>
      </div>
    </q-header>

    <!-- Side Drawer -->
    <q-drawer v-model="leftDrawerOpen" bordered class="bg-white" :width="260" :breakpoint="1024">
      <div class="drawer-header q-pa-lg">
        <div class="drawer-logo-row">
          <img src="/images/logo.png" alt="Vistra" style="width:36px;height:36px;object-fit:contain;" />
          <span class="drawer-brand">Vistra</span>
        </div>
        <div class="drawer-subtitle">Sales Force Automation</div>
      </div>
      <q-separator />
      <q-list class="q-pt-md q-px-sm">
        <q-item v-for="item in menuItems" :key="item.label" clickable v-ripple :to="item.to" exact active-class="drawer-active" class="drawer-item">
          <q-item-section avatar><q-icon :name="item.icon" size="22px" /></q-item-section>
          <q-item-section class="text-weight-medium" style="font-size:14px;">{{ item.label }}</q-item-section>
        </q-item>
      </q-list>
      <q-space />
      <div class="q-pa-md">
        <q-btn flat no-caps class="full-width text-left text-negative drawer-item" icon="logout" label="Keluar" @click="logout" />
      </div>
    </q-drawer>

    <!-- Page Content -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- ===== BOTTOM NAV ===== -->
    <q-footer class="bottom-nav" bordered>
      <div class="bottom-nav__inner">
        <div class="nav-item" :class="{ active: currentRoute === '/dashboard' }" @click="go('/dashboard')">
          <q-icon name="home" size="22px" />
          <span>Home</span>
        </div>
        <div class="nav-item" :class="{ active: currentRoute === '/deliveries' }" @click="go('/deliveries')">
          <q-icon name="local_shipping" size="22px" />
          <span>DO</span>
        </div>
        <!-- Visit - Center FAB -->
        <div class="nav-item nav-item--center" @click="go('/journey-plan')">
          <div class="center-fab" :class="{ 'center-fab--active': currentRoute === '/journey-plan' || currentRoute?.startsWith('/visit') }">
            <q-icon name="directions_walk" size="24px" color="white" />
          </div>
          <span :class="(currentRoute === '/journey-plan' || currentRoute?.startsWith('/visit')) ? 'active' : ''">Visit</span>
        </div>
        <div class="nav-item" :class="{ active: currentRoute === '/reports' }" @click="go('/reports')">
          <q-icon name="bar_chart" size="22px" />
          <span>Report</span>
        </div>
        <div class="nav-item" :class="{ active: currentRoute === '/returns' }" @click="go('/returns')">
          <q-icon name="assignment_return" size="22px" />
          <span>Retur</span>
        </div>
      </div>
    </q-footer>

  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { api } from '../boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()
const route  = useRoute()
const leftDrawerOpen = ref(false)

const userAvatar   = ref('https://cdn.quasar.dev/img/avatar.png')
const currentRoute = computed(() => route.path)

const menuItems = [
  { icon: 'dashboard',      label: 'Beranda',               to: '/dashboard'    },
  { icon: 'map',            label: 'Rencana Kunjungan',     to: '/journey-plan' },
  { icon: 'local_shipping', label: 'Surat Jalan (DO)',      to: '/deliveries'   },
  { icon: 'inventory_2',    label: 'Katalog Produk',        to: '/products'     },
  { icon: 'storefront',     label: 'Daftar Outlet',         to: '/outlets'      },
  { icon: 'assessment',     label: 'Laporan Sales & Retur', to: '/reports'      },
  { icon: 'sync',           label: 'Sinkronisasi Offline',  to: '/sync'         },
  { icon: 'person',         label: 'Profil Saya',           to: '/profile'      },
]

function go(to) { router.push(to) }

async function logout() {
  try { await api.post('/logout') } catch { /* ignore */ }
  localStorage.removeItem('sales_token')
  localStorage.removeItem('sales_user')
  $q.notify({ type: 'info', message: 'Berhasil keluar', position: 'top', timeout: 1500 })
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.main-layout { background: #f0f0f0; }

/* ======== HEADER ======== */
.vistra-header {
  /* Warna atas gradient — sambung seamless ke top-gradient-section di page */
  background: linear-gradient(180deg, #1a0208 0%, #350007 100%) !important;
  box-shadow: none !important;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  height: 56px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
  filter: drop-shadow(0 0 6px rgba(255,100,100,0.3));
}

.header-brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.brand-name {
  font-size: 17px;
  font-weight: 900;
  color: #fff;
  letter-spacing: 2px;
}

.brand-sub {
  font-size: 6.5px;
  color: rgba(255,255,255,0.65);
  letter-spacing: 0.5px;
  margin-top: 2px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.notif-wrap {
  position: relative;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notif-badge {
  position: absolute;
  top: -2px;
  right: -3px;
  background: #f5a623;
  color: #1a0208;
  font-size: 9px;
  font-weight: 800;
  border-radius: 50%;
  width: 15px;
  height: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid rgba(255,255,255,0.3);
}

.header-avatar {
  border: 2px solid rgba(255,255,255,0.5);
  box-shadow: 0 2px 8px rgba(0,0,0,0.35);
}

/* ======== DRAWER ======== */
.drawer-header { padding-bottom: 16px; }
.drawer-logo-row { display: flex; align-items: center; gap: 10px; }
.drawer-brand { font-size: 22px; font-weight: 800; color: #1a1a1a; }
.drawer-subtitle { font-size: 12px; color: #9e9e9e; margin-top: 6px; }
.drawer-item { border-radius: 12px; margin-bottom: 4px; min-height: 44px; }
.drawer-active {
  background: rgba(192, 21, 42, 0.08) !important;
  color: #c0152a !important;
  :deep(.q-icon) { color: #c0152a !important; }
}

/* ======== BOTTOM NAV ======== */
.bottom-nav {
  background: linear-gradient(180deg, #1a0208 0%, #c0152a 100%) !important;
  box-shadow: 0 -2px 12px rgba(0,0,0,0.3) !important;
  height: 62px;
  border-top: none;
}

.bottom-nav__inner {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 62px;
  padding: 0 4px 6px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  cursor: pointer;
  color: rgba(255,255,255,0.5);
  flex: 1;
  transition: color 0.2s;
  padding-bottom: 2px;

  span { font-size: 10px; font-weight: 600; }
  &.active, &.active span { color: #ffffff; }
  &:active { transform: scale(0.9); }
}

.nav-item--center {
  align-items: center;
  padding-bottom: 0;
}

.center-fab {
  width: 50px;
  height: 50px;
  background: linear-gradient(145deg, #ff2040, #8a000e);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(0,0,0,0.4);
  margin-top: -20px;
  border: 3px solid #c0152a;
  transition: all 0.2s ease;
  &--active { background: linear-gradient(145deg, #ff4060, #c0001e); }
  &:active { transform: scale(0.9); }
}

.nav-item--center span {
  font-size: 10px;
  font-weight: 600;
  color: rgba(255,255,255,0.5);
  margin-top: 2px;
  &.active { color: #ffffff; }
}
</style>

<style lang="scss">
/* No global header shadow */
.q-header { box-shadow: none !important; }
</style>
