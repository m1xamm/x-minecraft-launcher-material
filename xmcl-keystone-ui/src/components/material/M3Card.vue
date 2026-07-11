<template>
  <div
    class="m3-card"
    :class="[
      `m3-card--${variant}`,
      `m3-card--${shape}`
    ]"
    v-bind="$attrs"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'elevated' | 'filled' | 'outlined' | 'transparent'
  shape?: 'medium' | 'large' | 'extra-large'
}>(), {
  variant: 'filled',
  shape: 'medium'
})
</script>

<style scoped>
.m3-card {
  overflow: hidden;
  position: relative;
  transition: all var(--md-sys-motion-duration-medium1) var(--md-sys-motion-easing-standard);
  display: flex;
  flex-direction: column;
}

/* Shapes */
.m3-card--medium { border-radius: var(--md-sys-shape-corner-medium); }
.m3-card--large { border-radius: var(--md-sys-shape-corner-large); }
.m3-card--extra-large { border-radius: var(--md-sys-shape-corner-extra-large); }

/* Variants */
.m3-card--elevated {
  background-color: var(--md-sys-color-surface-container-low);
  box-shadow: var(--md-sys-elevation-1);
}

.m3-card--filled {
  background-color: var(--md-sys-color-surface-container-highest);
  /* M3E filled cards usually don't have borders, just the background color */
}

.m3-card--outlined {
  background-color: var(--md-sys-color-surface);
  border: 1px solid var(--md-sys-color-outline-variant);
}

.m3-card--transparent {
  background-color: transparent;
}
</style>
