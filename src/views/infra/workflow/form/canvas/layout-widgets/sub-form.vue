<template>
  <AFormItem :label="element.props.field.label">
    <AFormItemRest>
      <div
        class="draggable-area"
        :class="{ 'empty-slot': element.props.children[0].widgets.length <= 0 }"
      >
        <NestedCanvas
          :list="element.props.children[0].widgets"
          :siblings="element.props.children[0].widgets"
        />
      </div>
    </AFormItemRest>
  </AFormItem>
</template>

<script setup lang="ts">
import { type PropType } from 'vue'
import NestedCanvas from '../nested-canvas.vue'
import type { WidgetConfigMap } from '@/types/workflow'

defineProps({
  element: {
    type: Object as PropType<WidgetConfigMap['subForm']>,
    required: true
  }
})
</script>
