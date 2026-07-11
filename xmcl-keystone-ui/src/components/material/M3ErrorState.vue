<template>
  <div class="m3-error-state">
    <div class="m3-error-state__icon-wrapper">
      <v-icon class="m3-error-state__icon" :icon="icon" />
    </div>
    <h2 class="m3-error-state__headline">{{ headline }}</h2>
    <p v-if="body" class="m3-error-state__body">{{ body }}</p>
    <div v-if="$slots.action" class="m3-error-state__action">
      <slot name="action"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  icon?: string
  headline: string
  body?: string
}>(), {
  icon: 'error'
})
</script>

<style scoped>
.m3-error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--md-sys-spacing-6) var(--md-sys-spacing-4);
  color: var(--md-sys-color-on-surface);
}

.m3-error-state__icon-wrapper {
  background-color: var(--md-sys-color-error-container);
  width: 72px;
  height: 72px;
  border-radius: var(--md-sys-shape-corner-extra-large); /* Specifically using XL instead of Full to distinguish from empty state */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--md-sys-spacing-4);
}

.m3-error-state__icon {
  font-size: 36px !important;
  color: var(--md-sys-color-on-error-container);
}

.m3-error-state__headline {
  font-family: var(--md-sys-typescale-title-large-font, 'Roboto', sans-serif);
  font-size: var(--md-sys-typescale-title-large);
  font-weight: 500;
  margin-bottom: var(--md-sys-spacing-2);
}

.m3-error-state__body {
  font-family: var(--md-sys-typescale-body-medium-font, 'Roboto', sans-serif);
  font-size: var(--md-sys-typescale-body-medium);
  color: var(--md-sys-color-on-surface-variant);
  max-width: 400px;
  margin-bottom: var(--md-sys-spacing-5);
}

.m3-error-state__action {
  margin-top: var(--md-sys-spacing-2);
}
</style>
