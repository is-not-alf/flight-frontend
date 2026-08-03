<template>
  <TtFieldWrapper
    :label="label"
    :error="fieldError"
    :caption="caption"
    :for-id="inputId"
    :required="required"
  >
    <DatePicker 
      v-model="value"
      showClear
      showTime
      showIcon
      showButtonBar
      hourFormat="24"
      dateFormat="yy-mm-dd"
      iconDisplay="input"
      panelClass="compact-calendar" 
      :class="mergedClass"
      :invalid="isInvalid"
      :placeholder="placeholder ?? 'Выберите дату'"
      v-bind="inputAttrs"
    />
  </TtFieldWrapper>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { useField } from 'vee-validate'
import DatePicker from 'primevue/datepicker';

import TtFieldWrapper from '@/components/forms/TtFieldWrapper.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  errorField?: string
  label?: string
  caption?: string
  required?: boolean
  placeholder?: string | null
}>(), {
  errorField: 'Неверная дата',
  label: undefined,
  caption: undefined,
  required: false,
  placeholder: null,
})

const attrs = useAttrs()

const inputId = computed(() => {
  const id = attrs.id
  return typeof id === 'string' && id.trim() ? id : undefined
})

const value = defineModel<Date | null>();

const { errorMessage } = props.errorField 
  ? useField<Date | null | undefined>(() => props.errorField as string, undefined, {
    syncVModel: true,
  })
  : { errorMessage: null }

const inputAttrs = computed(() => {
  const base = { ...attrs } as Record<string, unknown>
  // class управляем сами через mergedClass, чтобы не дублировать
  delete base.class
  return base
})

const mergedClass = computed(() => {
  const base = 'tt-date-picker'
  const cls = attrs.class
  if (!cls) return base
  return [base, cls]
})

const fieldError = computed(() => errorMessage?.value ?? null)
const isInvalid = computed(() => !!errorMessage?.value)
</script>