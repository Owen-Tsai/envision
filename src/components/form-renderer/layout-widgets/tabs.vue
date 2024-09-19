<template>
  <ATabs
    :centered="widget.props.centered"
    :type="widget.props.type"
    :size="widget.props.size"
    :destroy-inactive-tab-pane="widget.props.destroyInactivePanes"
  >
    <ATabPane v-for="(pane, i) in widget.props.children" :key="i" :tab="pane.title">
      <WidgetRenderer
        v-for="child in pane.widgets"
        :key="child.uid"
        :widget="child"
        :parent-form-config="parentFormConfig"
      />
    </ATabPane>
  </ATabs>
</template>

<script setup lang="ts">
import { ref, inject, type PropType } from 'vue'
import WidgetRenderer from '../widget-renderer.vue'
import {
  parentFieldKey,
  type WidgetConfigMap,
  type ParentFormPropType
} from '@/types/workflow/form'

defineProps({
  widget: {
    type: Object as PropType<WidgetConfigMap['tabs']>,
    required: true
  }
})

// todo: add configs for stepMode, which disables manual switching
const current = ref(0)

const parentFormConfig = inject<ParentFormPropType | undefined>(parentFieldKey, undefined)
</script>
