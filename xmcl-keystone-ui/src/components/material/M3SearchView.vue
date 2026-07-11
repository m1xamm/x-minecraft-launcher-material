<template>
  <div class="m3-search-view" :class="{ 'm3-search-view--active': active }">
    <div class="m3-search-view__header">
      <button class="m3-search-view__back-btn" @click="$emit('update:active', false)">
        <v-icon icon="arrow_back" />
      </button>
      
      <input
        ref="inputRef"
        class="m3-search-view__input"
        :value="modelValue"
        :placeholder="placeholder"
        @input="onInput"
      />
      
      <button v-if="modelValue && clearable" class="m3-search-view__clear-btn" @click="onClear">
        <v-icon icon="close" />
      </button>
    </div>
    
    <div class="m3-search-view__content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  active: boolean
  modelValue: string
  placeholder?: string
  clearable?: boolean
}>(), {
  placeholder: 'Search...',
  clearable: true
})

const emit = defineEmits<{
  (e: 'update:active', val: boolean): void
  (e: 'update:modelValue', val: string): void
  (e: 'clear'): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)

watch(() => props.active, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      inputRef.value?.focus()
    }, 100)
  }
})

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}

function onClear() {
  emit('update:modelValue', '')
  emit('clear')
  inputRef.value?.focus()
}
</script>

<style scoped>
.m3-search-view {
  position: absolute;
  inset: 0;
  z-index: 100;
  background-color: var(--md-sys-color-surface);
  display: flex;
  flex-direction: column;
  opacity: 0;
  pointer-events: none;
  transform: translateY(-20px);
  transition: all var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-emphasized);
}

.m3-search-view--active {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

.m3-search-view__header {
  display: flex;
  align-items: center;
  height: 72px; /* M3 Search View header height */
  padding: 0 16px;
  background-color: var(--md-sys-color-surface);
}

.m3-search-view__back-btn,
.m3-search-view__clear-btn {
  background: transparent;
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--md-sys-color-on-surface);
  transition: background-color var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
}

.m3-search-view__back-btn:hover,
.m3-search-view__clear-btn:hover {
  background-color: rgba(var(--md-sys-color-on-surface-rgb, 227, 227, 227), 0.08);
}

.m3-search-view__input {
  flex-grow: 1;
  background: transparent;
  border: none;
  color: var(--md-sys-color-on-surface);
  font-family: var(--md-sys-typescale-body-large-font, 'Roboto', sans-serif);
  font-size: var(--md-sys-typescale-body-large);
  outline: none;
  padding: 0 16px;
  height: 100%;
}

.m3-search-view__input::placeholder {
  color: var(--md-sys-color-on-surface-variant);
}

.m3-search-view__content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 0; /* Call site handles padding */
}
</style>
