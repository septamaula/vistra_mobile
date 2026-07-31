<template>
  <q-page class="jp-page">

    <!-- ── SUB HEADER (sits below MainLayout header) ── -->
    <div class="jp-subheader">
      <q-btn flat round icon="arrow_back" color="white" size="sm" @click="$router.push('/dashboard')" />
      <span class="jp-subheader__title">LIST KUNJUNGAN</span>
      <div style="width:36px" />
    </div>

    <!-- ── PAGE CONTENT ── -->
    <div class="jp-body">

      <!-- Date Selector Card -->
      <div class="date-card" @click="toggleDatePicker">
        <div class="date-card__left">
          <q-icon name="calendar_today" size="18px" color="red-8" />
          <div class="date-card__texts">
            <div class="date-card__main">{{ selectedLabel }}</div>
            <div class="date-card__sub">{{ selectedFormatted }}</div>
          </div>
        </div>
        <q-icon
          :name="showPicker ? 'close' : 'calendar_month'"
          size="20px"
          :color="showPicker ? 'red-8' : 'grey-4'"
        />
      </div>

      <!-- Date Picker Dropdown -->
      <transition name="slide-down">
        <div v-if="showPicker" class="date-dropdown">
          <div class="date-dropdown__title">PILIH HARI</div>

          <div
            v-for="opt in dateOptions"
            :key="opt.key"
            class="date-dropdown__item"
            :class="{ 'date-dropdown__item--active': selectedDate === opt.value }"
            @click="pickDate(opt)"
          >
            <div>
              <div class="date-dropdown__item-main">{{ opt.label }}</div>
              <div class="date-dropdown__item-sub">{{ opt.formatted }}</div>
            </div>
            <q-icon v-if="selectedDate === opt.value" name="check" color="red-8" size="18px" />
          </div>

          <!-- Custom date -->
          <div class="date-dropdown__item" @click="showCustomDate = true">
            <div class="date-dropdown__item-main">Pilih Tanggal</div>
            <q-icon name="calendar_month" color="grey-5" size="18px" />
          </div>
        </div>
      </transition>

      <!-- Custom Date Dialog -->
      <q-dialog v-model="showCustomDate">
        <q-date
          v-model="customDate"
          mask="YYYY-MM-DD"
          color="red-8"
          @update:model-value="onCustomDate"
        />
      </q-dialog>

      <!-- Loading -->
      <div v-if="loading" class="flex flex-center q-py-xl">
        <q-spinner-dots color="red-8" size="44px" />
      </div>

      <template v-else>

        <!-- Stats Row -->
        <div class="stats-row">
          <div class="stats-col">
            <q-icon name="calendar_today" size="18px" color="red-8" />
            <div class="stats-col__val">{{ allPlans.length }} Outlet</div>
            <div class="stats-col__label">Total Kunjungan</div>
          </div>
          <div class="stats-div" />
          <div class="stats-col">
            <q-icon name="check_circle" size="18px" color="green-6" />
            <div class="stats-col__val">{{ selesaiCount }} Outlet</div>
            <div class="stats-col__label">Selesai</div>
          </div>
          <div class="stats-div" />
          <div class="stats-col">
            <q-icon name="hourglass_empty" size="18px" color="orange-7" />
            <div class="stats-col__val">{{ sisaCount }} Outlet</div>
            <div class="stats-col__label">Sisa</div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="jp-tabs">
          <div
            v-for="tab in computedTabs"
            :key="tab.key"
            class="jp-tab"
            :class="{ 'jp-tab--active': activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            {{ tab.label }} ({{ tab.count }})
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="filteredPlans.length === 0" class="jp-empty">
          <q-icon name="event_busy" size="52px" color="grey-4" />
          <div>Tidak ada data kunjungan</div>
        </div>

        <!-- Visit List -->
        <div v-else class="visit-list">
          <div
            v-for="(plan, idx) in filteredPlans"
            :key="plan.PLAN_ID || idx"
            class="visit-item"
            v-ripple
            @click="goToDetail(plan, idx)"
          >
            <!-- Number badge -->
            <div class="visit-num">{{ idx + 1 }}</div>

            <!-- Info -->
            <div class="visit-info">
              <div class="visit-info__row1">
                <span class="visit-info__name">
                  {{ plan.outlet?.NAMA_OUTLET || plan.NAMA_OUTLET || '-' }}
                </span>
                <div class="visit-info__right">
                  <span class="visit-info__time">{{ formatTime(plan.ESTIMASI_JAM) }}</span>
                  <q-icon name="chevron_right" size="16px" color="grey-4" />
                </div>
              </div>

              <div class="visit-info__addr">
                <q-icon name="location_on" size="12px" color="red-7" class="flex-shrink-0" />
                <span>{{ plan.outlet?.ALAMAT || plan.ALAMAT || '-' }}</span>
              </div>

              <div class="visit-info__row3">
                <div class="visit-info__dist">
                  <q-icon name="near_me" size="12px" color="grey-4" />
                  <span>{{ plan.JARAK ? plan.JARAK + ' km' : '-' }}</span>
                </div>
                <div
                  v-if="statusOf(plan).key !== 'belum'"
                  class="visit-badge"
                  :class="statusOf(plan).cls"
                >
                  {{ statusOf(plan).label }}
                </div>
                <div v-else class="visit-badge visit-badge--plain">Belum Dikunjungi</div>
              </div>
            </div>
          </div>
        </div>

      </template>
    </div>

    <!-- ── BOTTOM BUTTON ── -->
    <div class="jp-footer">
      <q-btn
        label="Lihat Rute di Peta"
        icon="map"
        unelevated no-caps no-wrap
        class="jp-btn-map"
        @click="openMap"
      />
    </div>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from '../boot/axios'

const router = useRouter()
const $q     = useQuasar()

// ── Date helpers ──────────────────────────────────────────────
function toYMD (d) { return d.toISOString().split('T')[0] }
function fmtId (d) {
  return new Date(d).toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })
}

const today     = new Date()
const todayYMD  = toYMD(today)

const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1)
const tomorrow  = new Date(today); tomorrow.setDate(today.getDate() + 1)

const dateOptions = [
  { key: 'today',     label: 'Hari Ini',  value: todayYMD,           formatted: fmtId(todayYMD)  },
  { key: 'yesterday', label: 'Kemarin',   value: toYMD(yesterday),   formatted: fmtId(toYMD(yesterday)) },
  { key: 'tomorrow',  label: 'Besok',     value: toYMD(tomorrow),    formatted: fmtId(toYMD(tomorrow))  },
]

// ── State ─────────────────────────────────────────────────────
const selectedDate  = ref(todayYMD)
const selectedLabel = computed(() => dateOptions.find(o => o.value === selectedDate.value)?.label ?? 'Pilih Tanggal')
const selectedFormatted = computed(() => fmtId(selectedDate.value))

const showPicker     = ref(false)
const showCustomDate  = ref(false)
const customDate     = ref(todayYMD)

const loading   = ref(true)
const allPlans  = ref([])
const activeTab = ref('semua')
const headerId  = ref(null)

// ── Computed stats ────────────────────────────────────────────
const selesaiCount = computed(() => allPlans.value.filter(p => statusOf(p).key === 'selesai').length)
const sisaCount    = computed(() => allPlans.value.length - selesaiCount.value)

const computedTabs = computed(() => [
  { key: 'semua',    label: 'Semua',    count: allPlans.value.length },
  { key: 'selesai',  label: 'Selesai',  count: selesaiCount.value },
  { key: 'tertunda', label: 'Tertunda', count: allPlans.value.filter(p => statusOf(p).key === 'tertunda').length },
])

const filteredPlans = computed(() => {
  if (activeTab.value === 'semua') return allPlans.value
  return allPlans.value.filter(p => statusOf(p).key === activeTab.value)
})

// ── Status mapping ────────────────────────────────────────────
function statusOf (plan) {
  const s = (plan.visit?.STATUS_VISIT || plan.visit?.STATUS_KUNJUNGAN || plan.STATUS || '').toLowerCase()
  if (s === 'completed' || s === 'checkout' || s === 'closed' || s === 'selesai' || s === 'no order' || s === 'no-order') {
    return { key: 'selesai', label: 'Selesai', cls: 'visit-badge--green' }
  }
  if (s === 'visited' || s === 'check-in' || s === 'checked-in') {
    return { key: 'tertunda', label: 'Proses Visit (Belum Checkout)', cls: 'visit-badge--orange' }
  }
  if (s === 'pending' || s === 'tertunda') {
    return { key: 'tertunda', label: 'Tertunda', cls: 'visit-badge--orange' }
  }
  return { key: 'belum', label: 'Belum Dikunjungi', cls: '' }
}

function formatTime (t) {
  if (!t) return ''
  return String(t).slice(0, 5)
}

// ── API fetch ─────────────────────────────────────────────────
async function fetchPlans () {
  loading.value = true
  allPlans.value = []
  headerId.value = null
  try {
    const res = await api.get('/journey-plans', { params: { date: selectedDate.value } })
    if (res.data.success && res.data.data) {
      allPlans.value = res.data.data.plans ?? []
      headerId.value = res.data.data.HEADER_ID ?? null
    }
  } catch (e) {
    console.error('Journey plan error:', e)
  } finally {
    loading.value = false
  }
}

// ── Actions ───────────────────────────────────────────────────
function toggleDatePicker () { showPicker.value = !showPicker.value }

function pickDate (opt) {
  selectedDate.value = opt.value
  showPicker.value   = false
}

function onCustomDate (val) {
  if (val) {
    selectedDate.value   = val
    showPicker.value     = false
    showCustomDate.value  = false
  }
}

function goToDetail (plan, idx) {
  const planId = plan.PLAN_ID || plan.plan_id || (idx + 1)
  const visitId = plan.visit?.VISIT_ID || plan.visit?.visit_id || plan.VISIT_ID || plan.visit_id || planId
  const name = plan.outlet?.NAMA_OUTLET || plan.NAMA_OUTLET || ''
  const addr = plan.outlet?.ALAMAT || plan.ALAMAT || ''
  const status = plan.visit?.STATUS_VISIT || plan.STATUS || ''
  const dist = plan.JARAK || '0.05'

  router.push({
    path: `/journey-plan/${visitId}`,
    query: {
      visit_id: visitId,
      plan_id: planId,
      outlet_name: name,
      outlet_addr: addr,
      distance: dist,
      status: status
    }
  })
}

function openMap () {
  if (headerId.value) {
    router.push(`/journey-plan-map/${headerId.value}`)
  } else {
    $q.notify({ type: 'warning', message: 'Tidak ada data rute untuk tanggal ini', position: 'top' })
  }
}

// ── Watch date change ─────────────────────────────────────────
watch(selectedDate, () => fetchPlans())

onMounted(() => fetchPlans())
</script>

<style lang="scss" scoped>

/* ── PAGE ── */
.jp-page {
  background: #f2f2f2;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-bottom: 70px; /* space for footer button */
}

/* ── SUB HEADER (below MainLayout header, red gradient) ── */
.jp-subheader {
  background: linear-gradient(180deg, #350007 0%, #7a000e 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
}

.jp-subheader__title {
  font-size: 15px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 1px;
}

/* ── BODY ── */
.jp-body {
  flex: 1;
  padding: 12px 12px 0;
}

/* ── DATE CARD ── */
.date-card {
  background: #fff;
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  margin-bottom: 8px;
}

.date-card__left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.date-card__texts { line-height: 1.2; }

.date-card__main {
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
}

.date-card__sub {
  font-size: 11px;
  color: #888;
  margin-top: 2px;
}

/* ── DATE DROPDOWN ── */
.date-dropdown {
  background: #fff;
  border-radius: 14px;
  padding: 8px 0;
  margin-bottom: 10px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.date-dropdown__title {
  font-size: 10.5px;
  font-weight: 700;
  color: #aaa;
  letter-spacing: 0.8px;
  padding: 6px 16px 8px;
}

.date-dropdown__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.15s;
  &:active { background: #fafafa; }
  &--active { background: rgba(192,21,42,0.04); }
}

.date-dropdown__item-main {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

.date-dropdown__item-sub {
  font-size: 11px;
  color: #999;
  margin-top: 2px;
}

/* ── STATS ROW ── */
.stats-row {
  background: #fff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  padding: 12px 8px;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.stats-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
}

.stats-col__val {
  font-size: 13px;
  font-weight: 800;
  color: #1a1a1a;
}

.stats-col__label {
  font-size: 10px;
  color: #888;
  font-weight: 500;
}

.stats-div {
  width: 1px;
  height: 36px;
  background: #ebebeb;
}

/* ── TABS ── */
.jp-tabs {
  display: flex;
  gap: 0;
  background: #fff;
  border-radius: 12px 12px 0 0;
  overflow: hidden;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 0;
}

.jp-tab {
  flex: 1;
  text-align: center;
  padding: 11px 4px;
  font-size: 12px;
  font-weight: 600;
  color: #999;
  cursor: pointer;
  border-bottom: 2.5px solid transparent;
  transition: all 0.2s;

  &--active {
    color: #c0152a;
    border-bottom-color: #c0152a;
  }
}

/* ── EMPTY ── */
.jp-empty {
  background: #fff;
  text-align: center;
  padding: 40px 20px;
  color: #bbb;
  font-size: 13px;
  border-radius: 0 0 12px 12px;

  .q-icon { display: block; margin: 0 auto 12px; }
}

/* ── VISIT LIST ── */
.visit-list {
  background: #fff;
  border-radius: 0 0 14px 14px;
  overflow: hidden;
}

.visit-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 13px 14px;
  cursor: pointer;
  position: relative;
  transition: background 0.15s;

  &:not(:last-child) { border-bottom: 1px solid #f5f5f5; }
  &:active { background: #fafafa; }
}

.visit-num {
  width: 26px;
  height: 26px;
  min-width: 26px;
  background: #c0152a;
  border-radius: 50%;
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}

.visit-info {
  flex: 1;
  min-width: 0;
}

.visit-info__row1 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  margin-bottom: 4px;
}

.visit-info__name {
  font-size: 13.5px;
  font-weight: 700;
  color: #1a1a1a;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.visit-info__right {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}

.visit-info__time {
  font-size: 11.5px;
  font-weight: 600;
  color: #555;
}

.visit-info__addr {
  display: flex;
  align-items: flex-start;
  gap: 3px;
  font-size: 11px;
  color: #888;
  margin-bottom: 5px;
  line-height: 1.4;
}

.visit-info__row3 {
  display: flex;
  align-items: center;
  gap: 8px;
}

.visit-info__dist {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  color: #aaa;
}

/* ── STATUS BADGES ── */
.visit-badge {
  font-size: 10.5px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
}

.visit-badge--green {
  background: rgba(34, 197, 94, 0.12);
  color: #16a34a;
}

.visit-badge--orange {
  background: rgba(251, 146, 60, 0.15);
  color: #ea580c;
}

.visit-badge--plain {
  color: #aaa;
  font-size: 10.5px;
  font-weight: 500;
}

/* ── BOTTOM BUTTON ── */
.jp-footer {
  position: fixed;
  bottom: 62px; /* above bottom nav */
  left: 0;
  right: 0;
  padding: 10px 16px;
  background: linear-gradient(0deg, #fff 80%, transparent);
  z-index: 10;
}

.jp-btn-map {
  width: 100%;
  background: #c0152a !important;
  color: #fff !important;
  border-radius: 12px;
  height: 48px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.3px;
}

/* ── TRANSITION ── */
.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.2s ease;
}
.slide-down-enter-from, .slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
