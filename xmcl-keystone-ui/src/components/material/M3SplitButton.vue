<template>
  <div class="m3-split-button" :class="[ `m3-split-button--${variant}`, { 'm3-split-button--disabled': disabled } ]">
    <button
      class="m3-split-button__main"
      :disabled="disabled || mainDisabled"
      @click="$emit('click:main')"
    >
      <v-icon v-if="icon" class="m3-split-button__icon" :icon="icon" />
      <span class="m3-split-button__label">{{ label }}</span>
    </button>
    <div class="m3-split-button__divider"></div>
    <button
      class="m3-split-button__trailing"
      :disabled="disabled || trailingDisabled"
      @click="$emit('click:trailing')"
    >
      <v-icon class="m3-split-button__icon-trailing" :icon="trailingIcon" />
    </button>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  label: string
  variant?: 'filled' | 'tonal' | 'outlined'
  icon?: string
  trailingIcon?: string
  disabled?: boolean
  mainDisabled?: boolean
  trailingDisabled?: boolean
}>(), {
  variant: 'filled',
  trailingIcon: 'arrow_drop_down',
  disabled: false,
  mainDisabled: false,
  trailingDisabled: false
})

defineEmits<{
  (e: 'click:main'): void
  (e: 'click:trailing'): void
}>()
</script>

<style scoped>
.m3-split-button {
  display: inline-flex;
  border-radius: var(--md-sys-shape-corner-full);
  height: 40px;
  overflow: hidden;
  position: relative;
  transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
}

.m3-split-button__main,
.m3-split-button__trailing {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  font-family: var(--md-sys-typescale-label-large-font, 'Roboto', sans-serif);
  font-size: var(--md-sys-typescale-label-large);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
  position: relative;
  color: inherit;
}

.m3-split-button__main {
  padding: 0 16px;
  flex-grow: 1;
}
.m3-split-button__icon {
  margin-right: 8px;
  font-size: 18px !important;
}

.m3-split-button__trailing {
  padding: 0 12px;
}
.m3-split-button__icon-trailing {
  font-size: 18px !important;
}

.m3-split-button__divider {
  width: 1px;
  background-color: var(--md-sys-color-outline);
  margin: 8px 0;
  transition: background-color var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
}

/* Hover/Focus States */
.m3-split-button__main::after,
.m3-split-button__trailing::after {
  content: '';
  position: absolute;
  inset: 0;
  background-color: currentColor;
  opacity: 0;
  transition: opacity var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
  pointer-events: none;
}

.m3-split-button__main:hover:not(:disabled)::after,
.m3-split-button__trailing:hover:not(:disabled)::after {
  opacity: var(--md-sys-opacity-hover);
}

.m3-split-button__main:focus-visible:not(:disabled)::after,
.m3-split-button__trailing:focus-visible:not(:disabled)::after {
  opacity: var(--md-sys-opacity-focus);
}

.m3-split-button__main:active:not(:disabled)::after,
.m3-split-button__trailing:active:not(:disabled)::after {
  opacity: var(--md-sys-opacity-pressed);
}

/* Variants */
.m3-split-button--filled {
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
}
.m3-split-button--filled .m3-split-button__divider {
  background-color: var(--md-sys-color-outline-variant); /* Darker on primary */
}

.m3-split-button--tonal {
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
}
.m3-split-button--tonal .m3-split-button__divider {
  background-color: var(--md-sys-color-outline-variant);
}

.m3-split-button--outlined {
  border: 1px solid var(--md-sys-color-outline);
  color: var(--md-sys-color-primary);
}

/* Disabled State */
.m3-split-button--disabled {
  background-color: rgba(var(--md-sys-color-on-surface-rgb, 227, 227, 227), 0.12);
  color: rgba(var(--md-sys-color-on-surface-rgb, 227, 227, 227), 0.38);
  border-color: rgba(var(--md-sys-color-on-surface-rgb, 227, 227, 227), 0.12);
}
.m3-split-button--disabled .m3-split-button__divider {
  background-color: rgba(var(--md-sys-color-on-surface-rgb, 227, 227, 227), 0.12);
}
.m3-split-button__main:disabled,
.m3-split-button__trailing:disabled {
  cursor: default;
}
</style>
