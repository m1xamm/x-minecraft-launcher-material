<template>
  <div class="m3-text-field" :class="{ 'm3-text-field--disabled': disabled, 'm3-text-field--focused': focused, 'm3-text-field--error': error }">
    <div class="m3-text-field__container">
      <v-icon v-if="leadingIcon" class="m3-text-field__icon m3-text-field__icon--leading" :icon="leadingIcon" />
      
      <div class="m3-text-field__input-wrapper">
        <label v-if="label" class="m3-text-field__label" :class="{ 'm3-text-field__label--floated': floated }">{{ label }}</label>
        <input
          class="m3-text-field__input"
          :type="type"
          :value="modelValue"
          :placeholder="floated ? placeholder : ''"
          :disabled="disabled"
          @input="onInput"
          @focus="onFocus"
          @blur="onBlur"
        />
      </div>

      <button v-if="trailingIcon || clearable" class="m3-text-field__trailing-btn" @click="onTrailingClick">
        <v-icon class="m3-text-field__icon m3-text-field__icon--trailing" :icon="computedTrailingIcon" />
      </button>
    </div>
    <div v-if="supportingText" class="m3-text-field__supporting-text">{{ supportingText }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: string | number
  label?: string
  placeholder?: string
  type?: string
  leadingIcon?: string
  trailingIcon?: string
  clearable?: boolean
  disabled?: boolean
  error?: boolean
  supportingText?: string
}>(), {
  type: 'text',
  clearable: false,
  disabled: false,
  error: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'click:trailing'): void
  (e: 'clear'): void
}>()

const focused = ref(false)

const floated = computed(() => {
  return focused.value || (props.modelValue !== '' && props.modelValue != null)
})

const computedTrailingIcon = computed(() => {
  if (props.clearable && props.modelValue) return 'close'
  return props.trailingIcon
})

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function onFocus() { focused.value = true }
function onBlur() { focused.value = false }

function onTrailingClick() {
  if (props.clearable && props.modelValue) {
    emit('update:modelValue', '')
    emit('clear')
  } else {
    emit('click:trailing')
  }
}
</script>

<style scoped>
.m3-text-field {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.m3-text-field__container {
  display: flex;
  align-items: center;
  background-color: var(--md-sys-color-surface-container-highest);
  border-radius: var(--md-sys-shape-corner-extra-small) var(--md-sys-shape-corner-extra-small) 0 0;
  height: 56px;
  padding: 0 16px;
  position: relative;
  border-bottom: 1px solid var(--md-sys-color-outline);
  transition: background-color var(--md-sys-motion-duration-short4),
              border-color var(--md-sys-motion-duration-short4);
}

.m3-text-field--focused .m3-text-field__container {
  border-bottom: 2px solid var(--md-sys-color-primary);
  background-color: var(--md-sys-color-surface-container-high);
}

.m3-text-field--error .m3-text-field__container {
  border-bottom-color: var(--md-sys-color-error);
}

.m3-text-field__icon {
  font-size: 24px;
  color: var(--md-sys-color-on-surface-variant);
}
.m3-text-field--focused .m3-text-field__icon {
  color: var(--md-sys-color-primary);
}
.m3-text-field--error .m3-text-field__icon {
  color: var(--md-sys-color-error);
}
.m3-text-field__icon--leading {
  margin-right: 16px;
}
.m3-text-field__icon--trailing {
  margin-left: 16px;
}

.m3-text-field__input-wrapper {
  flex-grow: 1;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.m3-text-field__label {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  color: var(--md-sys-color-on-surface-variant);
  font-family: var(--md-sys-typescale-body-large-font, 'Roboto', sans-serif);
  font-size: var(--md-sys-typescale-body-large);
  pointer-events: none;
  transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
}

.m3-text-field__label--floated {
  top: 16px;
  font-size: var(--md-sys-typescale-body-small);
}

.m3-text-field--focused .m3-text-field__label {
  color: var(--md-sys-color-primary);
}
.m3-text-field--error .m3-text-field__label {
  color: var(--md-sys-color-error);
}

.m3-text-field__input {
  width: 100%;
  background: transparent;
  border: none;
  color: var(--md-sys-color-on-surface);
  font-family: var(--md-sys-typescale-body-large-font, 'Roboto', sans-serif);
  font-size: var(--md-sys-typescale-body-large);
  outline: none;
  padding-top: 14px; /* Space for floated label */
}

.m3-text-field__trailing-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}

.m3-text-field__supporting-text {
  font-family: var(--md-sys-typescale-body-small-font, 'Roboto', sans-serif);
  font-size: var(--md-sys-typescale-body-small);
  color: var(--md-sys-color-on-surface-variant);
  padding: 4px 16px 0;
}
.m3-text-field--error .m3-text-field__supporting-text {
  color: var(--md-sys-color-error);
}

/* Disabled */
.m3-text-field--disabled .m3-text-field__container {
  background-color: rgba(var(--md-sys-color-on-surface-rgb, 227, 227, 227), 0.04);
  border-bottom-color: rgba(var(--md-sys-color-on-surface-rgb, 227, 227, 227), 0.38);
}
.m3-text-field--disabled .m3-text-field__label,
.m3-text-field--disabled .m3-text-field__icon,
.m3-text-field--disabled .m3-text-field__input {
  color: rgba(var(--md-sys-color-on-surface-rgb, 227, 227, 227), 0.38);
}
</style>
