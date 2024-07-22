<template>
  <ATooltip placement="right" :arrow="false" :title="tooltip">
    <div class="action" :class="{ active: !!active }">
      <component :is="icon" />
    </div>
  </ATooltip>
</template>

<script setup lang="ts">
import type { PropType, FunctionalComponent } from 'vue'

defineProps({
  tooltip: String,
  icon: Function as PropType<FunctionalComponent>,
  active: Boolean
})
</script>

<style lang="scss" scoped>
.action {
  height: 40px;
  cursor: pointer;
  font-size: 18px;
  border-radius: var(--borderRadius);
  @apply flex-center;

  &:hover {
    background-color: var(--colorFillSecondary);
  }

  &.active {
    background-color: var(--colorPrimaryBg);
    color: var(--colorPrimary);
  }
}
</style>
