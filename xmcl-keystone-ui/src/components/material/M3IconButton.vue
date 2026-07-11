<template>
  <v-btn
    icon
    class="m3-icon-button"
    :class="[
      `m3-icon-button--${variant}`,
      { 'm3-icon-button--toggle': isToggle }
    ]"
    :variant="vuetifyVariant"
    :elevation="0"
    :ripple="true"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <v-icon :icon="icon" :class="{ 'm3-icon-button__icon--active': active }" />
  </v-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'standard' | 'filled' | 'tonal' | 'outlined'
  icon: string
  isToggle?: boolean
  active?: boolean
  disabled?: boolean
}>(), {
  variant: 'standard',
  isToggle: false,
  active: false,
  disabled: false
})

const vuetifyVariant = computed(() => {
  switch (props.variant) {
    case 'filled': return 'flat'
    case 'tonal': return 'tonal'
    case 'outlined': return 'outlined'
    case 'standard':
    default: return 'text'
  }
})
</script>

<style scoped>
.m3-icon-button {
  border-radius: var(--md-sys-shape-corner-full) !important;
  width: 40px !important;
  height: 40px !important;
  min-width: 40px !important;
  padding: 0 !important;
  transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard) !important;
  color: var(--md-sys-color-on-surface-variant) !important;
}

.m3-icon-button .v-icon {
  font-size: var(--md-sys-icon-size-medium) !important;
  /* Icon fill transitions */
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  transition: font-variation-settings var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
}

.m3-icon-button .m3-icon-button__icon--active {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Variant Overrides */
.m3-icon-button--filled {
  background-color: var(--md-sys-color-primary) !important;
  color: var(--md-sys-color-on-primary) !important;
}

.m3-icon-button--tonal {
  background-color: var(--md-sys-color-surface-container-highest) !important;
  color: var(--md-sys-color-on-surface) !important;
}

.m3-icon-button--tonal.m3-icon-button--toggle.m3-icon-button__icon--active {
  background-color: var(--md-sys-color-primary-container) !important;
  color: var(--md-sys-color-on-primary-container) !important;
}

.m3-icon-button--outlined {
  border: 1px solid var(--md-sys-color-outline) !important;
  background-color: transparent !important;
}
.m3-icon-button--outlined:focus-visible {
  border-color: var(--md-sys-color-primary) !important;
}

/* States */
.m3-icon-button:hover::before {
  opacity: var(--md-sys-opacity-hover) !important;
}
.m3-icon-button:active::before {
  opacity: var(--md-sys-opacity-pressed) !important;
}

/* Disabled */
.m3-icon-button:disabled {
  color: rgba(var(--md-sys-color-on-surface-rgb, 227, 227, 227), 0.38) !important;
  background-color: transparent !important;
  border-color: rgba(var(--md-sys-color-on-surface-rgb, 227, 227, 227), 0.12) !important;
}
.m3-icon-button--filled:disabled,
.m3-icon-button--tonal:disabled {
  background-color: rgba(var(--md-sys-color-on-surface-rgb, 227, 227, 227), 0.12) !important;
}
</style>
