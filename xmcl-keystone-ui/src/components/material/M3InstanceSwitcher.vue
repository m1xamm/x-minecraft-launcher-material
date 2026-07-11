<template>
  <div class="m3-instance-switcher">
    <!-- Compact (rail) mode: icon-only column -->
    <template v-if="!expanded">
      <div
        v-for="(item, idx) in filteredGroups.slice(0, maxCompact)"
        :key="typeof item === 'string' ? item : item.id"
      >
        <!-- Single instance -->
        <div
          v-if="typeof item === 'string'"
          class="m3-inst-icon"
          :class="{ 'm3-inst-icon--active': selectedInstance === item }"
          v-context-menu="() => getInstanceContextMenu(item)"
          role="button"
          tabindex="0"
          :aria-label="getInstanceName(item)"
          :aria-pressed="selectedInstance === item"
          draggable="true"
          @click="selectInstance(item)"
          @keydown.enter.prevent="selectInstance(item)"
          @keydown.space.prevent="selectInstance(item)"
          @dragstart="onDragStart($event, item)"
          @dragend="onDragEnd"
          @dragover.prevent="onDragOver($event, item)"
          @dragleave="onDragLeave"
          @drop.prevent="onDrop($event, item)"
        >
          <div class="m3-inst-icon__pill" aria-hidden="true"></div>
          <div class="m3-inst-icon__img-wrapper">
            <v-img
              class="m3-inst-icon__img"
              :src="getInstanceIcon(item)"
              :width="40"
              :height="40"
            />
          </div>
        </div>

        <!-- Group -->
        <div
          v-else
          class="m3-inst-icon m3-inst-icon--group"
          :class="{ 'm3-inst-icon--active': isGroupActive(item) }"
          :style="{ '--group-color': item.color || defaultColor }"
          role="button"
          tabindex="0"
          :aria-label="item.name || 'Instance group'"
          :aria-expanded="expandedGroups.has(item.id)"
          @click="toggleGroup(item.id)"
          @keydown.enter.prevent="toggleGroup(item.id)"
        >
          <div class="m3-inst-icon__pill" aria-hidden="true"></div>
          <div class="m3-inst-icon__img-wrapper m3-inst-icon__grid">
            <v-img
              v-for="inst in getGroupInstances(item).slice(0, 4)"
              :key="inst.path"
              class="m3-inst-icon__grid-item"
              :src="getInstanceFavicon(inst)"
            />
          </div>
        </div>
      </div>

      <!-- Add instance button -->
      <div
        class="m3-inst-icon m3-inst-icon--add"
        role="button"
        tabindex="0"
        :aria-label="t('instances.add')"
        @click="showAddInstance()"
        @keydown.enter.prevent="showAddInstance()"
      >
        <div class="m3-inst-icon__img-wrapper">
          <span class="material-symbols-rounded" style="font-size:24px;color:var(--md-sys-color-on-surface-variant);">add</span>
        </div>
      </div>
    </template>

    <!-- Expanded (drawer) mode: full list with search -->
    <template v-else>
      <div class="m3-inst-drawer">
        <!-- Search field -->
        <div class="m3-inst-drawer__search">
          <div class="m3-inst-drawer__search-field">
            <span class="material-symbols-rounded m3-inst-drawer__search-icon">search</span>
            <input
              v-model="searchQuery"
              class="m3-inst-drawer__search-input"
              :placeholder="t('instances.search', 'Search instances...')"
              type="search"
              aria-label="Search instances"
            />
            <button
              v-if="searchQuery"
              class="m3-inst-drawer__search-clear"
              :aria-label="t('shared.clear', 'Clear')"
              @click="searchQuery = ''"
            >
              <span class="material-symbols-rounded" style="font-size:18px;">close</span>
            </button>
          </div>
        </div>

        <!-- Instance list (virtual-scroll friendly) -->
        <div class="m3-inst-drawer__list" role="list">
          <template v-if="isValidating && filteredDrawerItems.length === 0">
            <!-- Skeleton loading -->
            <div v-for="n in 4" :key="n" class="m3-inst-list-item m3-inst-list-item--skeleton">
              <div class="m3-inst-list-item__skeleton-avatar"></div>
              <div class="m3-inst-list-item__skeleton-text">
                <div class="m3-inst-list-item__skeleton-name"></div>
                <div class="m3-inst-list-item__skeleton-version"></div>
              </div>
            </div>
          </template>

          <template v-else>
            <template v-for="item in filteredDrawerItems" :key="typeof item === 'string' ? item : item.id">
              <!-- Group header -->
              <div
                v-if="typeof item !== 'string'"
                class="m3-inst-group-header"
                :style="{ '--group-color': item.color || defaultColor }"
                role="button"
                tabindex="0"
                :aria-label="item.name || 'Instance group'"
                :aria-expanded="expandedGroups.has(item.id)"
                @click="toggleGroup(item.id)"
                @keydown.enter.prevent="toggleGroup(item.id)"
              >
                <!-- Group thumbnail grid -->
                <div class="m3-inst-group-header__grid">
                  <v-img
                    v-for="inst in getGroupInstances(item).slice(0, 4)"
                    :key="inst.path"
                    class="m3-inst-group-header__grid-item"
                    :src="getInstanceFavicon(inst)"
                  />
                </div>
                <div class="m3-inst-group-header__info">
                  <span class="m3-inst-group-header__name">{{ item.name || t('instances.unnamedGroup', 'Group') }}</span>
                  <span class="m3-inst-group-header__count">{{ item.instances.length }} {{ t('instances.instances', 'instances') }}</span>
                </div>
                <span
                  class="material-symbols-rounded m3-inst-group-header__chevron"
                  :class="{ 'm3-inst-group-header__chevron--open': expandedGroups.has(item.id) }"
                >chevron_right</span>
              </div>

              <!-- Single instance item -->
              <div
                v-else
                class="m3-inst-list-item"
                :class="{ 'm3-inst-list-item--active': selectedInstance === item }"
                v-context-menu="() => getInstanceContextMenu(item)"
                role="listitem button"
                tabindex="0"
                :aria-label="getInstanceName(item)"
                :aria-pressed="selectedInstance === item"
                draggable="true"
                @click="selectInstance(item)"
                @keydown.enter.prevent="selectInstance(item)"
                @keydown.space.prevent="selectInstance(item)"
                @dragstart="onDragStart($event, item)"
                @dragend="onDragEnd"
                @dragover.prevent="onDragOver($event, item)"
                @dragleave="onDragLeave"
                @drop.prevent="onDrop($event, item)"
              >
                <!-- Active indicator -->
                <span v-if="selectedInstance === item" class="m3-inst-list-item__active-bar" aria-hidden="true"></span>
                <v-img
                  class="m3-inst-list-item__img"
                  :src="getInstanceIcon(item)"
                  :width="40"
                  :height="40"
                />
                <div class="m3-inst-list-item__info">
                  <span class="m3-inst-list-item__name">{{ getInstanceName(item) }}</span>
                  <span class="m3-inst-list-item__version">{{ getInstanceVersionLabel(item) }}</span>
                </div>
                <!-- Drag handle area (implied by draggable) -->
                <span class="material-symbols-rounded m3-inst-list-item__drag-handle" aria-hidden="true">drag_indicator</span>
              </div>
            </template>
          </template>

          <!-- Empty state when search yields nothing -->
          <div v-if="!isValidating && filteredDrawerItems.length === 0" class="m3-inst-drawer__empty">
            <span class="material-symbols-rounded m3-inst-drawer__empty-icon">search_off</span>
            <p class="m3-inst-drawer__empty-text">{{ t('instances.noResults', 'No instances found') }}</p>
          </div>
        </div>

        <!-- Add instance FAB-like button at bottom -->
        <div class="m3-inst-drawer__add-btn-wrapper">
          <button
            id="create-instance-button"
            data-testid="create-instance"
            class="m3-inst-drawer__add-btn"
            :aria-label="t('instances.add')"
            @click="showAddInstance()"
          >
            <span class="material-symbols-rounded" style="font-size:20px;">add</span>
            <span class="m3-inst-drawer__add-label">{{ t('instances.add') }}</span>
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useDialog } from '@/composables/dialog'
import { useInstanceGroup, useInstanceGroupDefaultColor } from '@/composables/instanceGroup'
import { AddInstanceDialogKey } from '@/composables/instanceTemplates'
import { kInstances } from '@/composables/instances'
import { useInjectSidebarSettings } from '@/composables/sidebarSettings'
import { injection } from '@/util/inject'
import { getInstanceIcon as getInstanceIconUtil } from '@/util/favicon'
import { useInstanceContextMenuItems } from '@/composables/instanceContextMenu'
import { vContextMenu } from '@/directives/contextMenu'
import { kInstance } from '@/composables/instance'
import { useInstanceServerStatus } from '@/composables/serverStatus'
import { isDraggingInstance } from '@/composables/instanceGroup'
import type { Instance } from '@xmcl/instance'
import type { InstanceGroupData } from '@xmcl/runtime-api'

const props = withDefaults(defineProps<{
  expanded: boolean
}>(), {
  expanded: false,
})

const { t } = useI18n()
const router = useRouter()

const { instances, isValidating, selectedInstance } = injection(kInstances)
const { select } = injection(kInstance)
const { show: showAddInstance } = useDialog(AddInstanceDialogKey)
const { groups, move, group: groupFn, edit } = useInstanceGroup()
const { showOnlyPinned, pinnedInstances } = useInjectSidebarSettings()
const defaultColor = useInstanceGroupDefaultColor()

const searchQuery = ref('')
const expandedGroups = reactive(new Set<string>())

// Max items shown in compact rail
const maxCompact = 6

// ---- Helper Functions ----

function getInstanceName(path: string): string {
  const inst = instances.value.find(i => i.path === path)
  if (!inst) return path
  return inst.name || `Minecraft ${inst.runtime.minecraft}`
}

function getInstanceVersionLabel(path: string): string {
  const inst = instances.value.find(i => i.path === path)
  if (!inst) return ''
  const parts: string[] = []
  if (inst.runtime.minecraft) parts.push(`MC ${inst.runtime.minecraft}`)
  if (inst.runtime.forge) parts.push('Forge')
  if (inst.runtime.fabricLoader) parts.push('Fabric')
  if (inst.runtime.neoForged) parts.push('NeoForge')
  if (inst.runtime.quiltLoader) parts.push('Quilt')
  return parts.join(' · ')
}

function getInstanceFavicon(inst: Instance): string {
  return getInstanceIconUtil(inst, undefined)
}

function getInstanceIcon(path: string): string {
  const inst = instances.value.find(i => i.path === path)
  if (!inst) return ''
  return getInstanceIconUtil(inst, undefined)
}

function getGroupInstances(group: InstanceGroupData): Instance[] {
  return group.instances
    .map((p: string) => instances.value.find((i: Instance) => i.path === p))
    .filter((i: Instance | undefined): i is Instance => !!i)
}

function isGroupActive(group: InstanceGroupData): boolean {
  return group.instances.includes(selectedInstance.value || '')
}

function toggleGroup(id: string) {
  if (expandedGroups.has(id)) {
    expandedGroups.delete(id)
  } else {
    expandedGroups.add(id)
  }
}

function selectInstance(path: string) {
  if (router.currentRoute.value.path !== '/') {
    router.push('/').then(() => select(path))
  } else {
    select(path)
  }
}

// ---- Context Menu ----
function getInstanceContextMenu(path: string) {
  const inst = computed(() => instances.value.find(i => i.path === path))
  return useInstanceContextMenuItems(inst)()
}

// ---- Filtered groups (compact) ----
const filteredGroups = computed(() => {
  let items = groups.value
  if (showOnlyPinned.value) {
    items = items.filter(item => {
      if (typeof item === 'string') return pinnedInstances.value.includes(item)
      return item.instances.some(p => pinnedInstances.value.includes(p))
    })
  }
  return items
})

// ---- Filtered items for drawer with search + group expansion ----
const filteredDrawerItems = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  const result: (string | InstanceGroupData)[] = []

  for (const item of filteredGroups.value) {
    if (typeof item === 'string') {
      if (!q || getInstanceName(item).toLowerCase().includes(q)) {
        result.push(item)
      }
    } else {
      // Group: always show group header if any instance matches
      const matchingInstances = item.instances.filter(p =>
        !q || getInstanceName(p).toLowerCase().includes(q)
      )
      if (matchingInstances.length > 0) {
        result.push(item)
        // Show children if expanded OR if searching
        if (expandedGroups.has(item.id) || q) {
          result.push(...matchingInstances)
        }
      }
    }
  }
  return result
})

// ---- Drag & Drop ----
const draggedPath = ref<string | null>(null)
const dragOverPath = ref<string | null>(null)

function onDragStart(e: DragEvent, path: string) {
  const img = new Image(40, 40)
  img.src = getInstanceIcon(path)
  e.dataTransfer?.setDragImage(img, 0, 0)
  e.dataTransfer!.effectAllowed = 'move'
  e.dataTransfer!.setData('instance', path)
  draggedPath.value = path
  isDraggingInstance.value = true
}

function onDragEnd() {
  draggedPath.value = null
  dragOverPath.value = null
  isDraggingInstance.value = false
}

function onDragOver(e: DragEvent, path: string) {
  dragOverPath.value = path
}

function onDragLeave() {
  dragOverPath.value = null
}

function onDrop(e: DragEvent, targetPath: string) {
  const from = e.dataTransfer?.getData('instance')
  if (from && from !== targetPath) {
    move(from, targetPath, false)
  }
  draggedPath.value = null
  dragOverPath.value = null
  isDraggingInstance.value = false
}
</script>

<style scoped>
/* ========================
   Compact Rail Mode (icon-only)
   ======================== */
.m3-instance-switcher {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 2px;
  height: 100%;
}

/* Instance icon button (compact) */
.m3-inst-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 56px;
  cursor: pointer;
  flex-shrink: 0;
  user-select: none;
}

.m3-inst-icon__pill {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 0;
  border-radius: 0 3px 3px 0;
  background-color: var(--md-sys-color-primary);
  transition: height var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
}

.m3-inst-icon:hover .m3-inst-icon__pill {
  height: 20px;
}

.m3-inst-icon--active .m3-inst-icon__pill {
  height: 36px;
}

.m3-inst-icon__img-wrapper {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: var(--md-sys-shape-corner-medium);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--md-sys-color-surface-container-high);
  transition:
    border-radius var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard),
    box-shadow var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
}

.m3-inst-icon:hover .m3-inst-icon__img-wrapper {
  border-radius: var(--md-sys-shape-corner-small);
}

.m3-inst-icon--active .m3-inst-icon__img-wrapper {
  border-radius: var(--md-sys-shape-corner-small);
  box-shadow: 0 0 0 2px var(--md-sys-color-primary);
}

.m3-inst-icon__img {
  width: 100%;
  height: 100%;
  pointer-events: none;
  user-select: none;
}

/* Group icon grid */
.m3-inst-icon__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 1px;
  padding: 1px;
  background-color: var(--group-color, var(--md-sys-color-primary));
}

.m3-inst-icon__grid-item {
  border-radius: 2px;
  pointer-events: none;
}

/* Add button */
.m3-inst-icon--add .m3-inst-icon__img-wrapper {
  border: 2px dashed var(--md-sys-color-outline-variant);
  background-color: transparent;
}

.m3-inst-icon--add:hover .m3-inst-icon__img-wrapper {
  border-color: var(--md-sys-color-primary);
  background-color: rgba(var(--md-sys-color-on-surface-rgb, 227, 227, 227), 0.05);
}

/* ========================
   Expanded Drawer Mode
   ======================== */
.m3-inst-drawer {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

/* Search */
.m3-inst-drawer__search {
  padding: 8px 12px;
  flex-shrink: 0;
}

.m3-inst-drawer__search-field {
  display: flex;
  align-items: center;
  height: 40px;
  background-color: var(--md-sys-color-surface-container-high);
  border-radius: var(--md-sys-shape-corner-full);
  padding: 0 12px;
  gap: 8px;
  transition: background-color var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
}

.m3-inst-drawer__search-field:focus-within {
  background-color: var(--md-sys-color-surface-container-highest);
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 0;
}

.m3-inst-drawer__search-icon {
  font-size: 18px;
  color: var(--md-sys-color-on-surface-variant);
  flex-shrink: 0;
}

.m3-inst-drawer__search-input {
  flex-grow: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--md-sys-color-on-surface);
  font-size: 14px;
  font-family: inherit;
}

.m3-inst-drawer__search-input::placeholder {
  color: var(--md-sys-color-on-surface-variant);
}

.m3-inst-drawer__search-clear {
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--md-sys-color-on-surface-variant);
  display: flex;
  align-items: center;
  padding: 2px;
  border-radius: var(--md-sys-shape-corner-full);
  flex-shrink: 0;
}

/* List */
.m3-inst-drawer__list {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 4px 8px;
  scrollbar-width: thin;
  scrollbar-color: var(--md-sys-color-outline-variant) transparent;
  contain: content; /* Critical for 500+ instance rendering performance */
}

/* List item (single instance) */
.m3-inst-list-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 56px;
  padding: 0 12px 0 8px;
  border-radius: var(--md-sys-shape-corner-full);
  cursor: pointer;
  transition: background-color var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
  user-select: none;
  overflow: hidden;
}

.m3-inst-list-item:hover {
  background-color: rgba(var(--md-sys-color-on-surface-rgb, 227, 227, 227), 0.08);
}

.m3-inst-list-item:focus-visible {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 2px;
}

.m3-inst-list-item--active {
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
}

.m3-inst-list-item--active:hover {
  background-color: color-mix(in srgb, var(--md-sys-color-secondary-container) 92%, var(--md-sys-color-on-secondary-container) 8%);
}

/* Active bar (left edge) */
.m3-inst-list-item__active-bar {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 28px;
  border-radius: 0 4px 4px 0;
  background-color: var(--md-sys-color-primary);
}

.m3-inst-list-item__img {
  width: 40px;
  height: 40px;
  border-radius: var(--md-sys-shape-corner-small);
  flex-shrink: 0;
  overflow: hidden;
}

.m3-inst-list-item__info {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-width: 0;
}

.m3-inst-list-item__name {
  font-size: 14px;
  font-weight: 500;
  color: inherit;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.m3-inst-list-item__version {
  font-size: 12px;
  color: var(--md-sys-color-on-surface-variant);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 1px;
}

.m3-inst-list-item--active .m3-inst-list-item__version {
  color: var(--md-sys-color-on-secondary-container);
  opacity: 0.7;
}

.m3-inst-list-item__drag-handle {
  font-size: 18px;
  color: var(--md-sys-color-on-surface-variant);
  opacity: 0;
  flex-shrink: 0;
  transition: opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
}

.m3-inst-list-item:hover .m3-inst-list-item__drag-handle {
  opacity: 0.5;
}

/* Skeleton */
.m3-inst-list-item--skeleton {
  cursor: default;
  pointer-events: none;
}

.m3-inst-list-item__skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--md-sys-shape-corner-small);
  background-color: var(--md-sys-color-surface-container-highest);
  flex-shrink: 0;
  animation: m3-skeleton-shimmer 2s infinite;
}

.m3-inst-list-item__skeleton-text {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-grow: 1;
}

.m3-inst-list-item__skeleton-name,
.m3-inst-list-item__skeleton-version {
  border-radius: var(--md-sys-shape-corner-small);
  background-color: var(--md-sys-color-surface-container-highest);
  animation: m3-skeleton-shimmer 2s infinite;
}

.m3-inst-list-item__skeleton-name {
  height: 14px;
  width: 70%;
}

.m3-inst-list-item__skeleton-version {
  height: 11px;
  width: 50%;
}

@keyframes m3-skeleton-shimmer {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

/* Group header */
.m3-inst-group-header {
  position: sticky;
  top: -4px; /* align with padding */
  z-index: 2;
  background-color: var(--md-sys-color-surface-container); /* Ensure it covers items behind it */
  display: flex;
  align-items: center;
  gap: 10px;
  height: 48px;
  padding: 0 8px 0 4px;
  border-radius: var(--md-sys-shape-corner-medium);
  cursor: pointer;
  user-select: none;
  margin-top: 4px;
  transition: background-color var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
}

.m3-inst-group-header:hover {
  background-image: linear-gradient(rgba(var(--md-sys-color-on-surface-rgb, 227, 227, 227), 0.06), rgba(var(--md-sys-color-on-surface-rgb, 227, 227, 227), 0.06));
}

.m3-inst-group-header:focus-visible {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: -2px;
}

.m3-inst-group-header__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 1px;
  width: 32px;
  height: 32px;
  border-radius: var(--md-sys-shape-corner-small);
  overflow: hidden;
  background-color: var(--group-color, var(--md-sys-color-primary));
  flex-shrink: 0;
}

.m3-inst-group-header__grid-item {
  pointer-events: none;
}

.m3-inst-group-header__info {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-width: 0;
}

.m3-inst-group-header__name {
  font-size: 13px;
  font-weight: 600;
  color: var(--md-sys-color-on-surface);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.m3-inst-group-header__count {
  font-size: 11px;
  color: var(--md-sys-color-on-surface-variant);
}

.m3-inst-group-header__chevron {
  font-size: 18px;
  color: var(--md-sys-color-on-surface-variant);
  transition: transform var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
  flex-shrink: 0;
}

.m3-inst-group-header__chevron--open {
  transform: rotate(90deg);
}

/* Empty state */
.m3-inst-drawer__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  text-align: center;
}

.m3-inst-drawer__empty-icon {
  font-size: 36px;
  color: var(--md-sys-color-on-surface-variant);
  margin-bottom: 8px;
}

.m3-inst-drawer__empty-text {
  font-size: 13px;
  color: var(--md-sys-color-on-surface-variant);
}

/* Add button */
.m3-inst-drawer__add-btn-wrapper {
  padding: 8px 12px;
  flex-shrink: 0;
}

.m3-inst-drawer__add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 40px;
  border-radius: var(--md-sys-shape-corner-full);
  border: 1.5px dashed var(--md-sys-color-outline-variant);
  background: transparent;
  color: var(--md-sys-color-on-surface-variant);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  transition:
    background-color var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard),
    border-color var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard),
    color var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
}

.m3-inst-drawer__add-btn:hover {
  background-color: rgba(var(--md-sys-color-on-surface-rgb, 227, 227, 227), 0.06);
  border-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-primary);
}

.m3-inst-drawer__add-btn:focus-visible {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 2px;
}

.m3-inst-drawer__add-label {
  /* Hidden when rail is narrow */
}
</style>
