<template>
  <v-progress-linear
    class="m3-progress-linear"
    :color="color === 'primary' ? undefined : color"
    :indeterminate="true"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
// Wrapper around v-progress-linear to strictly enforce M3E primary coloring and styling
withDefaults(defineProps<{
  color?: string
}>(), {
  color: 'primary'
})
</script>

<style scoped>
.m3-progress-linear {
  border-radius: var(--md-sys-shape-corner-full);
}
.m3-progress-linear :deep(.v-progress-linear__background) {
  background-color: var(--md-sys-color-surface-container-highest) !important;
}
.m3-progress-linear :deep(.v-progress-linear__determinate),
.m3-progress-linear :deep(.v-progress-linear__indeterminate) {
  background-color: var(--md-sys-color-primary) !important;
}
</style>
