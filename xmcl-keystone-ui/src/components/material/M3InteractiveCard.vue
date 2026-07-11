<template>
  <button
    class="m3-interactive-card"
    :class="[
      `m3-interactive-card--${variant}`,
      `m3-interactive-card--${shape}`,
      { 'm3-interactive-card--disabled': disabled }
    ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
    v-bind="$attrs"
  >
    <div class="m3-interactive-card__state-layer"></div>
    <div class="m3-interactive-card__content">
      <slot></slot>
    </div>
  </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'elevated' | 'filled' | 'outlined'
  shape?: 'medium' | 'large' | 'extra-large'
  disabled?: boolean
}>(), {
  variant: 'filled',
  shape: 'medium',
  disabled: false
})

defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()
</script>

<style scoped>
.m3-interactive-card {
  position: relative;
  overflow: hidden;
  transition: transform var(--md-sys-motion-duration-medium1) var(--md-sys-motion-easing-emphasized),
              box-shadow var(--md-sys-motion-duration-medium1) var(--md-sys-motion-easing-emphasized),
              border-color var(--md-sys-motion-duration-medium1) var(--md-sys-motion-easing-emphasized);
  display: flex;
  flex-direction: column;
  text-align: left;
  cursor: pointer;
  padding: 0;
  width: 100%;
}

.m3-interactive-card__content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* State Layer for Hover/Focus/Pressed */
.m3-interactive-card__state-layer {
  position: absolute;
  inset: 0;
  background-color: var(--md-sys-color-on-surface);
  opacity: 0;
  transition: opacity var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
  pointer-events: none;
  z-index: 0;
}

.m3-interactive-card:hover:not(:disabled) .m3-interactive-card__state-layer {
  opacity: var(--md-sys-opacity-hover);
}
.m3-interactive-card:focus-visible:not(:disabled) .m3-interactive-card__state-layer {
  opacity: var(--md-sys-opacity-focus);
}
.m3-interactive-card:active:not(:disabled) .m3-interactive-card__state-layer {
  opacity: var(--md-sys-opacity-pressed);
}

/* Shapes */
.m3-interactive-card--medium { border-radius: var(--md-sys-shape-corner-medium); }
.m3-interactive-card--large { border-radius: var(--md-sys-shape-corner-large); }
.m3-interactive-card--extra-large { border-radius: var(--md-sys-shape-corner-extra-large); }

/* Variants & Interaction specific physics */
.m3-interactive-card--elevated {
  background-color: var(--md-sys-color-surface-container-low);
  box-shadow: var(--md-sys-elevation-1);
  border: none;
  color: var(--md-sys-color-on-surface);
}
.m3-interactive-card--elevated:hover:not(:disabled) {
  box-shadow: var(--md-sys-elevation-2);
  transform: translateY(-2px);
}
.m3-interactive-card--elevated:active:not(:disabled) {
  box-shadow: var(--md-sys-elevation-1);
  transform: translateY(0) scale(0.98);
}

.m3-interactive-card--filled {
  background-color: var(--md-sys-color-surface-container-highest);
  border: none;
  color: var(--md-sys-color-on-surface);
  box-shadow: none;
}
.m3-interactive-card--filled:hover:not(:disabled) {
  box-shadow: var(--md-sys-elevation-1);
  transform: translateY(-2px);
}
.m3-interactive-card--filled:active:not(:disabled) {
  box-shadow: none;
  transform: translateY(0) scale(0.98);
}

.m3-interactive-card--outlined {
  background-color: var(--md-sys-color-surface);
  border: 1px solid var(--md-sys-color-outline-variant);
  color: var(--md-sys-color-on-surface);
  box-shadow: none;
}
.m3-interactive-card--outlined:hover:not(:disabled) {
  border-color: var(--md-sys-color-primary);
  box-shadow: var(--md-sys-elevation-1);
  transform: translateY(-2px);
}
.m3-interactive-card--outlined:active:not(:disabled) {
  border-color: var(--md-sys-color-outline-variant);
  box-shadow: none;
  transform: translateY(0) scale(0.98);
}

/* Focus Ring */
.m3-interactive-card:focus-visible:not(:disabled) {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 2px;
}

/* Disabled */
.m3-interactive-card--disabled {
  cursor: default;
  opacity: 0.38;
}
</style>
