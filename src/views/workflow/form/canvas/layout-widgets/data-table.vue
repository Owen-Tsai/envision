<template>
  <div class="relative">
    <ATable v-show="mode === 'table'" :columns="element.props.columns" />
    <div v-show="mode === 'form'" class="form">
      <div
        class="draggable-area"
        :class="{ 'empty-slot': element.props.children[0].widgets.length <= 0 }"
        :style="{ width: element.props.children[0].width }"
      >
        <NestedCanvas
          :list="element.props.children[0].widgets"
          :siblings="element.props.children[0].widgets"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import NestedCanvas from '../nested-canvas.vue'
import type { WidgetConfigMap } from '@/types/workflow'

const props = defineProps({
  element: {
    type: Object as PropType<WidgetConfigMap['dataTable']>,
    required: true
  }
})

const mode = computed(() => {
  return props.element.props.model.mode
})
</script>
