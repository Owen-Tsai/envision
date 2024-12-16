<template>
  <div class="container relative flex flex-col">
    <div class="header flex items-center justify-between flex-shrink-0">
      <span>{{ title }}</span>
      <span>
        <slot name="extra"></slot>
      </span>
    </div>
    <div class="body flex-1">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const { title } = defineProps<{
  title?: string
}>()
</script>

<style lang="scss" scoped>
.header {
  background: url('~vis/chart-header.svg') center no-repeat;
  background-size: 100% 100%;
}
</style>
