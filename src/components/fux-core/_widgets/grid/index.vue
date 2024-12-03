<template>
  <ARow
    :align="config.props.align"
    :gutter="config.props.gutter"
    :justify="config.props.justify"
    :wrap="config.props.wrap"
  >
    <ACol v-for="(col, i) in config.props.children" :key="i" :span="col.span">
      <!-- widget renderer loop rendering -->
      <template v-if="ctx?.prod">
        <WidgetRenderer
          v-for="widget in col.widgets"
          :key="widget.uid"
          :config="widget"
          :fields="fields"
        />
      </template>
      <template v-if="!ctx">
        <div class="draggable-area" :class="{ 'empty-slot': col.widgets.length <= 0 }">
          <Nested :widgets="col.widgets" />
        </div>
      </template>
    </ACol>
  </ARow>
</template>

<script setup lang="ts">
import { useRendererInjection } from '../../_hooks'
import Nested from '../../form-designer/canvas/nested.vue'
import WidgetRenderer from '../index.vue'
import type { WidgetMap } from '@/types/fux-core/form'

const { config, fields } = defineProps<{
  config: WidgetMap['grid']
  fields?: any[]
}>()

const ctx = useRendererInjection()
</script>
