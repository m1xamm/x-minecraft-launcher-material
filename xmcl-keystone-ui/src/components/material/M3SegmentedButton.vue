<template>
  <div class="m3-segmented-button" :class="{ 'm3-segmented-button--disabled': disabled }">
    <button
      v-for="(item, index) in items"
      :key="item.value"
      class="m3-segmented-button__segment"
      :class="{
        'm3-segmented-button__segment--active': modelValue === item.value,
        'm3-segmented-button__segment--first': index === 0,
        'm3-segmented-button__segment--last': index === items.length - 1
      }"
      :disabled="disabled || item.disabled"
      @click="select(item.value)"
    >
      <v-icon v-if="modelValue === item.value" class="m3-segmented-button__icon m3-segmented-button__icon--check" icon="check" />
      <v-icon v-else-if="item.icon" class="m3-segmented-button__icon" :icon="item.icon" />
      <span class="m3-segmented-button__label">{{ item.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  items: Array<{ label: string; value: any; icon?: string; disabled?: boolean }>
  modelValue: any
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

function select(value: any) {
  if (props.disabled) return
  emit('update:modelValue', value)
}
</script>

<style scoped>
.m3-segmented-button {
  display: inline-flex;
  border-radius: var(--md-sys-shape-corner-full);
  border: 1px solid var(--md-sys-color-outline);
  overflow: hidden;
  height: 40px;
}

.m3-segmented-button--disabled {
  border-color: rgba(var(--md-sys-color-on-surface-rgb, 227, 227, 227), 0.12);
}

.m3-segmented-button__segment {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  background: transparent;
  color: var(--md-sys-color-on-surface);
  border: none;
  border-right: 1px solid var(--md-sys-color-outline);
  font-family: var(--md-sys-typescale-label-large-font, 'Roboto', sans-serif);
  font-size: var(--md-sys-typescale-label-large);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
  position: relative;
}

.m3-segmented-button__segment:last-child {
  border-right: none;
}

/* Hover/Focus States */
.m3-segmented-button__segment::after {
  content: '';
  position: absolute;
  inset: 0;
  background-color: var(--md-sys-color-on-surface);
  opacity: 0;
  transition: opacity var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
  pointer-events: none;
}

.m3-segmented-button__segment:hover:not(:disabled)::after {
  opacity: var(--md-sys-opacity-hover);
}

.m3-segmented-button__segment:focus-visible:not(:disabled)::after {
  opacity: var(--md-sys-opacity-focus);
}

.m3-segmented-button__segment:active:not(:disabled)::after {
  opacity: var(--md-sys-opacity-pressed);
}

/* Active State */
.m3-segmented-button__segment--active {
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
}

.m3-segmented-button__segment--active::after {
  background-color: var(--md-sys-color-on-secondary-container);
}

.m3-segmented-button__icon {
  font-size: 18px !important;
  margin-right: 8px;
}

.m3-segmented-button__icon--check {
  font-size: 18px !important;
}

/* Disabled State */
.m3-segmented-button__segment:disabled {
  color: rgba(var(--md-sys-color-on-surface-rgb, 227, 227, 227), 0.38);
  cursor: default;
}
.m3-segmented-button--disabled .m3-segmented-button__segment {
  border-right-color: rgba(var(--md-sys-color-on-surface-rgb, 227, 227, 227), 0.12);
}
</style>
