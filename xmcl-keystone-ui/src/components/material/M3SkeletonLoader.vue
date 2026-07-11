<template>
  <div
    class="m3-skeleton"
    :class="[
      `m3-skeleton--${type}`,
      `m3-skeleton--${animation}`
    ]"
    :style="{
      width: width ? (typeof width === 'number' ? width + 'px' : width) : 'auto',
      height: height ? (typeof height === 'number' ? height + 'px' : height) : 'auto',
      borderRadius: radius ? (typeof radius === 'number' ? radius + 'px' : radius) : undefined
    }"
  ></div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  type?: 'text' | 'avatar' | 'card' | 'image'
  animation?: 'pulse' | 'shimmer' | 'wave' | 'none'
  width?: string | number
  height?: string | number
  radius?: string | number
}>(), {
  type: 'text',
  animation: 'shimmer'
})
</script>

<style scoped>
.m3-skeleton {
  background-color: var(--md-sys-color-surface-container-highest);
  overflow: hidden;
  position: relative;
  /* Reduced motion fallback is handled by the media query below */
}

/* Base Types & Shapes */
.m3-skeleton--text {
  height: 16px;
  border-radius: var(--md-sys-shape-corner-small);
  margin: 4px 0;
}

.m3-skeleton--avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--md-sys-shape-corner-full);
}

.m3-skeleton--card {
  height: 120px;
  border-radius: var(--md-sys-shape-corner-medium);
}

.m3-skeleton--image {
  height: 200px;
  border-radius: var(--md-sys-shape-corner-medium);
}

/* Animations */

/* 1. Pulse */
.m3-skeleton--pulse {
  animation: m3-skeleton-pulse 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes m3-skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 2. Shimmer */
.m3-skeleton--shimmer::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.05) 20%,
    rgba(255, 255, 255, 0.1) 60%,
    rgba(255, 255, 255, 0)
  );
  animation: m3-skeleton-shimmer 2s infinite;
}

@keyframes m3-skeleton-shimmer {
  100% { transform: translateX(100%); }
}

/* 3. Wave (Similar to shimmer but tilted gradient) */
.m3-skeleton--wave::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.08),
    transparent
  );
  animation: m3-skeleton-wave 1.5s infinite linear;
}

@keyframes m3-skeleton-wave {
  100% { transform: translateX(100%); }
}

/* Reduced Motion Override */
@media (prefers-reduced-motion: reduce) {
  .m3-skeleton--pulse,
  .m3-skeleton--shimmer::after,
  .m3-skeleton--wave::after {
    animation: none !important;
  }
}
</style>
