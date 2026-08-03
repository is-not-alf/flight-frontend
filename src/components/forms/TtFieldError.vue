<template>
  <small v-if="error" class="tt-small-error">{{ error }}</small>
</template>

<script setup lang="ts">
defineProps<{
  error?: string | null
}>()
</script>

<style scoped>
.tt-small-error {
  margin-top: -0.5rem;
  font-size: 0.75rem;
  color: var(--p-red-500);
}
</style>