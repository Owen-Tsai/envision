<template>
  <ARow
    v-if="widget.type === 'grid'"
    :align="widget.props.align"
    :gutter="widget.props.gutter"
    :justify="widget.props.justify"
    :wrap="widget.props.wrap"
  >
    <ACol v-for="(col, i) in widget.props.children" :key="i" :span="col.span">
      <WidgetRenderer
        v-for="child in col.widgets"
        :key="child.uid"
        :widget="child"
        :field-ctx-config="fieldCtxConfig"
      />
    </ACol>
  </ARow>
</template>

<script setup lang="ts">
import { inject, type PropType } from 'vue'
import WidgetRenderer from '../widget-renderer.vue'
import { fieldCtxConfigKey, type WidgetConfigMap, type FieldCtxConfig } from '@/types/workflow/form'

defineProps({
  widget: {
    type: Object as PropType<WidgetConfigMap['grid']>,
    required: true
  }
})

const fieldCtxConfig = inject<FieldCtxConfig | undefined>(fieldCtxConfigKey, undefined)
</script>
