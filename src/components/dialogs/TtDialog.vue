<template>
  <Dialog
    v-model:visible="visibleModel"
    :header="title"
    :modal="modal"
    :closable="closable"
    :draggable="draggable"
    :dismissableMask="dismissableMask"
    :closeOnEscape="closeOnEscape"
    :breakpoints="breakpoints"
    :style="dialogStyle"
    :class="mergedDialogClass"
    @show="emit('show')"
  >
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>

    <slot />

    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Dialog from 'primevue/dialog'

type Breakpoints = Record<string, string>

interface Props {
  modelValue: boolean
  title?: string
  width?: string
  minWidth?: string
  maxWidth?: string
  height?: string
  maxHeight?: string
  breakpoints?: Breakpoints
  dialogClass?: string | string[] | Record<string, boolean>
  modal?: boolean
  closable?: boolean
  draggable?: boolean
  dismissableMask?: boolean
  closeOnEscape?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  width: '50vw',
  height: 'auto',
  maxHeight: '90vh',
  breakpoints: () => ({
    '960px': '75vw',
    '640px': '95vw',
  }),
  modal: true,
  closable: true,
  draggable: false,
  dismissableMask: false,
  closeOnEscape: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  show: []
}>()

const isFitContent = computed(() => props.height === 'auto')

const mergedDialogClass = computed(() => {
  const base: Record<string, boolean> = {
    'tt-dialog': true,
    'tt-dialog--fit-content': isFitContent.value,
  }

  const extra = props.dialogClass

  if (!extra) return base

  if (typeof extra === 'string') return [base, extra]

  if (Array.isArray(extra)) return [base, ...extra]

  return [base, extra]
})

const dialogStyle = computed(() => {
  const style: Record<string, string> = {
    width: props.width,
    maxHeight: props.maxHeight,
    '--tt-dialog-height': props.height,
    '--tt-dialog-max-height': props.maxHeight,
  }

  if (props.minWidth) style.minWidth = props.minWidth

  if (props.maxWidth) style.maxWidth = props.maxWidth

  if (!isFitContent.value) {
    style.height = props.height
  }

  return style
})

const visibleModel = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})
</script>

