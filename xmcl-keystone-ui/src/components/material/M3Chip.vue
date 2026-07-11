<template>
  <button
    class="m3-chip"
    :class="[
      `m3-chip--${variant}`,
      { 'm3-chip--disabled': disabled, 'm3-chip--selected': selected }
    ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <!-- Selected Icon (Filter Chip) -->
    <v-icon v-if="selected" class="m3-chip__icon m3-chip__icon--leading" icon="check" />
    <!-- Leading Icon -->
    <v-icon v-else-if="leadingIcon" class="m3-chip__icon m3-chip__icon--leading" :icon="leadingIcon" />
    <!-- Avatar (Input/Assistive Chip) -->
    <img v-else-if="avatarSrc" class="m3-chip__avatar" :src="avatarSrc" />
    
    <span class="m3-chip__label"><slot></slot></span>
    
    <!-- Trailing Icon (Input Chip Clear) -->
    <v-icon
      v-if="trailingIcon"
      class="m3-chip__icon m3-chip__icon--trailing"
      :class="{ 'm3-chip__icon--clickable': trailingClickable }"
      :icon="trailingIcon"
      @click.stop="onTrailingClick"
    />
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'assistive' | 'filter' | 'input' | 'suggestion'
  selected?: boolean
  leadingIcon?: string
  trailingIcon?: string
  avatarSrc?: string
  trailingClickable?: boolean
  disabled?: boolean
}>(), {
  variant: 'assistive',
  selected: false,
  trailingClickable: false,
  disabled: false
})

const emit = defineEmits<{
  (e: 'click', ev: MouseEvent): void
  (e: 'click:trailing', ev: MouseEvent): void
}>()

function onTrailingClick(e: MouseEvent) {
  if (props.trailingClickable) {
    emit('click:trailing', e)
  }
}
</script>

<style scoped>
.m3-chip {
  display: inline-flex;
  align-items: center;
  height: 32px;
  border-radius: var(--md-sys-shape-corner-small); /* 8px */
  padding: 0 16px;
  font-family: var(--md-sys-typescale-label-large-font, 'Roboto', sans-serif);
  font-size: var(--md-sys-typescale-label-large);
  font-weight: 500;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
  background-color: transparent;
  border: 1px solid var(--md-sys-color-outline);
  color: var(--md-sys-color-on-surface-variant);
}

/* Base Hover/Focus/Active (via pseudo-element overlay) */
.m3-chip::after {
  content: '';
  position: absolute;
  inset: 0;
  background-color: currentColor;
  opacity: 0;
  transition: opacity var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
  pointer-events: none;
}

.m3-chip:hover:not(:disabled)::after {
  opacity: var(--md-sys-opacity-hover);
}
.m3-chip:focus-visible:not(:disabled)::after {
  opacity: var(--md-sys-opacity-focus);
}
.m3-chip:active:not(:disabled)::after {
  opacity: var(--md-sys-opacity-pressed);
}

.m3-chip:focus-visible:not(:disabled) {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 2px;
}

/* Selection State (Filter / Choice Chips) */
.m3-chip--selected {
  background-color: var(--md-sys-color-secondary-container);
  border-color: transparent;
  color: var(--md-sys-color-on-secondary-container);
}

/* Icons & Avatars */
.m3-chip__icon {
  font-size: 18px !important;
}

.m3-chip__icon--leading {
  margin-left: -8px; /* Offset padding */
  margin-right: 8px;
}

.m3-chip__icon--trailing {
  margin-right: -8px;
  margin-left: 8px;
}

.m3-chip__icon--clickable:hover {
  opacity: 0.8;
}

.m3-chip__avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-left: -12px;
  margin-right: 8px;
  object-fit: cover;
}

/* Disabled */
.m3-chip--disabled {
  border-color: rgba(var(--md-sys-color-on-surface-rgb, 227, 227, 227), 0.12);
  color: rgba(var(--md-sys-color-on-surface-rgb, 227, 227, 227), 0.38);
  cursor: default;
}

.m3-chip--selected.m3-chip--disabled {
  background-color: rgba(var(--md-sys-color-on-surface-rgb, 227, 227, 227), 0.12);
  border-color: transparent;
}
</style>
