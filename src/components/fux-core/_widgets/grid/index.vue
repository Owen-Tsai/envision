<template>
  <ARow
    :align="config.props.align"
    :gutter="config.props.gutter"
    :justify="config.props.justify"
    :wrap="config.props.wrap"
  >
    <ACol v-for="(col, i) in config.props.children" :key="i" :span="col.span">
      <!-- widget renderer loop rendering -->
      <template v-if="ctx && ctx.mode && ctx.mode !== 'dev'">
        <WidgetRenderer
          v-for="widget in col.widgets"
          :key="widget.uid"
          :config="widget"
          :fields="fields"
          :mode="mode"
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
import type { FuxRendererMode } from '@/types/fux-core/form/context'

const { config, fields, mode } = defineProps<{
  config: WidgetMap['grid']
  fields?: any[]
  mode?: FuxRendererMode
}>()

const ctx = useRendererInjection()
</script>
