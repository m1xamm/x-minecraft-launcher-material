<template>
  <div class="m3-connected-card" :class="`m3-connected-card--${direction}`">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  direction?: 'column' | 'row'
}>(), {
  direction: 'column'
})
</script>

<style>
/* 
  We use un-scoped styles (or deep selectors) because we need to style the slot content.
  The slot content is expected to be a list of M3Card or similar components.
*/
.m3-connected-card {
  display: flex;
  gap: 2px; /* Small gap to show the cut or use a border. M3E often uses 2px gap instead of a 1px border. */
}

.m3-connected-card--column {
  flex-direction: column;
}

.m3-connected-card--row {
  flex-direction: row;
}

/* 
  Column Logic
  Top element gets large top corners, small bottom corners.
  Middle elements get small corners everywhere.
  Bottom element gets small top corners, large bottom corners.
*/
.m3-connected-card--column > * {
  border-radius: var(--md-sys-shape-inner-shared) !important;
}
.m3-connected-card--column > *:first-child {
  border-top-left-radius: var(--md-sys-shape-corner-large) !important;
  border-top-right-radius: var(--md-sys-shape-corner-large) !important;
}
.m3-connected-card--column > *:last-child {
  border-bottom-left-radius: var(--md-sys-shape-corner-large) !important;
  border-bottom-right-radius: var(--md-sys-shape-corner-large) !important;
}
.m3-connected-card--column > *:only-child {
  border-radius: var(--md-sys-shape-corner-large) !important;
}

/* Row Logic */
.m3-connected-card--row > * {
  border-radius: var(--md-sys-shape-inner-shared) !important;
}
.m3-connected-card--row > *:first-child {
  border-top-left-radius: var(--md-sys-shape-corner-large) !important;
  border-bottom-left-radius: var(--md-sys-shape-corner-large) !important;
}
.m3-connected-card--row > *:last-child {
  border-top-right-radius: var(--md-sys-shape-corner-large) !important;
  border-bottom-right-radius: var(--md-sys-shape-corner-large) !important;
}
.m3-connected-card--row > *:only-child {
  border-radius: var(--md-sys-shape-corner-large) !important;
}
</style>
