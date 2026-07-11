<template>
  <v-progress-circular
    class="m3-progress-circular"
    :color="color === 'primary' ? undefined : color"
    :indeterminate="true"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
// Wrapper around v-progress-circular to strictly enforce M3E primary coloring and styling
withDefaults(defineProps<{
  color?: string
}>(), {
  color: 'primary'
})
</script>

<style scoped>
.m3-progress-circular {
  color: var(--md-sys-color-primary) !important;
  /* Vuetify handles the SVG stroke animation well, but we ensure it uses the token color */
}
</style>
