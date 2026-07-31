<template>
  <q-page class="dashboard-page">

    <!-- ====== TOP GRADIENT SECTION (header + user card seamless) ====== -->
    <div class="top-gradient-section">

      <!-- User Card (oval detail, sesuai mockup) -->
      <div class="user-card-wrap">
        <div class="user-oval-card">
          <div class="user-oval__avatar">
            <q-icon name="person" size="34px" color="white" />
          </div>
          <div class="user-oval__info">
            <div class="user-oval__name">{{ displayName }}</div>
            <div class="user-oval__id">{{ displayId }}</div>
            <div class="user-oval__date">
              <q-icon name="calendar_today" size="11px" />
              <span>Transaction Date &bull; {{ todayShort }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- ====== CONTENT SECTION (abu muda, rounded atas) ====== -->
    <div class="content-wrap">

      <!-- YOUR ACTIVITY -->
      <div class="content-section">
        <div class="section-label">
          <div class="section-label__bar"></div>
          <span>YOUR ACTIVITY</span>
        </div>

        <div class="activity-card">
          <div class="activity-card__body">
            <div class="activity-card__icon-wrap">
              <q-icon name="store" size="30px" color="red-8" />
            </div>
            <div class="activity-card__text">
              <div class="activity-card__title">Back to Office</div>
              <div class="activity-card__desc">
                This activity is done when all visits have been transacted. Please input your odometer at below.
              </div>
            </div>
            <q-icon name="location_on" size="26px" color="red-7" class="flex-shrink-0" />
          </div>

          <div class="activity-card__actions">
            <q-btn
              label="Visit Customer"
              icon-right="chevron_right"
              unelevated no-caps no-wrap
              class="activity-btn activity-btn--red"
              @click="go('/journey-plan')"
            />
            <q-btn
              label="Back to Office"
              icon-right="chevron_right"
              outline no-caps no-wrap
              class="activity-btn activity-btn--outline"
              @click="doLogout"
            />
          </div>
        </div>
      </div>

      <!-- GENERAL -->
      <div class="content-section" style="margin-top: 10px;">
        <div class="section-label">
          <div class="section-label__bar"></div>
          <span>GENERAL</span>
        </div>

        <div class="general-list">
          <div
            v-for="(item, i) in generalItems"
            :key="i"
            class="general-item"
            v-ripple
            @click="go(item.route)"
          >
            <div class="general-item__icon-wrap">
              <q-icon :name="item.icon" size="20px" color="red-8" />
            </div>
            <div class="general-item__label">{{ item.label }}</div>
            <div class="general-item__badge" :class="item.count > 0 ? 'badge--red' : 'badge--grey'">
              {{ item.count }}
            </div>
            <q-icon name="chevron_right" size="18px" color="grey-4" />
          </div>
        </div>
      </div>

      <!-- EFFECTIVE CALL -->
      <div class="ec-section">
        <div class="section-label">
          <div class="section-label__bar"></div>
          <span>EFFECTIVE CALL</span>
        </div>
        <div class="ec-row">
          <div class="ec-item">
            <div class="ec-item__label">Total EC</div>
            <div class="ec-item__value">{{ ec.total }}</div>
          </div>
          <div class="ec-div"></div>
          <div class="ec-item">
            <div class="ec-item__label">EC Route</div>
            <div class="ec-item__value">{{ ec.route }}</div>
          </div>
          <div class="ec-div"></div>
          <div class="ec-item">
            <div class="ec-item__label">EC Non Route</div>
            <div class="ec-item__value">{{ ec.nonRoute }}</div>
          </div>
        </div>
      </div>

      <div style="height: 20px;"></div>
    </div>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../boot/axios'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q     = useQuasar()

function go(to) { router.push(to) }

// ── User data from localStorage ──
const storedUser = computed(() => {
  try { return JSON.parse(localStorage.getItem('sales_user') || '{}') } catch { return {} }
})

const displayName = computed(() => {
  const u = storedUser.value
  return (u.NAMA || u.name || 'Sales Vistra').toUpperCase()
})

const displayId = computed(() => {
  const u = storedUser.value
  return u.NIK || u.email?.split('@')[0]?.toUpperCase() || '-'
})

const todayShort = computed(() =>
  new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
)

// ── Dashboard data (reactive) ──
const loading = ref(true)
const generalItems = ref([
  { icon: 'event_note',     label: 'Call Plan',        count: 0, route: '/journey-plan' },
  { icon: 'route',          label: 'Non Route',        count: 0, route: '/journey-plan' },
  { icon: 'group',          label: 'Actual Route',     count: 0, route: '/journey-plan' },
  { icon: 'people_outline', label: 'Actual Non Route', count: 0, route: '/journey-plan' },
  { icon: 'support_agent',  label: 'Total Call',       count: 0, route: '/visit'        },
  { icon: 'do_not_disturb', label: 'Not Visit',        count: 0, route: '/visit'        },
])

const ec = ref({ total: 0, route: 0, nonRoute: 0 })

// ── Fetch from API ──
onMounted(async () => {
  try {
    const res = await api.get('/dashboard')
    if (res.data.success) {
      const g = res.data.general
      generalItems.value[0].count = g.call_plan
      generalItems.value[1].count = g.non_route
      generalItems.value[2].count = g.actual_route
      generalItems.value[3].count = g.actual_non_route
      generalItems.value[4].count = g.total_call
      generalItems.value[5].count = g.not_visit

      const e = res.data.effective_call
      ec.value = { total: e.total, route: e.route, nonRoute: e.non_route }
    }
  } catch (err) {
    console.error('Dashboard API error:', err)
  } finally {
    loading.value = false
  }
})

// ── Logout ──
async function doLogout() {
  try { await api.post('/logout') } catch { /* ignore */ }
  localStorage.removeItem('sales_token')
  localStorage.removeItem('sales_user')
  $q.notify({ type: 'info', message: 'Berhasil keluar', position: 'top', timeout: 1500 })
  router.push('/login')
}
</script>

<style lang="scss" scoped>
/* ── PAGE ── */
.dashboard-page {
  background: #efefef;
  min-height: 100vh;
  padding: 0;
}

/* ── TOP GRADIENT (seamless dengan header) ── */
.top-gradient-section {
  /* Mulai dari warna ujung header (#350007) agar tidak ada garis → ke merah terang */
  background: linear-gradient(180deg, #350007 0%, #7a000e 50%, #c0152a 80%, #d01e33 100%);
  padding-top: 8px;
  padding-bottom: 28px;
  padding-left: 16px;
  padding-right: 16px;
}

/* ── USER OVAL CARD ── */
.user-card-wrap {
  margin-top: 8px;
}

.user-oval-card {
  background: rgba(0, 0, 0, 0.25);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  backdrop-filter: blur(4px);
}

.user-oval__avatar {
  width: 54px;
  height: 54px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-oval__info {
  flex: 1;
}

.user-oval__name {
  font-size: 16px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.5px;
}

.user-oval__id {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);
  margin-top: 3px;
}

.user-oval__date {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.55);
  margin-top: 5px;
}

/* ── CONTENT WRAP (rounded top, abu muda) ── */
.content-wrap {
  background: #efefef;
  border-radius: 24px 24px 0 0;
  margin-top: -20px;
  padding: 16px 12px 0;
  position: relative;
  z-index: 2;
}

/* ── SECTION ── */
.content-section {
  background: #fff;
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 0;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 11.5px;
  font-weight: 700;
  color: #222;
  letter-spacing: 0.4px;
}

.section-label__bar {
  width: 4px;
  height: 15px;
  background: #c0152a;
  border-radius: 2px;
  flex-shrink: 0;
}

/* ── ACTIVITY CARD ── */
.activity-card {
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
  background: #fafafa;
}

.activity-card__body {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
}

.activity-card__icon-wrap {
  width: 44px;
  height: 44px;
  background: rgba(192, 21, 42, 0.08);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-card__text { flex: 1; }

.activity-card__title {
  font-size: 13px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.activity-card__desc {
  font-size: 11px;
  color: #888;
  line-height: 1.5;
}

.activity-card__actions {
  display: flex;
  gap: 8px;
  padding: 10px 12px;
  border-top: 1px solid #f0f0f0;
}

.activity-btn {
  flex: 1;
  border-radius: 8px;
  font-size: 11.5px;
  font-weight: 600;
  height: 38px;
  padding: 0 4px;
}

.activity-btn--red {
  background: #c0152a !important;
  color: #fff !important;
}

.activity-btn--outline {
  border: 1.5px solid #c0152a !important;
  color: #c0152a !important;
}

/* ── GENERAL LIST ── */
.general-list {
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
}

.general-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 12px;
  cursor: pointer;
  transition: background 0.15s;
  position: relative;

  &:not(:last-child) { border-bottom: 1px solid #f5f5f5; }
  &:active { background: #fafafa; }
}

.general-item__icon-wrap {
  width: 34px;
  height: 34px;
  background: rgba(192, 21, 42, 0.07);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.general-item__label {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: #2d2d2d;
}

.general-item__badge {
  min-width: 26px;
  height: 22px;
  font-size: 11px;
  font-weight: 700;
  border-radius: 11px;
  padding: 0 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.badge--red  { background: #c0152a; }
.badge--grey { background: #c0152a; }

/* ── EFFECTIVE CALL ── */
.ec-section {
  background: #fff;
  border-radius: 14px;
  padding: 14px;
  margin-top: 10px;
}

.ec-row {
  display: flex;
  align-items: center;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
}

.ec-item {
  flex: 1;
  padding: 14px 6px;
  text-align: center;
}

.ec-item__label {
  font-size: 11px;
  color: #888;
  font-weight: 500;
  margin-bottom: 6px;
}

.ec-item__value {
  font-size: 22px;
  font-weight: 800;
  color: #1a1a1a;
}

.ec-div {
  width: 1px;
  height: 44px;
  background: #ebebeb;
}
</style>
