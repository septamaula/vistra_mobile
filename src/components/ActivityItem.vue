<template>
  <div class="activity-item" @click="$emit('click')">
    <div class="activity-item__icon v-icon-circle" :style="{ background: iconBg }">
      <q-icon :name="icon" size="20px" :style="{ color: iconAccent }" />
    </div>

    <div class="activity-item__body">
      <div class="activity-item__title">{{ title }}</div>
      <div class="activity-item__subtitle">{{ subtitle }}</div>
    </div>

    <div class="activity-item__meta">
      <div class="activity-item__time">{{ time }}</div>
      <span v-if="status" class="v-badge" :class="`v-badge--${statusType}`">
        {{ status }}
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, default: 'store' },
  iconBg: { type: String, default: 'var(--vistra-primary-bg)' },
  iconAccent: { type: String, default: 'var(--vistra-primary)' },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  time: { type: String, default: '' },
  status: { type: String, default: null },
  statusType: { type: String, default: 'info' } // success | warning | danger | info
})

defineEmits(['click'])
</script>

<style scoped>
.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: var(--vistra-surface);
  border-radius: var(--vistra-radius-md);
  border: 1px solid var(--vistra-border);
  cursor: pointer;
  transition: background 0.2s ease;
}

.activity-item:active {
  background: #f0f4f8;
}

.activity-item__body {
  flex: 1;
  min-width: 0;
}

.activity-item__title {
  font-size: 14px;
  font-weight: 700;
  color: var(--vistra-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.activity-item__subtitle {
  font-size: 12px;
  font-weight: 500;
  color: var(--vistra-text-hint);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.activity-item__meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
}

.activity-item__time {
  font-size: 11px;
  font-weight: 600;
  color: var(--vistra-text-hint);
}
</style>
