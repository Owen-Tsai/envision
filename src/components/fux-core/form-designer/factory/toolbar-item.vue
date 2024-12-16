<template>
  <ATooltip placement="right" :arrow="false" :title="title">
    <div class="action" :class="{ active: !!active }">
      <component :is="icon" />
    </div>
  </ATooltip>
</template>

<script setup lang="ts">
import type { PropType, FunctionalComponent } from 'vue'

defineProps({
  title: String,
  icon: Function as PropType<FunctionalComponent>,
  active: Boolean,
})
</script>

<style lang="scss" scoped>
.action {
  cursor: pointer;
  font-size: 18px;
  border-radius: var(--border-radius);
  @apply flex-center size-40px;

  &:hover {
    background-color: var(--color-fill-secondary);
  }

  &.active {
    background-color: var(--color-primary-bg);
    color: var(--color-primary);
  }
}
</style>
