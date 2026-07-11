<template>
  <nav
    class="m3-nav-rail"
    :class="{
      'm3-nav-rail--expanded': expanded,
    }"
    :style="{ backdropFilter: blur ? `blur(${blur}px)` : undefined }"
    role="navigation"
    aria-label="Main navigation"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <!-- Rail top: Menu/logo + FAB -->
    <div class="m3-nav-rail__header">
      <!-- Menu toggle button -->
      <button
        class="m3-nav-rail__menu-btn"
        :aria-label="expanded ? 'Collapse navigation' : 'Expand navigation'"
        :aria-expanded="expanded"
        @click="toggleExpanded"
      >
        <span class="material-symbols-rounded" style="font-size:24px;">menu</span>
      </button>
    </div>

    <!-- User avatar / My Stuff -->
    <div class="m3-nav-rail__section">
      <button
        class="m3-nav-rail__avatar-btn non-moveable"
        :aria-label="t('myStuff')"
        @click="router.push('/me')"
      >
        <PlayerAvatar
          class="m3-nav-rail__avatar"
          :src="gameProfile?.textures?.SKIN?.url"
          :dimension="36"
        />
        <span
          v-if="expanded"
          class="m3-nav-rail__avatar-label"
        >{{ gameProfile?.name || t('myStuff') }}</span>
      </button>
    </div>

    <div class="m3-nav-rail__divider" aria-hidden="true"></div>

    <!-- Instance list (compact mode = icons only in rail; expanded = full list in drawer) -->
    <div
      ref="instancesScrollRef"
      class="m3-nav-rail__instances"
      role="group"
      aria-label="Instances"
    >
      <slot name="instances" />
    </div>

    <div class="m3-nav-rail__divider" aria-hidden="true"></div>

    <!-- Bottom section: global navigation -->
    <div class="m3-nav-rail__section m3-nav-rail__section--bottom">
      <slot name="bottom-nav" />
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PlayerAvatar from '@/components/PlayerAvatar.vue'
import { kUserContext } from '@/composables/user'
import { injection } from '@/util/inject'
import { useDragAutoScroll } from '@/composables/dragAutoScroll'

const props = withDefaults(defineProps<{
  expanded: boolean
  blur?: number
}>(), {
  blur: 0,
})

const emit = defineEmits<{
  (e: 'update:expanded', val: boolean): void
}>()

const { t } = useI18n()
const router = useRouter()
const { gameProfile } = injection(kUserContext)

const instancesScrollRef = ref<HTMLDivElement | null>(null)
useDragAutoScroll(instancesScrollRef)

function toggleExpanded() {
  emit('update:expanded', !props.expanded)
}

// Optional: hover-to-expand behavior
let hoverTimer: ReturnType<typeof setTimeout> | null = null

function onMouseEnter() {
  // No hover-expand by default; expansion is explicit toggle
}
function onMouseLeave() {
  if (hoverTimer) {
    clearTimeout(hoverTimer)
    hoverTimer = null
  }
}
</script>

<style scoped>
.m3-nav-rail {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 80px;
  height: 100%;
  background-color: var(--md-sys-color-surface-container);
  z-index: 10;
  overflow: hidden;
  transition:
    width var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-emphasized);
  flex-shrink: 0;
}

.m3-nav-rail--expanded {
  width: 320px;
}

/* Header: menu toggle */
.m3-nav-rail__header {
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 16px;
  flex-shrink: 0;
}

.m3-nav-rail__menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--md-sys-shape-corner-full);
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--md-sys-color-on-surface-variant);
  transition: background-color var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
  flex-shrink: 0;
}

.m3-nav-rail__menu-btn:hover {
  background-color: rgba(var(--md-sys-color-on-surface-rgb, 227, 227, 227), 0.08);
}

.m3-nav-rail__menu-btn:focus-visible {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 2px;
}

/* User avatar section */
.m3-nav-rail__section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 4px 8px;
  flex-shrink: 0;
}

.m3-nav-rail__avatar-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: 56px;
  padding: 0 8px;
  border-radius: var(--md-sys-shape-corner-full);
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--md-sys-color-on-surface);
  transition: background-color var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
  text-align: left;
  overflow: hidden;
}

.m3-nav-rail__avatar-btn:hover {
  background-color: rgba(var(--md-sys-color-on-surface-rgb, 227, 227, 227), 0.08);
}

.m3-nav-rail__avatar {
  width: 36px;
  height: 36px;
  border-radius: var(--md-sys-shape-corner-full);
  overflow: hidden;
  flex-shrink: 0;
}

.m3-nav-rail__avatar-label {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0;
  transition: opacity var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
}

.m3-nav-rail--expanded .m3-nav-rail__avatar-label {
  opacity: 1;
  transition-delay: 50ms;
}

/* Divider */
.m3-nav-rail__divider {
  height: 1px;
  margin: 4px 12px;
  background-color: var(--md-sys-color-outline-variant);
  flex-shrink: 0;
}

/* Instances section */
.m3-nav-rail__instances {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  padding: 0 8px;
}

.m3-nav-rail__instances::-webkit-scrollbar {
  display: none;
}

/* Bottom section */
.m3-nav-rail__section--bottom {
  padding: 8px;
  border-top: none;
}
</style>
