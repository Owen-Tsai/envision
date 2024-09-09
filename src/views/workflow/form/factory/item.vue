<template>
  <div class="item">
    <div class="text-center">
      <component :is="widget.icon" class="h-8 w-8" />
    </div>
    <div class="text-center mt-2">
      <div>{{ widget.name }}</div>
      <span>{{ widget.type }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type PropType } from 'vue'
import type { Widget } from '@/types/workflow'

defineProps({
  widget: {
    type: Object as PropType<Widget>,
    required: true
  }
})
</script>

<style lang="scss" scoped>
$icon-size: 28px;

.item {
  @apply py-4;
  user-select: none;
  background-color: var(--colorBgContainer);
  transition: all 0.3s;
  transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: move;
  img {
    height: $icon-size;
    width: $icon-size;
  }

  span {
    color: var(--colorTextSecondary);
    font-size: var(--fontSizeSM);
  }

  &:hover {
    z-index: 1;
    @apply shadow-lg;
  }
}
</style>
