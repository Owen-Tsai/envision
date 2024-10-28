<template>
  <Draggable
    :list="widgets"
    group="fux"
    :animation="200"
    handle=".drag-handle"
    ghost-class="ghost"
    item-key="uid"
    :swap-threshold="0.1"
    class="h-full"
  >
    <template #item="{ element }: { element: Widget; index: number }">
      <WidgetWrapper :widget="element">
        <WidgetRenderer :config="element" />
      </WidgetWrapper>
    </template>
  </Draggable>
</template>

<script setup lang="ts">
import Draggable from 'vuedraggable'
import WidgetWrapper from './widget-wrapper.vue'
import WidgetRenderer from '../../_widgets/index.vue'
import type { Widget } from '@/types/fux-core/form'

const { widgets } = defineProps<{
  widgets: Widget[]
}>()
</script>
