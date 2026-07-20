<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">
    <!-- Seamless Header -->
    <q-header class="bg-transparent text-dark q-pt-md q-px-md">
      <q-toolbar class="q-pa-none">
        <!-- Four dots menu icon -->
        <q-btn flat round dense @click="toggleLeftDrawer" class="text-dark">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="6" height="6" rx="2" fill="currentColor"/>
            <rect x="14" y="4" width="6" height="6" rx="2" fill="currentColor"/>
            <rect x="4" y="14" width="6" height="6" rx="2" fill="currentColor"/>
            <rect x="14" y="14" width="6" height="6" rx="2" fill="currentColor"/>
          </svg>
        </q-btn>
        
        <q-space />

        <!-- User Avatar -->
        <q-avatar size="38px" class="shadow-1 cursor-pointer" @click="logout">
          <img :src="userAvatar" />
        </q-avatar>
      </q-toolbar>
    </q-header>

    <!-- Side Drawer -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-white"
      :width="250"
    >
      <q-list class="q-pt-lg">
        <q-item-label header class="text-weight-bold text-h6 q-mb-md">
          SFA Qiara
        </q-item-label>

        <q-item clickable v-ripple to="/dashboard" exact active-class="text-primary bg-blue-1">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section class="text-weight-medium">Dashboard</q-item-section>
        </q-item>
        
        <q-item clickable v-ripple @click="logout" class="text-negative">
          <q-item-section avatar>
            <q-icon name="logout" color="negative" />
          </q-item-section>
          <q-item-section class="text-weight-medium">Logout</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Page Content -->
    <q-page-container>
      <router-view />
    </q-page-container>
    
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const leftDrawerOpen = ref(false)

const userAvatar = ref('https://cdn.quasar.dev/img/avatar.png')

onMounted(() => {
  const user = localStorage.getItem('sales_user')
  if (user) {
    const parsed = JSON.parse(user)
    if (parsed.FOTO) {
      // Setup URL to point to backend avatar
      userAvatar.value = `http://sales.test/uploads/karyawan/${parsed.FOTO}`
    }
  }
})

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function logout() {
  localStorage.removeItem('sales_token')
  localStorage.removeItem('sales_user')
  router.push('/login')
}
</script>

<style lang="scss">
/* Make header completely seamless by removing shadows from q-header */
.q-header {
  box-shadow: none !important;
}
</style>
