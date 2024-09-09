<template>
  <ASteps
    :current="element.props.model.current"
    :size="element.props.size"
    :type="element.props.type === 'dot' ? undefined : element.props.type"
    :progress-dot="element.props.type === 'dot'"
    :items="constructStepItems(element.props.children)"
  />
  <div v-for="(step, i) in element.props.children" :key="i">
    <div v-if="i === element.props.model.current" class="steps-container pt-4">
      <div class="draggable-area" :class="{ 'empty-slot': step.widgets.length <= 0 }">
        <NestedCanvas :list="step.widgets" :siblings="step.widgets" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue'
import NestedCanvas from '../nested-canvas.vue'
import { constructStepItems } from '@/utils/workflow'
import type { WidgetConfigMap } from '@/types/workflow'

defineProps({
  element: {
    type: Object as PropType<WidgetConfigMap['steps']>,
    required: true
  }
})
</script>
