<template>
  <ARow
    :align="element.props.align"
    :gutter="element.props.gutter"
    :justify="element.props.justify"
    :wrap="element.props.wrap"
  >
    <ACol v-for="(col, i) in element.props.children" :key="i" :span="col.span">
      <div class="draggable-area" :class="{ 'empty-slot': col.widgets.length <= 0 }">
        <NestedCanvas :list="col.widgets" :siblings="col.widgets" />
      </div>
    </ACol>
  </ARow>
</template>

<script setup lang="ts">
import { type PropType } from 'vue'
import NestedCanvas from '../nested-canvas.vue'
import type { WidgetConfigMap } from '@/types/workflow/form'

defineProps({
  element: {
    type: Object as PropType<WidgetConfigMap['grid']>,
    required: true
  }
})
</script>
