<template>
  <ATabs
    :active-key="config.props.stepsMode ? current : undefined"
    :type="config.props.type"
    :centered="config.props.centered"
    :size="config.props.size"
    :destroy-inactive-tab-pane="config.props.destroyInactivePanes"
  >
    <ATabPane v-for="(pane, i) in config.props.children" :key="i" :tab="pane.title">
      <template v-if="ctx?.prod">
        <WidgetRenderer v-for="widget in pane.widgets" :key="widget.uid" :config="widget" />
      </template>
      <template v-if="!ctx">
        <div class="draggable-area" :class="{ 'empty-slot': pane.widgets.length <= 0 }">
          <Nested :widgets="pane.widgets" />
        </div>
      </template>
    </ATabPane>
  </ATabs>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRendererInjection } from '../../_hooks'
import Nested from '../../form-designer/canvas/nested.vue'
import WidgetRenderer from '../index.vue'
import type { WidgetMap } from '@/types/fux-core/form'

const { config } = defineProps<{
  config: WidgetMap['tabs']
}>()

const current = ref(0)

const ctx = useRendererInjection()
</script>
