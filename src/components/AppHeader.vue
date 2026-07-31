<template>
  <div class="text-white q-pa-md shadow-2 flex items-center justify-between" style="background: linear-gradient(135deg, #701a1e 0%, #c0152a 100%);">
    <div class="flex items-center">
      <q-btn v-if="showBack" flat round dense icon="arrow_back" color="white" @click="handleBack" class="q-mr-sm" />
      <div>
        <div class="text-subtitle1 text-weight-bold text-uppercase" style="letter-spacing: 0.5px; line-height: 1.2;">
          {{ title }}
        </div>
        <div v-if="subtitle" class="text-caption" style="font-size: 11px; line-height: 1; color: #fca5a5;">
          {{ subtitle }}
        </div>
      </div>
    </div>
    <slot name="actions"></slot>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  showBack: {
    type: Boolean,
    default: true
  },
  backTo: {
    type: String,
    default: ''
  }
})

const router = useRouter()

const handleBack = () => {
  if (props.backTo) {
    router.push(props.backTo)
  } else {
    router.go(-1)
  }
}
</script>
