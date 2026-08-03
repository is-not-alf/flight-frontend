<template>
  <div
    class="tt-field"
    :class="{
      'tt-field--inline': labelLayout === 'inline',
      'tt-field--stacked': labelLayout === 'stacked',
    }"
  >
    <template v-if="labelLayout === 'inline'">
      <div class="tt-field__inline-row">
        <div v-if="label" class="tt-field__label-row">
          <label :for="forId" class="tt-field__label">
            {{ label }}
            <span v-if="required" class="tt-field__required">*</span>
          </label>
          <span
            v-if="helpText"
            class="tt-field__help pi pi-question-circle"
            v-tooltip="helpText"
          />
        </div>
        <div class="tt-field__control">
          <slot />
        </div>
      </div>
    </template>

    <template v-else>
      <div v-if="label" class="tt-field__label-row">
        <label :for="forId" class="tt-field__label">
          {{ label }}
          <span v-if="required" class="tt-field__required">*</span>
        </label>
        <span
          v-if="helpText"
          class="tt-field__help pi pi-question-circle"
          v-tooltip="helpText"
        />
      </div>

      <slot />
    </template>

    <TtFieldError :error="error" />
    <small v-if="caption" class="tt-field__caption">{{ caption }}</small>
  </div>
</template>

<script setup lang="ts">
import TtFieldError from '@/components/forms/TtFieldError.vue'

export type TtFieldLabelLayout = 'stacked' | 'inline'

withDefaults(defineProps<{
  label?: string
  required?: boolean
  error?: string | null
  caption?: string
  forId?: string
  helpText?: string
  /** stacked — label над полем; inline — label слева от поля в одной строке */
  labelLayout?: TtFieldLabelLayout
}>(), {
  label: '',
  required: false,
  error: '',
  caption: '',
  forId: '',
  helpText: '',
  labelLayout: 'stacked',
})
</script>

<style scoped>
.tt-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 0;
  /* margin-bottom: 1rem; */
}

.tt-field--inline {
  margin-bottom: 0;
}

.tt-field__inline-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

.tt-field__control {
  flex: 1;
  min-width: 0;
}

.tt-field__label {
  font-weight: 500;
  color: var(--p-text-color);
}

.tt-field--inline .tt-field__label {
  font-weight: 400;
  color: var(--p-text-color-secondary);
  font-size: 0.875rem;
  white-space: nowrap;
}

.tt-field__label-row {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.tt-field__required {
  color: var(--p-red-500, #ef4444);
  margin-left: 0rem;
}

.tt-field__help {
  font-size: 0.95em;
  color: var(--p-yellow-500, #f59e0b);
  cursor: help;
}

.tt-field__caption {
  color: var(--p-text-color-secondary);
  font-size: 0.85rem;
}
</style>
