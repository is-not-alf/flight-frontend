<template>
  <DataTable
    ref="tableRef"
    v-bind="attrs"
    :value="value?.content ?? value ?? []"
    :rows="rows"
    :rowsPerPageOptions="rowsPerPageOptions"
    :class="mergedClass"
    :loading="loading"
    :totalRecords="totalRecords"
    stripedRows
    @page="emit('page', $event)"
  >
    <slot />
  </DataTable>
</template>

<script setup lang="ts">
import { computed, useAttrs, onMounted, onUnmounted } from 'vue'
import DataTable from 'primevue/datatable'

defineOptions({ inheritAttrs: false })

interface Props {
  value?: any
  rows?: number
  rowsPerPageOptions?: number[]
  loading?: boolean
  totalRecords?: number
}

const props = withDefaults(defineProps<Props>(), {
  value: null,
  rows: 10,
  rowsPerPageOptions: () => [5, 10, 20, 50],
  loading: false,
  totalRecords: 0,
})

const emit = defineEmits<{
  (e: 'page', event: any): void
}>()

const attrs = useAttrs()

const mergedClass = computed(() => {
  const base = ['tt-datatable', 'p-datatable-sm']
  const cls = attrs.class
  if (!cls) return base
  return [...base, cls as any]
})

onMounted(() => {
  
})

onUnmounted(() => {
  
})

</script>

<style scoped>
.tt-datatable {
  min-height: 0;
}

.tt-datatable-header {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;
}

.tt-datatable-header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.tt-datatable-header-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.tt-datatable :deep(.p-datatable-header) {
  position: relative;
  z-index: 2;
  background: var(--surface-card);
}

.tt-datatable :deep(.p-datatable-loading-overlay) {
  z-index: 1;
  top: var(--tt-datatable-header-height, 0px);
  height: calc(100% - var(--tt-datatable-header-height, 0px));
}

.tt-datatable :deep(.p-datatable-thead > tr > th) {
  border-top: 1px solid var(--surface-border);
  border-bottom: 1px solid var(--surface-border);
  border-right: 1px solid var(--surface-border);
}

.tt-datatable :deep(.p-datatable-thead > tr > th:first-child) {
  border-left: 1px solid var(--surface-border);
}
</style>
