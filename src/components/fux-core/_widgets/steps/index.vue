<template>
  <ASteps
    :current="ctx?.prod ? current : undefined"
    :size="config.props.size"
    :type="config.props.type === 'dot' ? undefined : config.props.type"
    :progress-dot="config.props.type === 'dot'"
    :items="constructSteps(config.props.children)"
  />
  <div v-for="(step, i) in config.props.children" :key="i">
    <div v-if="i === current" class="steps-container pt-4">
      <template v-if="ctx?.prod">
        <WidgetRenderer v-for="widget in step.widgets" :key="widget.uid" :config="widget" />
      </template>
      <template v-if="!ctx">
        <div class="draggable-area" :class="{ 'empty-slot': step.widgets.length <= 0 }">
          <Nested :widgets="step.widgets" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRendererInjection } from '../../_hooks'
import Nested from '../../form-designer/canvas/nested.vue'
import WidgetRenderer from '../index.vue'
import constructSteps from '../../_utils/construct-steps'
import type { WidgetMap } from '@/types/fux-core'

const { config } = defineProps<{
  config: WidgetMap['steps']
}>()

const current = ref(0)

const ctx = useRendererInjection()
</script>
