<template>
  <!-- ── Main launcher shell ── -->
  <v-app v-if="!showSetup" class="h-full max-h-screen overflow-hidden" :class="{ 'dark': isDark }">
    <AppBackground />

    <!-- Background gradient overlay behind top bar -->
    <div
      class="w-full h-full absolute left-0 header-overlay pointer-events-none"
      :style="{
        height: headerHeight + 70 + 'px',
        'background-image': `linear-gradient(${appBarColor} 0%, color-mix(in srgb, ${appBarColor}, transparent) 65%, transparent 100%)`
      }"
    />

    <!-- M3 Top App Bar (window chrome) -->
    <M3TopAppBar />

    <!-- Body row: [Nav Rail] + [Main Content] -->
    <div class="m3-app-body">
      <!-- New unified M3 Navigation -->
      <AppNavigationM3 />

      <!-- Main content area -->
      <main class="m3-main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade-transition" mode="out-in">
            <component :is="Component" class="z-2" />
          </transition>
        </router-view>
      </main>
    </div>

    <!-- ── Global overlays & dialogs (unchanged) ── -->
    <AppContextMenu />
    <AppNotifier />
    <AppCommandPalette />
    <AppAgentChat v-if="developerMode" />
    <AppFeedbackDialog />
    <AppTaskDialog />
    <AppAddInstanceDialog />
    <AppShareInstanceDialog />
    <AppInstanceDeleteDialog />
    <AppGameExitDialog />
    <AppLaunchBlockedDialog />
    <AppUnauthenticatedWarningDialog />
    <AppImageDialog />
    <AppJoinServerDialog />
    <AppSharedTooltip />
    <AppInstallSkipDialog />
    <AppMigrateWizardDialog />
    <AppMinecraftFriendsDialog />
    <UserProfileDialog :value="userProfileDialogShown" @input="userProfileDialogShown = $event" />
    <AppModrinthLoginDialog />
    <AppSideBarGroupSettingDialog :default-color="defaultColor" />
    <AppGamepadPrompt />
  </v-app>

  <!-- ── Setup wizard shell (first run) ── -->
  <v-app v-else class="h-full max-h-screen overflow-hidden" :class="{ 'dark': isDark }">
    <AppSystemBar no-user no-task />
    <div class="m3-app-body">
      <Setup @ready="onReady" />
    </div>
    <UserProfileDialog :value="userProfileDialogShown" @input="userProfileDialogShown = $event" />
    <AppFeedbackDialog />
    <AppGamepadPrompt />
  </v-app>
</template>

<script lang=ts setup>
import '@/assets/common.css'
import AppImageDialog from '@/components/AppImageDialog.vue'
import AppSharedTooltip from '@/components/AppSharedTooltip.vue'
import { useAuthProfileImportNotification } from '@/composables/authProfileImport'
import { useAgentChatHotkey } from '@/composables/agentChat'
import { kAgent, installAgentDevLauncher, useAgent } from '@/composables/agent'
import { useCommandPaletteHotkey } from '@/composables/commandPalette'
import { useDefaultErrorHandler } from '@/composables/errorHandler'
import { kInstance } from '@/composables/instance'
import { kLaunchButton, useLaunchButton } from '@/composables/launchButton'
import { kLocalizedContent, useLocalizedContentControl } from '@/composables/localizedContent'
import { useNotifier } from '@/composables/notifier'
import { kCompact } from '@/composables/scrollTop'
import { kSettingsState } from '@/composables/setting'
import { kTheme } from '@/composables/theme'
import { kTutorial } from '@/composables/tutorial'
import { kInFocusMode } from '@/composables/uiLayout'
import { kSidebarSettings, useSidebarSettings } from '@/composables/sidebarSettings'
import { basename } from '@/util/basename'
import { injection } from '@/util/inject'
import AppAddInstanceDialog from '@/views/AppAddInstanceDialog.vue'
import AppBackground from '@/views/AppBackground.vue'
import AppAgentChat from '@/views/AppAgentChat.vue'
import AppCommandPalette from '@/views/AppCommandPalette.vue'
import AppContextMenu from '@/views/AppContextMenu.vue'
import AppFeedbackDialog from '@/views/AppFeedbackDialog.vue'
import AppGameExitDialog from '@/views/AppGameExitDialog.vue'
import AppInstallSkipDialog from '@/views/AppInstallSkipDialog.vue'
import AppInstanceDeleteDialog from '@/views/AppInstanceDeleteDialog.vue'
import AppLaunchBlockedDialog from '@/views/AppLaunchBlockedDialog.vue'
import AppUnauthenticatedWarningDialog from '@/views/AppUnauthenticatedWarningDialog.vue'
import AppJoinServerDialog from '@/views/AppJoinServerDialog.vue'
import AppMigrateWizardDialog from '@/views/AppMigrateWizardDialog.vue'
import AppMinecraftFriendsDialog from '@/views/AppMinecraftFriendsDialog.vue'
import UserProfileDialog from '@/components/UserProfileDialog.vue'
import AppModrinthLoginDialog from '@/views/AppModrinthLoginDialog.vue'
import AppNotifier from '@/views/AppNotifier.vue'
import AppShareInstanceDialog from '@/views/AppShareInstanceDialog.vue'
import AppSideBarGroupSettingDialog from '@/views/AppSideBarGroupSettingDialog.vue'
import AppSystemBar from '@/views/AppSystemBar.vue'
import AppNavigationM3 from '@/views/AppNavigationM3.vue'
import M3TopAppBar from '@/components/material/M3TopAppBar.vue'
import AppTaskDialog from '@/views/AppTaskDialog.vue'
import Setup from '@/views/Setup.vue'
import { useLocalStorage, useMediaQuery, usePreferredColorScheme, usePreferredDark } from '@vueuse/core'
import { kInstanceLauncher, useInstanceLauncher } from '@/composables/instanceLauncher'
import { kMinecraftFriends, useMinecraftFriendsImpl } from '@/composables/minecraftFriends'
import { useUserMenuControl } from '@/composables/userMenu'
import { UserSkinRenderPaused } from '@/composables/userSkin'
import AppGamepadPrompt from '@/views/AppGamepadPrompt.vue'
import { useInstanceGroupDefaultColor } from '@/composables/instanceGroup'

const showSetup = ref(location.search.indexOf('bootstrap') !== -1)
const { state } = injection(kSettingsState)
const developerMode = computed(() => state.value?.developerMode ?? false)


provide('streamerMode', useLocalStorage('streamerMode', false, { writeDefaults: false }))
provide(kLocalizedContent, useLocalizedContentControl())
provide(kInstanceLauncher, useInstanceLauncher())
provide(kMinecraftFriends, useMinecraftFriendsImpl())

// Agent must run in App.vue (not Context.ts) because its tool factory
// injects kInstance/kInstanceMods/... which are provided by Context itself,
// and `inject` only resolves on descendants.
const agent = useAgent()
provide(kAgent, agent)
installAgentDevLauncher(agent)

// User profile dialog — moved from AppSystemBarUserMenu to App root
const userProfileDialogShown = ref(false)
const userMenu = useUserMenuControl()
userMenu.on(() => { userProfileDialogShown.value = true })
const route = useRoute()
provide(UserSkinRenderPaused, computed(() => !userProfileDialogShown.value && route.path !== '/me'))

// Bind Ctrl/Cmd+K to toggle the command palette.
useCommandPaletteHotkey()
// Bind Ctrl/Cmd+Shift+A to toggle the agent chat panel.
useAgentChatHotkey(developerMode)

const defaultColor = useInstanceGroupDefaultColor()

const modes = useLocalStorage('instanceEnabledDashboard', {} as Record<string, boolean>)
const { path } = injection(kInstance)
const isLessThan490px = useMediaQuery('(max-height: 570px)')
provide(kInFocusMode, computed({
  get() {
    const less = isLessThan490px.value
    const isDashboard = modes.value[basename(path.value)]
    if (isDashboard === undefined) {
      return true // 'focus' is default
    }
    if (less) {
      return false
    }
    return !isDashboard
  },
  set(inFocus) {
    const isDashboard = !inFocus
    modes.value = { ...modes.value, [basename(path.value)]: isDashboard }
  },
}))

provide(kLaunchButton, useLaunchButton())


const compact = ref(false)
provide(kCompact, compact)

const headerHeight = ref(0)
provide('headerHeight', headerHeight)

const { appBarColor, dark } = injection(kTheme)

watch(dark, (newVal) => {
  state.value?.themeSet(newVal === 'system' ? newVal : newVal ? 'dark' : 'light')
}, { immediate: true })

const tutor = injection(kTutorial)
// Set theme and start tutorial
const onReady = async (data: any) => {
  await nextTick()
  showSetup.value = false
  await nextTick()
  if (state.value) {
    state.value.themeSet(data.theme)
  } else {
    const unwatch = watch(state, (state) => {
      if (state) {
        state.themeSet(data.theme)
      }
      unwatch()
    })
  }
  tutor.start()
}

// color theme sync
const { isDark } = injection(kTheme)

// Notifier
const { notify } = useNotifier()
useDefaultErrorHandler(notify)
useAuthProfileImportNotification(notify)
</script>

<style scoped>

.clip-head {
  clip-path: inset(0px 30px 30px 0px) !important;
  width: 64px;
  height: auto;
  /*to preserve the aspect ratio of the image*/
}

.v-input__icon--prepend {
  margin-right: 7px;
}

img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>

<style scoped>
/* ── M3 app layout shell ── */
.m3-app-body {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  position: relative;
}

.m3-main-content {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-width: 0;
  max-height: 100%;
  overflow: auto;
}

/* Preserved legacy helpers */
.clip-head {
  clip-path: inset(0px 30px 30px 0px) !important;
  width: 64px;
  height: auto;
}

.v-input__icon--prepend {
  margin-right: 7px;
}

img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>
