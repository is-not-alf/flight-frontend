<template>
  <Toolbar class="tt-toolbar">
    <template #start>
      <slot name="start" />
    </template>
    <template #center>
      <slot name="center" />
    </template>
    <template #end>
      <slot name="end" />
    </template>
  </Toolbar>
</template>

<script setup lang="ts">
import Toolbar from 'primevue/toolbar';

defineOptions({ name: 'TtToolbar' })
</script>

<style scoped>
.tt-toolbar {
  border: none;
  padding: 0;
}
</style>
