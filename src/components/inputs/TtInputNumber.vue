<template>
  <TtFieldWrapper
    :label="label"
    :required="required"
    :error="fieldError"
    :caption="caption"
    :for-id="inputId"
    :help-text="helpText"
  >
    <InputNumber 
      v-bind="inputAttrs" 
      v-model="value" 
      :class="mergedClass" 
      :invalid="isInvalid"
    />
  </TtFieldWrapper>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { useField } from 'vee-validate'
import InputNumber from 'primevue/inputnumber'

import TtFieldWrapper from '@/components/forms/TtFieldWrapper.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  errorField?: string
  label?: string
  required?: boolean
  caption?: string
  helpText?: string
}>(), {
  errorField: '',
  label: '',
  required: false,
  caption: '',
  helpText: '',
})

const attrs = useAttrs()

const inputId = computed(() => {
  const id = attrs.id
  return typeof id === 'string' && id.trim() ? id : undefined
})

const inputAttrs = computed(() => {
  const base = { ...attrs } as Record<string, unknown>
  // class управляем сами через mergedClass, чтобы не дублировать
  delete base.class
  if (props.required && base.required === undefined) {
    base.required = true
  }
  // PrimeVue InputNumber по умолчанию округляет до целых, если не заданы дробные знаки.
  if (base.minFractionDigits === undefined && base['min-fraction-digits'] === undefined) {
    base.minFractionDigits = 0
  }
  if (base.maxFractionDigits === undefined && base['max-fraction-digits'] === undefined) {
    base.maxFractionDigits = 2
  }
  return base
})

const value = defineModel<number | null>();

const { errorMessage } = props.errorField 
  ? useField<string | null | undefined>(() => props.errorField as string, undefined, {
    syncVModel: true,
  })
  : { errorMessage: null }

const mergedClass = computed(() => {
  const base = 'tt-input-number'
  const cls = attrs.class
  if (!cls) return base
  return [base, cls]
})

const fieldError = computed(() => errorMessage?.value ?? null)
const isInvalid = computed(() => !!errorMessage?.value)
</script>
