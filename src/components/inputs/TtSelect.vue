<template>
  <TtFieldWrapper
    :label="label"
    :label-layout="labelLayout"
    :required="required"
    :error="fieldError"
    :for-id="inputId"
    :help-text="helpText"
    :class="mergedClass"
  >
    <Select
      v-model="value"
      emptyMessage="Нет значений"
      :optionLabel="optionLabel"
      :optionValue="dataKey ? '' : optionValue"
      :dataKey="dataKey"
      :placeholder="placeholder ?? 'Выберите значение'"
      :invalid="isInvalid"
      :showClear="isShowClear"
      v-bind="inputAttrs"
    />
  </TtFieldWrapper>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { useField } from 'vee-validate'
import Select from 'primevue/select'

import TtFieldWrapper from '@/components/forms/TtFieldWrapper.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  errorField?: string
  optionLabel?: string
  optionValue?: string
  dataKey?: string
  label?: string
  required?: boolean
  showClear?: boolean
  helpText?: string
  labelLayout?: 'stacked' | 'inline'
  placeholder?: string | null
}>(), {
  errorField: '',
  optionLabel: 'label',
  optionValue: 'id',
  dataKey: 'id',
  label: '',
  required: false,
  helpText: '',
  labelLayout: 'stacked',
  placeholder: null,
})

const attrs = useAttrs()

const inputId = computed(() => {
  const id = attrs.id
  return typeof id === 'string' && id.trim() ? id : undefined
})

const inputAttrs = computed(() => {
  const base = { ...attrs } as Record<string, unknown>
  delete base.class
  delete base.optionLabel
  delete base.optionValue
  delete base['option-label']
  delete base['option-value']
  if (props.required && base.required === undefined) {
    base.required = true
  }
  return base
})

const value = defineModel<any>();

const { errorMessage } = props.errorField 
  ? useField<string | null | undefined>(() => props.errorField as string, undefined, {
    syncVModel: true,
  })
  : { errorMessage: null }

const mergedClass = computed(() => {
  const base = 'tt-select'
  const cls = attrs.class
  if (!cls) return base
  return [base, cls]
})

const fieldError = computed(() => errorMessage?.value ?? null)
const isInvalid = computed(() => !!errorMessage?.value)
/** undefined — авто: clear для необязательных полей; false — явно скрыть; true — явно показать */
const isShowClear = computed(() => {
  if (props.showClear !== undefined) {
    return props.showClear
  }
  return !props.required
})
</script>

