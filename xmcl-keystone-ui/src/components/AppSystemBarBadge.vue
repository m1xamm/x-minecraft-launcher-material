<template>
  <button
    type="button"
    class="system-bar-badge non-moveable flex flex-grow-0 cursor-pointer items-center rounded px-2 py-1 transition-all"
    :aria-label="ariaLabel || text || undefined"
    @click="$emit('click', $event)"
  >
    <v-icon
      v-if="icon"
      size="22"
      :start="!!text"
      class="badge-icon"
      aria-hidden="true"
    >
      {{ icon }}
    </v-icon>
    <template v-else>
      <slot
        class="badge-icon"
      />
    </template>
    <span
      v-if="text"
      class="whitespace-nowrap"
      :class="{ 'badge-text': canHideText }"
    >
      {{ text }}
    </span>
    <slot name="append" />
  </button>
</template>
<script setup lang="ts">
defineProps<{
  icon?: string
  text?: string
  canHideText?: boolean
  ariaLabel?: string
}>()

</script>
<style scoped>
.system-bar-badge {
  @apply h-full mr-0 px-2 py-1 flex justify-center items-center select-none cursor-pointer after:hidden! gap-1;
  font-size: 14px;
  background: transparent;
  transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
  border: 0;
  color: inherit;
  appearance: none;
  border-radius: var(--md-sys-shape-corner-medium);
  -webkit-app-region: no-drag;
}

.system-bar-badge:hover {
  background-color: var(--md-sys-color-surface-container-high);
}

.system-bar-badge:focus-visible {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 1px;
  border-radius: var(--md-sys-shape-corner-medium);
}

@media (max-width: 880px) {
  .badge-text {
    display: none;
  }

  .badge-icon {
    margin-right: 0;
  }
}
</style>
