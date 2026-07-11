<template>
  <div
    class="m3-search-bar"
    :class="{ 'm3-search-bar--focused': focused, 'm3-search-bar--disabled': disabled }"
    @click="onClick"
  >
    <v-icon class="m3-search-bar__leading-icon" :icon="leadingIcon" />
    
    <input
      ref="inputRef"
      class="m3-search-bar__input"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
    />
    
    <button v-if="modelValue && clearable" class="m3-search-bar__trailing-btn" @click.stop="onClear">
      <v-icon class="m3-search-bar__trailing-icon" icon="close" />
    </button>
    <button v-else-if="trailingIcon" class="m3-search-bar__trailing-btn" @click.stop="$emit('click:trailing')">
      <v-icon class="m3-search-bar__trailing-icon" :icon="trailingIcon" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  leadingIcon?: string
  trailingIcon?: string
  clearable?: boolean
  disabled?: boolean
}>(), {
  placeholder: 'Search...',
  leadingIcon: 'search',
  clearable: true,
  disabled: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'click:trailing'): void
  (e: 'clear'): void
  (e: 'focus'): void
  (e: 'blur'): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const focused = ref(false)

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}

function onClear() {
  emit('update:modelValue', '')
  emit('clear')
  inputRef.value?.focus()
}

function onClick() {
  inputRef.value?.focus()
}

function onFocus() {
  focused.value = true
  emit('focus')
}

function onBlur() {
  focused.value = false
  emit('blur')
}
</script>

<style scoped>
.m3-search-bar {
  display: flex;
  align-items: center;
  height: 56px;
  border-radius: var(--md-sys-shape-corner-full);
  background-color: var(--md-sys-color-surface-container-high);
  padding: 0 16px;
  cursor: text;
  transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
  box-shadow: var(--md-sys-elevation-0);
}

.m3-search-bar--focused {
  background-color: var(--md-sys-color-surface-container-highest);
}

/* Hover State */
.m3-search-bar:hover:not(.m3-search-bar--disabled) {
  background-color: var(--md-sys-color-surface-container-highest);
}

.m3-search-bar__leading-icon {
  color: var(--md-sys-color-on-surface);
  font-size: 24px;
  margin-right: 16px;
}

.m3-search-bar__input {
  flex-grow: 1;
  background: transparent;
  border: none;
  color: var(--md-sys-color-on-surface);
  font-family: var(--md-sys-typescale-body-large-font, 'Roboto', sans-serif);
  font-size: var(--md-sys-typescale-body-large);
  outline: none;
  height: 100%;
}

.m3-search-bar__input::placeholder {
  color: var(--md-sys-color-on-surface-variant);
}

.m3-search-bar__trailing-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  margin-right: -8px;
  transition: background-color var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
}

.m3-search-bar__trailing-btn:hover {
  background-color: rgba(var(--md-sys-color-on-surface-rgb, 227, 227, 227), 0.08);
}

.m3-search-bar__trailing-icon {
  color: var(--md-sys-color-on-surface-variant);
  font-size: 24px;
}

/* Disabled */
.m3-search-bar--disabled {
  background-color: rgba(var(--md-sys-color-on-surface-rgb, 227, 227, 227), 0.04);
  cursor: default;
}
.m3-search-bar--disabled .m3-search-bar__leading-icon,
.m3-search-bar--disabled .m3-search-bar__input,
.m3-search-bar--disabled .m3-search-bar__trailing-icon {
  color: rgba(var(--md-sys-color-on-surface-rgb, 227, 227, 227), 0.38);
}
</style>
