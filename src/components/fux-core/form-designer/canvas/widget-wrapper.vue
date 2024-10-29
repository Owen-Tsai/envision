<template>
  <div
    class="widget-wrapper"
    :class="{
      selected: selectedWidget?.uid === widget.uid,
      'is-form-widget': widget.class === 'form'
    }"
    @click.stop="selectedWidget = widget"
  >
    <slot></slot>

    <div class="caption">
      {{ caption }}
      <EyeInvisibleFilled v-if="widget.props.hide" />
    </div>
    <div class="action drag-handle absolute top-0 left-0 cursor-move">
      <DragOutlined />
    </div>
    <div class="actions absolute bottom-0 right-0 flex items-center gap-1">
      <div class="action cursor-pointer" @click.stop="copyWidget(widget)">
        <CopyFilled />
      </div>
      <div class="action cursor-pointer" @click.stop="deleteWidget(widget.uid)">
        <DeleteFilled />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDesignerInjection } from '../../_hooks'
import type { Widget, FormWidget } from '@/types/fux-core/form'

const { widget } = defineProps<{
  widget: Widget
}>()

const { deleteWidget, selectedWidget, copyWidget } = useDesignerInjection()

const caption = computed(() => {
  return (widget as FormWidget).props.field?.name || widget.uid
})
</script>

<style lang="scss" scoped>
.widget-wrapper {
  position: relative;
  outline: 2px dashed var(--colorBorder);
  @apply p-4;
  padding-top: 20px;
  padding-bottom: 22px;
  border-radius: var(--borderRadius);
  user-select: none;

  &.selected {
    outline-style: solid;
    outline-color: var(--colorPrimary);
    & > .actions > .action,
    & > .action {
      display: inline-flex;
    }
    & > .caption {
      color: var(--colorPrimary);
    }
  }

  &:not(.selected):hover {
    outline-color: var(--colorPrimaryBorder);
  }

  & + & {
    margin-top: 8px;
  }

  &.is-form-widget::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
}
.action {
  display: none;
  background-color: var(--colorPrimary);
  color: #fff;
  align-items: center;
  justify-content: center;
  padding: 4px;
  font-size: var(--fontSizeSM);
  z-index: 2;
}
.caption {
  position: absolute;
  right: 4px;
  top: 0;
  font-size: var(--fontSizeSM);
  color: var(--colorTextTertiary);
  @apply font-mono;
}
</style>
