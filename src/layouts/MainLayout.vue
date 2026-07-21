<template>
  <q-layout view="lHh Lpr lFf" class="main-layout">
    <!-- Solid Header -->
    <q-header class="bg-white text-dark q-py-xs q-px-sm" style="border-bottom: 1px solid rgba(0,0,0,0.05);">
      <q-toolbar class="q-pa-none">
        <!-- Menu icon -->
        <q-btn flat round dense @click="toggleLeftDrawer" class="text-dark">
          <q-icon name="menu_open" size="24px" />
        </q-btn>

        <q-space />

        <!-- Notification Bell -->
        <q-btn flat round dense class="text-dark q-mr-xs">
          <q-icon name="notifications_none" size="24px" />
          <q-badge color="red" floating rounded style="top: 6px; right: 4px; font-size: 9px;">3</q-badge>
        </q-btn>

        <!-- User Avatar -->
        <q-avatar size="36px" class="cursor-pointer shadow-1" @click="logout">
          <img :src="userAvatar" />
        </q-avatar>
      </q-toolbar>
    </q-header>

    <!-- Side Drawer -->
    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      class="bg-white"
      :width="260"
      :breakpoint="1024"
    >
      <div class="drawer-header q-pa-lg">
        <div class="drawer-logo">
          <div class="v-icon-circle v-gradient-primary" style="width: 40px; height: 40px;">
            <q-icon name="trending_up" color="white" size="22px" />
          </div>
          <span class="drawer-brand">Vistra</span>
        </div>
        <div class="drawer-subtitle">Sales Force Automation</div>
      </div>

      <q-separator />

      <q-list class="q-pt-md q-px-sm">
        <q-item
          v-for="item in menuItems"
          :key="item.label"
          clickable
          v-ripple
          :to="item.to"
          exact
          active-class="drawer-active"
          class="drawer-item"
        >
          <q-item-section avatar>
            <q-icon :name="item.icon" size="22px" />
          </q-item-section>
          <q-item-section class="text-weight-medium" style="font-size: 14px;">
            {{ item.label }}
          </q-item-section>
        </q-item>
      </q-list>

      <q-space />

      <div class="q-pa-md">
        <q-btn
          flat
          no-caps
          class="full-width text-left text-negative drawer-item"
          icon="logout"
          label="Keluar"
          @click="logout"
        />
      </div>
    </q-drawer>

    <!-- Page Content -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Bottom Navigation Bar -->
    <q-footer class="bg-white bottom-nav" bordered>
      <div class="bottom-nav__inner">
        <div
          v-for="nav in bottomNavItems"
          :key="nav.label"
          class="bottom-nav__item"
          :class="{ 'bottom-nav__item--active': currentRoute === nav.to }"
          @click="navigateTo(nav.to)"
        >
          <q-icon :name="currentRoute === nav.to ? nav.iconActive : nav.icon" size="24px" />
          <span>{{ nav.label }}</span>
        </div>
      </div>
    </q-footer>

  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const leftDrawerOpen = ref(false)

const userAvatar = ref('https://cdn.quasar.dev/img/avatar.png')

const currentRoute = computed(() => route.path)

const menuItems = [
  { icon: 'dashboard', label: 'Beranda', to: '/dashboard' },
  { icon: 'map', label: 'Rencana Kunjungan', to: '/journey-plan' },
  { icon: 'inventory_2', label: 'Katalog Produk', to: '/products' },
  { icon: 'storefront', label: 'Daftar Outlet', to: '/outlets' },
  { icon: 'assessment', label: 'Laporan Sales & Retur', to: '/reports' },
  { icon: 'sync', label: 'Sinkronisasi Offline', to: '/sync' },
  { icon: 'person', label: 'Profil Saya', to: '/profile' },
]

const bottomNavItems = [
  { icon: 'home', iconActive: 'home', label: 'Beranda', to: '/dashboard' },
  { icon: 'map', iconActive: 'map', label: 'Rencana', to: '/journey-plan' },
  { icon: 'assessment', iconActive: 'assessment', label: 'Laporan', to: '/reports' },
  { icon: 'person', iconActive: 'person', label: 'Profil', to: '/profile' },
]

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function navigateTo(to) {
  router.push(to)
}

function logout() {
  localStorage.removeItem('sales_token')
  localStorage.removeItem('sales_user')
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.main-layout {
  background: var(--vistra-bg);
}

/* Drawer */
.drawer-header {
  padding-bottom: 16px;
}

.drawer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.drawer-brand {
  font-size: 22px;
  font-weight: 800;
  color: var(--vistra-text-primary);
  letter-spacing: -0.5px;
}

.drawer-subtitle {
  font-size: 12px;
  font-weight: 500;
  color: var(--vistra-text-hint);
  margin-top: 6px;
}

.drawer-item {
  border-radius: 12px;
  margin-bottom: 4px;
  min-height: 44px;
}

.drawer-active {
  background: var(--vistra-primary-bg) !important;
  color: var(--vistra-primary) !important;

  .q-icon {
    color: var(--vistra-primary) !important;
  }
}

/* Bottom Navigation */
.bottom-nav {
  box-shadow: 0 -2px 16px rgba(0, 0, 0, 0.06) !important;
  padding: 0;
  background: var(--vistra-surface) !important;
}

.bottom-nav__inner {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 8px 0 6px;
}

.bottom-nav__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  cursor: pointer;
  padding: 4px 12px;
  color: var(--vistra-text-hint);
  transition: color 0.2s ease;

  span {
    font-size: 10px;
    font-weight: 600;
  }
}

.bottom-nav__item--active {
  color: var(--vistra-primary);
}

.bottom-nav__item:active {
  transform: scale(0.92);
}
</style>

<style lang="scss">
/* Global: Make header seamless */
.q-header {
  box-shadow: none !important;
}
</style>
