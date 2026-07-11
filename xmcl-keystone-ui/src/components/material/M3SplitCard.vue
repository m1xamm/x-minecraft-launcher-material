<template>
  <div class="m3-split-card">
    <div class="m3-split-card__left">
      <slot name="left"></slot>
    </div>
    <div class="m3-split-card__right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// Basic structural component
</script>

<style scoped>
.m3-split-card {
  display: flex;
  border-radius: var(--md-sys-shape-corner-extra-large);
  background: var(--md-sys-color-surface-container-lowest);
  overflow: hidden;
}

.m3-split-card__left {
  flex: 1;
  border-top-left-radius: var(--md-sys-shape-corner-extra-large);
  border-bottom-left-radius: var(--md-sys-shape-corner-extra-large);
  border-top-right-radius: var(--md-sys-shape-inner-shared);
  border-bottom-right-radius: var(--md-sys-shape-inner-shared);
  margin-right: var(--md-sys-spacing-1); /* 4px gap */
  background: var(--md-sys-color-surface-container);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.m3-split-card__right {
  flex: 1; /* Configurable later via props if asymmetric splits are needed */
  border-top-right-radius: var(--md-sys-shape-corner-extra-large);
  border-bottom-right-radius: var(--md-sys-shape-corner-extra-large);
  border-top-left-radius: var(--md-sys-shape-inner-shared);
  border-bottom-left-radius: var(--md-sys-shape-inner-shared);
  background: var(--md-sys-color-surface-container);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
