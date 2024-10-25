<template>
  <div class="item whitespace-nowrap">
    <div class="icon-wrapper">
      <component :is="widget.icon" class="h-6 w-6" />
    </div>
    <div class="text-wrapper text-center mt-2">
      <div>{{ widget.name }}</div>
      <span>{{ widget.type }}</span>
    </div>
    <div class="drag-placeholder">
      <div class="caption">添加到此处</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Widget } from '@/types/fux-core'

const { widget } = defineProps<{
  widget: Widget
}>()
</script>

<style lang="scss" scoped>
.item {
  user-select: none;
  background-color: var(--colorBgContainer);
  transition: all 0.3s;
  transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: move;
  font-size: var(--fontSizeSM);

  span {
    color: var(--colorTextSecondary);
  }

  .icon-wrapper {
    background-color: var(--colorBgLayout);
    border-radius: var(--borderRadius);
    padding: 16px;
    @apply flex-center;
  }

  &:hover {
    color: var(--colorPrimary);
    span {
      color: var(--colorPrimary);
    }
  }
}

.drag-placeholder {
  display: none;
  align-items: center;
  justify-content: center;
  position: relative;

  &::before {
    background-color: var(--colorPrimary);
    height: 4px;
    position: absolute;
    content: '';
    width: 100%;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 999px;
  }

  .caption {
    background-color: var(--colorPrimary);
    color: #fff;
    border-radius: 999px;
    padding: 4px 8px;
    font-size: var(--fontSizeSM);
    position: relative;
    z-index: 1;
  }
}
</style>
