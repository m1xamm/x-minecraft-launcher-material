<template>
  <!-- M3E Top App Bar — functions as window titlebar + chrome + contextual toolbar -->
  <div
    class="m3-top-app-bar moveable"
    :class="{
      'm3-top-app-bar--scrolled': scrolled,
    }"
    :style="{ backdropFilter: blur ? `blur(${blur}px)` : undefined }"
    role="toolbar"
    aria-label="Application toolbar"
  >
    <!-- Leading: back button (when on sub-route) -->
    <div v-if="showBack" class="m3-top-app-bar__leading non-moveable">
      <button
        class="m3-top-app-bar__icon-btn"
        :aria-label="t('shared.back')"
        @click="onBack"
      >
        <span class="material-symbols-rounded" style="font-size:22px;">arrow_back</span>
      </button>
    </div>

    <!-- Center: slot for title/search -->
    <div class="m3-top-app-bar__center non-moveable">
      <slot name="center">
        <!-- Default: app title -->
        <span class="m3-top-app-bar__title">{{ title }}</span>
      </slot>
    </div>

    <!-- Trailing: actions + window controls -->
    <div class="m3-top-app-bar__trailing non-moveable" v-roving-tabindex role="group" aria-label="Toolbar actions">
      <!-- Gamepad badge -->
      <AppSystemBarBadge
        v-if="gamepadConnected"
        v-shared-tooltip.bottom="() => gamepadLabel"
        icon="sports_esports"
        :text="gamepadLabel"
        :aria-label="gamepadLabel"
        can-hide-text
        class="gamepad-badge"
        @click="openPalette"
      />

      <!-- Search/Command palette -->
      <AppSystemBarBadge
        v-if="!noUser"
        v-shared-tooltip.bottom="() => t('commandPalette.openHint', { shortcut: paletteShortcut })"
        icon="search"
        :text="t('commandPalette.open')"
        :aria-label="t('commandPalette.openHint', { shortcut: paletteShortcut })"
        can-hide-text
        @click="openPalette"
      >
        <template #append>
          <kbd class="m3-top-app-bar__hotkey">{{ paletteShortcut }}</kbd>
        </template>
      </AppSystemBarBadge>

      <!-- Task badge -->
      <AppSystemBarBadge
        v-if="!noTask"
        v-shared-tooltip.bottom="() => taskTooltip"
        icon="assignment"
        :can-hide-text="!taskInlineText"
        :text="taskInlineText"
        @click="showTaskDialog()"
      />

      <!-- Help / Tutorial -->
      <AppSystemBarBadge
        v-if="tutor"
        id="tutor-button"
        icon="quiz"
        :text="t('help')"
        can-hide-text
        @click="tutor.start()"
      />

      <!-- Feedback -->
      <AppSystemBarBadge
        v-if="!noDebug"
        id="feedback-button"
        icon="bug_report"
        :text="t('feedback.name')"
        can-hide-text
        @click="showFeedbackDialog()"
      />

      <!-- Audio player -->
      <AppAudioPlayer v-if="!noDebug" />

      <!-- Window controls group -->
      <div class="m3-top-app-bar__window-controls" role="group" aria-label="Window controls">
        <button
          v-if="!hideWindowControl"
          class="m3-top-app-bar__win-btn non-moveable"
          aria-label="Minimize"
          @click="minimize"
        >
          <span class="material-symbols-rounded" aria-hidden="true" style="font-size:16px;">minimize</span>
        </button>
        <button
          v-if="!hideWindowControl"
          class="m3-top-app-bar__win-btn non-moveable"
          aria-label="Maximize"
          @click="maximize"
        >
          <span class="material-symbols-rounded" aria-hidden="true" style="font-size:16px;">crop_din</span>
        </button>
        <button
          v-if="!hideWindowControl"
          class="m3-top-app-bar__win-btn m3-top-app-bar__win-btn--close non-moveable"
          aria-label="Close"
          @click="close"
        >
          <span class="material-symbols-rounded" aria-hidden="true" style="font-size:16px;">close</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { useDialog } from '@/composables/dialog'
import { useTaskCount } from '@/composables/task'
import { useGamepad } from '@/composables/gamepad'
import { injection } from '@/util/inject'
import { useWindowStyle } from '@/composables/windowStyle'
import { kTutorial } from '@/composables/tutorial'
import AppSystemBarBadge from '@/components/AppSystemBarBadge.vue'
import AppAudioPlayer from '@/components/AppAudioPlayer.vue'
import { kTheme } from '@/composables/theme'
import { useCommandPaletteBus } from '@/composables/commandPalette'
import { kNetworkStatus } from '@/composables/useNetworkStatus'
import { vRovingTabindex } from '@/directives/rovingTabindex'
import { vSharedTooltip } from '@/directives/sharedTooltip'
import { getExpectedSize } from '@/util/size'

const props = withDefaults(defineProps<{
  noUser?: boolean
  noTask?: boolean
  noDebug?: boolean
  back?: boolean
  showBack?: boolean
  title?: string
  scrolled?: boolean
}>(), {
  title: 'XMCL',
  scrolled: false,
})

const { t } = useI18n()
const { blurAppBar } = injection(kTheme)
const blur = blurAppBar

const { maximize, minimize, close } = windowController
const { hideWindowControl } = useWindowStyle()
const { show: showFeedbackDialog } = useDialog('feedback')
const { show: showTaskDialog } = useDialog('task')
const { count } = useTaskCount()
const networkStatus = inject(kNetworkStatus, undefined)?.status ?? ref(null)
const tutor = inject(kTutorial, undefined)

const taskSpeedText = computed(() =>
  networkStatus.value?.downloadSpeed
    ? `${getExpectedSize(networkStatus.value.downloadSpeed)}/s`
    : '')
const taskCountText = computed(() =>
  count.value === 0 ? t('task.empty') : t('task.nTaskRunning', { count: count.value }))
const taskInlineText = computed(() => {
  if (count.value === 0) return ''
  return taskSpeedText.value || taskCountText.value
})
const taskTooltip = computed(() => {
  if (count.value === 0) return t('task.empty')
  if (taskSpeedText.value) return `${taskCountText.value} · ${taskSpeedText.value}`
  return taskCountText.value
})

const paletteBus = useCommandPaletteBus()
const { isActive: gamepadActive, connected: gamepadConnected, name: gamepadName, labels: gamepadLabels } = useGamepad()
const paletteShortcut = computed(() => {
  if (gamepadActive.value) return gamepadLabels.value.menu
  return navigator.platform.toLowerCase().includes('mac') ? '⌘K' : 'Ctrl+K'
})
const gamepadLabel = computed(() => gamepadName.value || t('gamepad.connected'))
const openPalette = () => paletteBus.emit('show')

const router = useRouter()
const onBack = () => router.back()
</script>

<style scoped>
/* M3E Top App Bar — functions as window titlebar + chrome + contextual toolbar */
.m3-top-app-bar {
  display: flex;
  align-items: center;
  height: 40px;
  width: 100%;
  background-color: transparent;
  flex-shrink: 0;
  position: relative;
  z-index: 20;
  transition:
    background-color var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard),
    box-shadow var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
  color: var(--md-sys-color-on-surface);
}

/* Small drop shadow when content has scrolled under the bar */
.m3-top-app-bar--scrolled {
  background-color: var(--md-sys-color-surface-container);
  box-shadow: var(--md-sys-elevation-1);
}

/* Leading section */
.m3-top-app-bar__leading {
  display: flex;
  align-items: center;
  padding: 0 4px;
}

/* Center: title / search slot */
.m3-top-app-bar__center {
  flex-grow: 1;
  display: flex;
  align-items: center;
  padding: 0 8px;
  min-width: 0;
}

.m3-top-app-bar__title {
  font-size: 14px;
  font-weight: 500;
  color: var(--md-sys-color-on-surface);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Trailing: actions + window controls */
.m3-top-app-bar__trailing {
  display: flex;
  align-items: center;
  gap: 0;
  flex-shrink: 0;
  height: 100%;
}

/* Generic icon button used in the bar */
.m3-top-app-bar__icon-btn {
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
}

.m3-top-app-bar__icon-btn:hover {
  background-color: rgba(var(--md-sys-color-on-surface-rgb, 227, 227, 227), 0.08);
}

.m3-top-app-bar__icon-btn:focus-visible {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 2px;
}

/* Hotkey badge */
.m3-top-app-bar__hotkey {
  margin-left: 8px;
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 10px;
  line-height: 1;
  padding: 2px 5px;
  border-radius: 4px;
  background: rgba(125, 125, 125, 0.18);
  border: 1px solid rgba(125, 125, 125, 0.28);
  color: inherit;
  opacity: 0.75;
}

/* Window controls */
.m3-top-app-bar__window-controls {
  display: flex;
  align-items: center;
  height: 100%;
  margin-left: 4px;
}

.m3-top-app-bar__win-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 100%;
  background: transparent;
  border: none;
  cursor: pointer;
  color: inherit;
  transition: background-color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
}

.m3-top-app-bar__win-btn:hover {
  background-color: rgba(255, 255, 255, 0.12);
}

.m3-top-app-bar__win-btn--close:hover {
  background-color: rgb(209, 12, 12);
  color: white;
}

.m3-top-app-bar__win-btn:focus-visible {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: -2px;
}

/* Gamepad badge truncation */
.gamepad-badge {
  max-width: 180px;
  overflow: hidden;
}
</style>
