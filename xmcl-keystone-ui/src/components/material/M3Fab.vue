<template>
  <v-btn
    class="m3-fab"
    :class="[
      `m3-fab--${size}`,
      `m3-fab--${colorVariant}`,
      { 'm3-fab--extended': extended }
    ]"
    variant="flat"
    :elevation="elevationHover ? 4 : 3"
    :ripple="true"
    :disabled="disabled"
    @mouseenter="elevationHover = true"
    @mouseleave="elevationHover = false"
    v-bind="$attrs"
  >
    <v-icon v-if="icon" class="m3-fab__icon" :icon="icon" />
    <span v-if="extended" class="m3-fab__label">
      <slot></slot>
    </span>
  </v-btn>
</template>

<script setup lang="ts">
import { ref } from 'vue'

withDefaults(defineProps<{
  size?: 'small' | 'standard' | 'large'
  colorVariant?: 'primary' | 'surface' | 'secondary' | 'tertiary'
  extended?: boolean
  icon?: string
  disabled?: boolean
}>(), {
  size: 'standard',
  colorVariant: 'primary',
  extended: false,
  disabled: false
})

const elevationHover = ref(false)
</script>

<style scoped>
.m3-fab {
  text-transform: none !important;
  letter-spacing: normal !important;
  font-family: var(--md-sys-typescale-label-large-font, 'Roboto', sans-serif);
  font-weight: 500;
  transition: all var(--md-sys-motion-duration-medium1) var(--md-sys-motion-easing-emphasized) !important;
  min-width: unset !important;
}

/* Base Shadow mapping (Elevation 3 normally, Elevation 4 on hover) */
.m3-fab {
  box-shadow: var(--md-sys-elevation-3) !important;
}
.m3-fab:hover:not(:disabled) {
  box-shadow: var(--md-sys-elevation-4) !important;
}
.m3-fab:active:not(:disabled) {
  box-shadow: var(--md-sys-elevation-3) !important;
}

/* Sizing & Shapes */
.m3-fab--small {
  width: 40px !important;
  height: 40px !important;
  border-radius: var(--md-sys-shape-corner-medium) !important;
  padding: 0 !important;
}
.m3-fab--small .m3-fab__icon { font-size: 24px !important; }

.m3-fab--standard {
  width: 56px !important;
  height: 56px !important;
  border-radius: var(--md-sys-shape-corner-large) !important;
  padding: 0 !important;
}
.m3-fab--standard .m3-fab__icon { font-size: 24px !important; }

.m3-fab--large {
  width: 96px !important;
  height: 96px !important;
  border-radius: var(--md-sys-shape-corner-extra-large) !important;
  padding: 0 !important;
}
.m3-fab--large .m3-fab__icon { font-size: 36px !important; }

/* Extended FAB Override */
.m3-fab--extended {
  width: auto !important;
  height: 56px !important;
  border-radius: var(--md-sys-shape-corner-large) !important; /* Some guidelines say large, some say full */
  padding: 0 16px 0 16px !important;
}
.m3-fab--extended .m3-fab__icon {
  margin-right: 12px;
}
.m3-fab--extended .m3-fab__label {
  font-size: var(--md-sys-typescale-label-large);
}

/* Color Variants */
.m3-fab--primary {
  background-color: var(--md-sys-color-primary-container) !important;
  color: var(--md-sys-color-on-primary-container) !important;
}
.m3-fab--surface {
  background-color: var(--md-sys-color-surface-container-high) !important;
  color: var(--md-sys-color-primary) !important;
}
.m3-fab--secondary {
  background-color: var(--md-sys-color-secondary-container) !important; /* Ensure these are mapped in common.css if used */
  color: var(--md-sys-color-on-secondary-container) !important;
}
.m3-fab--tertiary {
  background-color: var(--md-sys-color-tertiary-container) !important;
  color: var(--md-sys-color-on-tertiary-container) !important;
}

/* States */
.m3-fab:hover::before {
  opacity: var(--md-sys-opacity-hover) !important;
}
.m3-fab:active::before {
  opacity: var(--md-sys-opacity-pressed) !important;
}

/* Disabled */
.m3-fab:disabled {
  background-color: rgba(var(--md-sys-color-on-surface-rgb, 227, 227, 227), 0.12) !important;
  color: rgba(var(--md-sys-color-on-surface-rgb, 227, 227, 227), 0.38) !important;
  box-shadow: none !important;
}
</style>
