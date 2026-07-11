<template>
  <v-btn
    class="m3-button"
    :class="[
      `m3-button--${variant}`,
      { 'm3-button--icon-only': iconOnly }
    ]"
    :variant="vuetifyVariant"
    :elevation="elevation"
    :ripple="true"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <!-- Left Icon -->
    <v-icon v-if="icon && !iconOnly && !trailingIcon" class="m3-button__icon-left" :icon="icon" />

    <!-- Text content -->
    <slot></slot>

    <!-- Right Icon -->
    <v-icon v-if="icon && !iconOnly && trailingIcon" class="m3-button__icon-right" :icon="icon" />
  </v-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'filled' | 'elevated' | 'tonal' | 'outlined' | 'text'
  icon?: string
  trailingIcon?: boolean
  iconOnly?: boolean
  disabled?: boolean
}>(), {
  variant: 'filled',
  trailingIcon: false,
  iconOnly: false,
  disabled: false
})

// Map M3E variants to Vuetify 3 variants
const vuetifyVariant = computed(() => {
  switch (props.variant) {
    case 'filled': return 'flat'
    case 'elevated': return 'elevated'
    case 'tonal': return 'tonal'
    case 'outlined': return 'outlined'
    case 'text': return 'text'
    default: return 'flat'
  }
})

// M3E Elevated buttons have specific elevation tokens.
const elevation = computed(() => {
  if (props.disabled) return 0
  return props.variant === 'elevated' ? 1 : 0
})
</script>

<style scoped>
.m3-button {
  /* Default pill shape for all buttons */
  border-radius: var(--md-sys-shape-corner-full) !important;
  text-transform: none !important;
  letter-spacing: normal !important;
  font-family: var(--md-sys-typescale-label-large-font, 'Roboto', sans-serif);
  font-weight: 500;
  height: 40px !important;
  padding: 0 24px !important;
  transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard) !important;
}

/* Icon-only buttons (FABs, Icon Buttons will be handled in separate components but this is a fallback) */
.m3-button.m3-button--icon-only {
  padding: 0 !important;
  min-width: 40px !important;
  width: 40px !important;
}

/* Specific spacing for buttons with icons */
.m3-button__icon-left {
  margin-right: var(--md-sys-spacing-2);
  margin-left: -8px; /* Offset to keep visual balance */
  font-size: var(--md-sys-icon-size-medium) !important;
}
.m3-button__icon-right {
  margin-left: var(--md-sys-spacing-2);
  margin-right: -8px;
  font-size: var(--md-sys-icon-size-medium) !important;
}

/* Variant Overrides */

/* Filled */
.m3-button--filled {
  background-color: var(--md-sys-color-primary) !important;
  color: var(--md-sys-color-on-primary) !important;
}

/* Elevated */
.m3-button--elevated {
  background-color: var(--md-sys-color-surface-container-low) !important;
  color: var(--md-sys-color-primary) !important;
  box-shadow: var(--md-sys-elevation-1) !important;
}
.m3-button--elevated:hover:not(:disabled) {
  box-shadow: var(--md-sys-elevation-2) !important;
}
.m3-button--elevated:active:not(:disabled) {
  box-shadow: var(--md-sys-elevation-1) !important;
}

/* Tonal */
.m3-button--tonal {
  background-color: var(--md-sys-color-primary-container) !important;
  color: var(--md-sys-color-on-primary-container) !important;
}

/* Outlined */
.m3-button--outlined {
  border: 1px solid var(--md-sys-color-outline) !important;
  color: var(--md-sys-color-primary) !important;
}
.m3-button--outlined:focus-visible {
  border-color: var(--md-sys-color-primary) !important;
}

/* Text */
.m3-button--text {
  color: var(--md-sys-color-primary) !important;
  padding: 0 12px !important;
}

/* M3E State Layers */
.m3-button:hover::before {
  opacity: var(--md-sys-opacity-hover) !important;
}
.m3-button:focus-visible::before {
  opacity: var(--md-sys-opacity-focus) !important;
}
.m3-button:active::before {
  opacity: var(--md-sys-opacity-pressed) !important;
}

/* Disabled State */
.m3-button:disabled {
  background-color: rgba(var(--md-sys-color-on-surface-rgb, 227, 227, 227), 0.12) !important;
  color: rgba(var(--md-sys-color-on-surface-rgb, 227, 227, 227), 0.38) !important;
  box-shadow: none !important;
  border: none !important;
}
.m3-button--outlined:disabled {
  background-color: transparent !important;
  border: 1px solid rgba(var(--md-sys-color-on-surface-rgb, 227, 227, 227), 0.12) !important;
}
</style>
