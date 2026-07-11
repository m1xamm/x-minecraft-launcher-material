<template>
  <div class="m3-empty-state">
    <div class="m3-empty-state__icon-wrapper">
      <v-icon class="m3-empty-state__icon" :icon="icon" />
    </div>
    <h2 class="m3-empty-state__headline">{{ headline }}</h2>
    <p v-if="body" class="m3-empty-state__body">{{ body }}</p>
    <div v-if="$slots.action" class="m3-empty-state__action">
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
  icon: 'inbox'
})
</script>

<style scoped>
.m3-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--md-sys-spacing-6) var(--md-sys-spacing-4);
  color: var(--md-sys-color-on-surface);
}

.m3-empty-state__icon-wrapper {
  background-color: var(--md-sys-color-surface-container-high);
  width: 96px;
  height: 96px;
  border-radius: var(--md-sys-shape-corner-full);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--md-sys-spacing-4);
}

.m3-empty-state__icon {
  font-size: 48px !important;
  color: var(--md-sys-color-on-surface-variant);
}

.m3-empty-state__headline {
  font-family: var(--md-sys-typescale-headline-small-font, 'Roboto', sans-serif);
  font-size: var(--md-sys-typescale-headline-small);
  font-weight: 400;
  margin-bottom: var(--md-sys-spacing-2);
}

.m3-empty-state__body {
  font-family: var(--md-sys-typescale-body-large-font, 'Roboto', sans-serif);
  font-size: var(--md-sys-typescale-body-large);
  color: var(--md-sys-color-on-surface-variant);
  max-width: 400px;
  margin-bottom: var(--md-sys-spacing-5);
}

.m3-empty-state__action {
  margin-top: var(--md-sys-spacing-2);
}
</style>
