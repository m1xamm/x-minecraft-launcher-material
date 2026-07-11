<template>
  <!-- Navigation Rail Item: a single destination in the rail -->
  <component
    :is="to ? 'router-link' : 'button'"
    :to="to"
    class="m3-rail-item"
    :class="{
      'm3-rail-item--active': isActive,
      'm3-rail-item--has-badge': hasBadge,
    }"
    :aria-label="label"
    :aria-current="isActive ? 'page' : undefined"
    :type="to ? undefined : 'button'"
    @click="$emit('click', $event)"
  >
    <!-- Active indicator pill (M3 spec) -->
    <span class="m3-rail-item__indicator" aria-hidden="true">
      <span class="m3-rail-item__indicator-pill"></span>
    </span>

    <!-- Icon with optional badge -->
    <span class="m3-rail-item__icon-wrapper" aria-hidden="true">
      <slot name="icon">
        <span
          class="m3-rail-item__icon material-symbols-rounded"
          :style="isActive ? { 'font-variation-settings': `'FILL' 1, 'wght' 500` } : { 'font-variation-settings': `'FILL' 0, 'wght' 400` }"
        >{{ icon }}</span>
      </slot>
      <span v-if="hasBadge" class="m3-rail-item__badge" aria-hidden="true">
        <slot name="badge">{{ badge }}</slot>
      </span>
    </span>

    <!-- Label -->
    <span v-if="label" class="m3-rail-item__label">{{ label }}</span>
  </component>
</template>

<script setup lang="ts">
import { useLink } from 'vue-router'

const props = withDefaults(defineProps<{
  to?: string
  icon?: string
  label?: string
  badge?: string | number
  hasBadge?: boolean
  active?: boolean
}>(), {
  hasBadge: false,
})

defineEmits<{
  (e: 'click', ev: MouseEvent): void
}>()

// Derive active state from router-link if `to` is provided
const route = useRoute()
const isActive = computed(() => {
  if (props.active !== undefined) return props.active
  if (!props.to) return false
  // Exact match or prefix for nested routes
  if (props.to === '/') return route.matched[0]?.path === '/'
  return route.path.startsWith(props.to)
})
</script>

<style scoped>
.m3-rail-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 56px;
  padding: 4px 0;
  text-decoration: none;
  color: var(--md-sys-color-on-surface-variant);
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: var(--md-sys-shape-corner-none);
  transition: color var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
  flex-shrink: 0;
}

.m3-rail-item--active {
  color: var(--md-sys-color-on-secondary-container);
}

/* Indicator pill background */
.m3-rail-item__indicator {
  position: absolute;
  top: 4px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 32px;
  pointer-events: none;
}

.m3-rail-item__indicator-pill {
  display: block;
  width: 56px;
  height: 32px;
  border-radius: var(--md-sys-shape-corner-full);
  background-color: transparent;
  transition:
    background-color var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard),
    width var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-emphasized);
}

.m3-rail-item--active .m3-rail-item__indicator-pill {
  background-color: var(--md-sys-color-secondary-container);
}

/* Hover state */
.m3-rail-item:hover:not(.m3-rail-item--active) .m3-rail-item__indicator-pill {
  background-color: rgba(var(--md-sys-color-on-surface-rgb, 227, 227, 227), 0.08);
}

.m3-rail-item:focus-visible .m3-rail-item__indicator-pill {
  background-color: rgba(var(--md-sys-color-on-surface-rgb, 227, 227, 227), 0.12);
  outline: 2px solid var(--md-sys-color-secondary);
  outline-offset: 2px;
}

/* Icon */
.m3-rail-item__icon-wrapper {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  /* Push icon into indicator area so it's centered over the pill */
  margin-top: 4px;
}

.m3-rail-item__icon {
  font-size: 24px;
  line-height: 1;
  transition: font-variation-settings var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
}

/* Badge */
.m3-rail-item__badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 16px;
  height: 16px;
  border-radius: var(--md-sys-shape-corner-full);
  background-color: var(--md-sys-color-error);
  color: var(--md-sys-color-on-error);
  font-size: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
}

/* Label */
.m3-rail-item__label {
  margin-top: 4px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.33;
  letter-spacing: 0.5px;
  text-align: center;
  max-width: 72px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
