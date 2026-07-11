<template>
  <!--
    AppNavigationM3 — the unified Material 3 Expressive navigation shell.
    Replaces both AppSideBarClassic and AppSideBarNotch.

    Layout:
      [Nav Rail (collapsed: 80px / expanded: 320px)] | [Main content]
    The rail is always a persistent left-side element.
    On compact screens the drawer becomes a modal overlay.
  -->
  <div
    class="m3-nav-shell"
    :class="{
      'm3-nav-shell--compact': isCompact,
      'm3-nav-shell--ultrawide': isUltrawide,
    }"
    data-testid="app-sidebar"
    role="navigation"
    aria-label="Main navigation"
  >
    <!-- Modal scrim: only shown on compact when drawer is open -->
    <Transition name="m3-scrim">
      <div
        v-if="isCompact && drawerOpen"
        class="m3-nav-shell__scrim"
        aria-hidden="true"
        @click="drawerOpen = false"
      />
    </Transition>

    <!-- Navigation Rail / Drawer panel -->
    <Transition name="m3-rail-slide">
      <div
        class="m3-nav-rail-panel"
        :class="{
          'm3-nav-rail-panel--expanded': drawerOpen,
          'm3-nav-rail-panel--compact-modal': isCompact && drawerOpen,
        }"
        :style="railPanelStyles"
      >
        <!-- ── Header (Menu toggle + Avatar) ── -->
        <div class="m3-rail-header">
          <button
            class="m3-rail-header__menu-btn non-moveable"
            :aria-label="drawerOpen ? 'Collapse navigation' : 'Expand navigation'"
            :aria-expanded="drawerOpen"
            @click="toggleDrawer"
          >
            <span class="material-symbols-rounded" style="font-size:22px;">menu</span>
          </button>

          <!-- Show logo/title text only when expanded -->
          <span v-if="drawerOpen" class="m3-rail-header__title">XMCL</span>
        </div>

        <!-- ── User / My Stuff ── -->
        <div class="m3-rail__section">
          <router-link
            id="my-stuff-button"
            data-testid="nav-accounts"
            to="/me"
            class="m3-rail-avatar-btn non-moveable"
            :aria-label="t('myStuff')"
          >
            <PlayerAvatar
              class="m3-rail-avatar-btn__avatar"
              :src="gameProfile?.textures?.SKIN?.url"
              :dimension="36"
            />
            <Transition name="m3-label-fade">
              <div v-if="drawerOpen" class="m3-rail-avatar-btn__info">
                <span class="m3-rail-avatar-btn__name">{{ gameProfile?.name || t('myStuff') }}</span>
                <span class="m3-rail-avatar-btn__sub">{{ t('myStuff') }}</span>
              </div>
            </Transition>
          </router-link>
        </div>

        <div class="m3-rail__divider" aria-hidden="true" />

        <!-- ── Instance Switcher ── -->
        <M3InstanceSwitcher
          class="m3-rail__instances"
          :expanded="drawerOpen"
        />

        <div class="m3-rail__divider" aria-hidden="true" />

        <!-- ── Bottom navigation destinations ── -->
        <div class="m3-rail__bottom" role="group" aria-label="Global navigation">
          <!-- Store -->
          <M3NavigationRailItem
            data-testid="nav-store"
            to="/store"
            icon="store"
            :label="drawerOpen ? t('store.name', 2) : undefined"
          />

          <!-- Multiplayer -->
          <M3NavigationRailItem
            data-testid="nav-multiplayer"
            icon="hub"
            :label="drawerOpen ? t('multiplayer.name') : undefined"
            @click="goMultiplayer"
          />

          <!-- Settings -->
          <M3NavigationRailItem
            data-testid="nav-settings"
            to="/setting"
            icon="settings"
            :label="drawerOpen ? t('setting.name', 2) : undefined"
            :has-badge="hasUpdate"
          >
            <template v-if="hasUpdate" #badge>1</template>
          </M3NavigationRailItem>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMediaQuery, useLocalStorage, useEventListener } from '@vueuse/core'
import PlayerAvatar from '@/components/PlayerAvatar.vue'
import M3NavigationRailItem from '@/components/material/M3NavigationRailItem.vue'
import M3InstanceSwitcher from '@/components/material/M3InstanceSwitcher.vue'
import { injection } from '@/util/inject'
import { kUserContext } from '@/composables/user'
import { kTheme } from '@/composables/theme'
import { kSettingsState } from '@/composables/setting'

const { t } = useI18n()
const { gameProfile } = injection(kUserContext)
const { blurSidebar, sideBarColor } = injection(kTheme)
const { state } = injection(kSettingsState)

const hasUpdate = computed(() => state.value?.updateStatus !== 'none')

// Responsive breakpoints
const isCompact = useMediaQuery('(max-width: 900px)')
const isUltrawide = useMediaQuery('(min-width: 1600px)')

// Drawer open state — persisted
const drawerOpen = useLocalStorage('m3_nav_drawer_open', false, { writeDefaults: false })

// On ultrawide: start expanded
watch(isUltrawide, (val) => {
  if (val && !drawerOpen.value) drawerOpen.value = true
}, { immediate: true })

function toggleDrawer() {
  drawerOpen.value = !drawerOpen.value
}

function goMultiplayer() {
  windowController.openMultiplayerWindow()
}

// Rail panel styles (backdrop blur + background)
const railPanelStyles = computed(() => ({
  backdropFilter: blurSidebar.value ? `blur(${blurSidebar.value}px)` : undefined,
  backgroundColor: sideBarColor.value,
}))

// Keyboard: ESC closes the drawer on compact
const { } = useEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isCompact.value && drawerOpen.value) {
    drawerOpen.value = false
  }
})

// Alt+Left = back
useEventListener(window, 'keydown', (e: KeyboardEvent) => {
  if (!e.altKey || e.key !== 'ArrowLeft') return
  if (e.ctrlKey || e.metaKey || e.shiftKey) return
  const target = e.target as HTMLElement | null
  if (target) {
    const tag = target.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) return
  }
  e.preventDefault()
  useRouter().back()
})
</script>

<style scoped>
/* ── Shell wrapper (occupies zero width; rail sits as a sibling in flex row) ── */
.m3-nav-shell {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  flex-shrink: 0;
  height: 100%;
}

/* ── Modal scrim (compact only) ── */
.m3-nav-shell__scrim {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9;
}

.m3-scrim-enter-active,
.m3-scrim-leave-active {
  transition: opacity var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-standard);
}

.m3-scrim-enter-from,
.m3-scrim-leave-to {
  opacity: 0;
}

/* ── Rail panel ── */
.m3-nav-rail-panel {
  display: flex;
  flex-direction: column;
  width: 80px;
  height: 100%;
  overflow: hidden;
  transition: width var(--md-sys-motion-duration-medium3) var(--md-sys-motion-easing-emphasized-decelerate);
  flex-shrink: 0;
  position: relative;
}

@media (prefers-reduced-motion: reduce) {
  .m3-nav-rail-panel {
    transition: none;
  }
}

.m3-nav-rail-panel--expanded {
  width: 296px;
}

/* Compact: rail becomes a modal slide-in drawer */
.m3-nav-rail-panel--compact-modal {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 10;
  box-shadow: var(--md-sys-elevation-3);
}

/* ── Rail header ── */
.m3-rail-header {
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 16px 0 16px;
  flex-shrink: 0;
  gap: 12px;
}

.m3-rail-header__menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--md-sys-shape-corner-full);
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--md-sys-color-on-surface-variant);
  transition: background-color var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
  flex-shrink: 0;
}

.m3-rail-header__menu-btn:hover {
  background-color: rgba(var(--md-sys-color-on-surface-rgb, 227, 227, 227), 0.08);
}

.m3-rail-header__menu-btn:focus-visible {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 2px;
}

.m3-rail-header__title {
  font-size: 20px;
  font-weight: 700;
  color: var(--md-sys-color-on-surface);
  white-space: nowrap;
  letter-spacing: -0.3px;
}

/* ── Section / divider ── */
.m3-rail__section {
  padding: 2px 12px;
  flex-shrink: 0;
}

.m3-rail__divider {
  height: 1px;
  margin: 4px 16px;
  background-color: var(--md-sys-color-outline-variant);
  flex-shrink: 0;
}

/* ── Avatar button (My Stuff) ── */
.m3-rail-avatar-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: 52px;
  padding: 0 8px;
  border-radius: var(--md-sys-shape-corner-full);
  text-decoration: none;
  color: var(--md-sys-color-on-surface);
  transition: background-color var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
  overflow: hidden;
}

.m3-rail-avatar-btn:hover {
  background-color: rgba(var(--md-sys-color-on-surface-rgb, 227, 227, 227), 0.08);
}

.m3-rail-avatar-btn.router-link-active {
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
}

.m3-rail-avatar-btn:focus-visible {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 2px;
}

.m3-rail-avatar-btn__avatar {
  width: 36px;
  height: 36px;
  border-radius: var(--md-sys-shape-corner-full);
  overflow: hidden;
  flex-shrink: 0;
}

.m3-rail-avatar-btn__info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.m3-rail-avatar-btn__name {
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.m3-rail-avatar-btn__sub {
  font-size: 11px;
  color: var(--md-sys-color-on-surface-variant);
}

/* Label fade transition */
.m3-label-fade-enter-active {
  transition: opacity var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
  transition-delay: 60ms;
}

.m3-label-fade-leave-active {
  transition: opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
}

.m3-label-fade-enter-from,
.m3-label-fade-leave-to {
  opacity: 0;
}

/* ── Instances area ── */
.m3-rail__instances {
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
}

/* ── Bottom nav ── */
.m3-rail__bottom {
  display: flex;
  flex-direction: column;
  padding: 4px 12px 8px;
  flex-shrink: 0;
  gap: 2px;
}
</style>
