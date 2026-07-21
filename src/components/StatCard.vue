<template>
  <div class="stat-item" :class="[`stat-item--${layout}`, { 'stat-item--clickable': to }]" @click="navigate">
    <div class="stat-item__icon-wrapper">
      <div class="v-icon-circle stat-icon" :style="{ background: iconBg }">
        <q-icon :name="icon" :color="iconColor" size="26px" />
      </div>
    </div>
    <div class="stat-item__content">
      <div class="stat-item__value">{{ value }}</div>
      <div class="stat-item__label">{{ label }}</div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  icon: { type: String, required: true },
  iconColor: { type: String, default: 'primary' },
  iconBg: { type: String, default: 'var(--vistra-primary-bg)' },
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  layout: { type: String, default: 'vertical' }, // 'vertical' or 'horizontal'
  to: { type: String, default: null }
})

const router = useRouter()

function navigate() {
  if (props.to) router.push(props.to)
}
</script>

<style scoped>
.stat-item {
  background: var(--vistra-surface);
  border-radius: 20px;
  padding: 16px;
  display: flex;
  min-width: 0;
  border: 1px solid rgba(0,0,0,0.03);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}

.stat-item--vertical {
  flex-direction: column;
  align-items: flex-start;
}

.stat-item--horizontal {
  flex-direction: row;
  align-items: center;
  gap: 16px;
}

.stat-item--clickable {
  cursor: pointer;
}

.stat-item--vertical .stat-item__content {
  margin-top: 14px;
}

.stat-item__content {
  display: flex;
  flex-direction: column;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
}

.stat-item__value {
  font-size: 28px;
  font-weight: 800;
  color: var(--vistra-text-primary);
  letter-spacing: -0.5px;
  line-height: 1.1;
}

.stat-item__label {
  font-size: 13px;
  font-weight: 600;
  color: var(--vistra-text-secondary);
  letter-spacing: 0.2px;
  margin-top: 4px;
}
</style>
