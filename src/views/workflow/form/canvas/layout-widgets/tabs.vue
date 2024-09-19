<template>
  <ATabs
    :centered="element.props.centered"
    :type="element.props.type"
    :size="element.props.size"
    :destroy-inactive-tab-pane="element.props.destroyInactivePanes"
  >
    <ATabPane v-for="(pane, i) in element.props.children" :key="i" :tab="pane.title">
      <div class="draggable-area" :class="{ 'empty-slot': pane.widgets.length <= 0 }">
        <NestedCanvas :list="pane.widgets" :siblings="pane.widgets" />
      </div>
    </ATabPane>
  </ATabs>
</template>

<script setup lang="ts">
import { type PropType } from 'vue'
import NestedCanvas from '../nested-canvas.vue'
import type { WidgetConfigMap } from '@/types/workflow/form'

defineProps({
  element: {
    type: Object as PropType<WidgetConfigMap['tabs']>,
    required: true
  }
})
</script>
