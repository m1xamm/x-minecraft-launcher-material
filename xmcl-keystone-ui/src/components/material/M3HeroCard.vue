<template>
  <div class="m3-hero-card" :class="`m3-hero-card--${variant}`" v-bind="$attrs">
    <div class="m3-hero-card__background" :style="backgroundStyle">
      <slot name="background"></slot>
    </div>
    <div class="m3-hero-card__content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'elevated' | 'filled'
  imageSrc?: string
  overlayOpacity?: number
}>(), {
  variant: 'filled',
  overlayOpacity: 0.4
})

const backgroundStyle = computed(() => {
  if (!props.imageSrc) return {}
  return {
    backgroundImage: `linear-gradient(rgba(0,0,0,${props.overlayOpacity}), rgba(0,0,0,${props.overlayOpacity})), url(${props.imageSrc})`
  }
})
</script>

<style scoped>
.m3-hero-card {
  position: relative;
  overflow: hidden;
  border-radius: var(--md-sys-shape-corner-extra-large); /* 28px for hero items */
  display: flex;
  flex-direction: column;
  min-height: 200px; /* Sensible default for a hero */
}

.m3-hero-card--elevated {
  box-shadow: var(--md-sys-elevation-2);
  background-color: var(--md-sys-color-surface-container-low);
}

.m3-hero-card--filled {
  background-color: var(--md-sys-color-surface-container-highest);
}

.m3-hero-card__background {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  z-index: 0;
}

.m3-hero-card__content {
  position: relative;
  z-index: 1;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: var(--md-sys-spacing-5);
  color: var(--md-sys-color-on-surface);
}
</style>
