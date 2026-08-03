<template>
  <Button
    v-bind="attrs"
    :class="mergedClass"
    :text="text"
  >
    <slot />
  </Button>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import Button from 'primevue/button'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  text?: boolean
}>()

const attrs = useAttrs()

const mergedClass = computed(() => {
  let base = 'tt-button'
  if (props.text) {
    base += ' tt-button-text'
  }
  // Add disabled class when button is disabled to control cursor
  if (attrs.disabled) {
    base += ' tt-button-disabled'
  }
  const cls = attrs.class
  if (!cls) return base
  return [base, cls]
})
</script>

<style scoped>
.tt-button-text:hover {
  background: var(--button-hover-bg);
}

.tt-button-disabled,
.tt-button-disabled :deep(.p-button),
.tt-button-disabled :deep(button),
.tt-button-disabled :deep(a) {
  cursor: not-allowed !important;
  pointer-events: auto !important;
}
</style>