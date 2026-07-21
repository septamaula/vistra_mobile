<template>
  <div class="quick-actions">
    <div
      v-for="(action, index) in actions"
      :key="index"
      class="quick-action-item"
      v-ripple
      @click="navigate(action.to)"
    >
      <div class="quick-action-item__icon" :style="{ background: action.bg || 'var(--vistra-primary-bg)' }">
        <q-icon :name="action.icon" :color="action.color || 'primary'" size="34px" />
      </div>
      <div class="quick-action-item__label">{{ action.label }}</div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

defineProps({
  actions: {
    type: Array,
    required: true
    // Each item: { icon, label, to, color?, bg? }
  }
})

const router = useRouter()

function navigate(to) {
  if (to) router.push(to)
}
</script>

<style scoped>
.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.quick-action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 8px 4px;
  cursor: pointer;
  text-align: center;
  border: none;
  border-radius: 12px;
}

.quick-action-item__icon {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.quick-action-item:active .quick-action-item__icon {
  transform: scale(0.9);
}

.quick-action-item__label {
  font-size: 13px;
  font-weight: 600;
  color: var(--vistra-text-secondary);
  line-height: 1.3;
}
</style>
