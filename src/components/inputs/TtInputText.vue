<template>
  <TtFieldWrapper
    :label="label"
    :label-layout="labelLayout"
    :required="required"
    :error="fieldError"
    :caption="caption"
    :for-id="inputId"
    :help-text="helpText"
  >
    <InputText
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
import InputText from 'primevue/inputtext'

import TtFieldWrapper from '@/components/forms/TtFieldWrapper.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  errorField?: string
  label?: string
  required?: boolean
  caption?: string
  helpText?: string
  labelLayout?: 'stacked' | 'inline'
}>(), {
  errorField: '',
  label: '',
  required: false,
  caption: '',
  helpText: '',
  labelLayout: 'stacked',
})

const attrs = useAttrs()

const inputId = computed(() => {
  const id = attrs.id
  return typeof id === 'string' && id.trim() ? id : undefined
})

const value = defineModel<string | null>();

const { errorMessage } = props.errorField 
  ? useField<string | null | undefined>(() => props.errorField as string, undefined, {
    syncVModel: true,
  })
  : { errorMessage: null }

const inputAttrs = computed(() => {
  const base = { ...attrs } as Record<string, unknown>
  // class управляем сами через mergedClass, чтобы не дублировать
  delete base.class
  if (props.required && base.required === undefined) {
    base.required = true
  }
  return base
})

const mergedClass = computed(() => {
  const base = 'tt-input-text'
  const cls = attrs.class
  if (!cls) return base
  return [base, cls]
})

const fieldError = computed(() => errorMessage?.value ?? null)
const isInvalid = computed(() => !!errorMessage?.value)
</script>

