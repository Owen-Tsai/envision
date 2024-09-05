<template>
  <GridRenderer v-if="widget.type === 'grid'" :widget="widget" />
  <TabsRenderer v-else-if="widget.type === 'tabs'" :widget="widget" />
  <StepsRenderer v-else-if="widget.type === 'steps'" :widget="widget" />
  <SubFormRenderer v-else-if="widget.type === 'subForm'" :config="widget" />

  <AFormItem
    v-else-if="widget.class === 'form'"
    :label="widget.props.field.label"
    :name="
      parentFormConfig
        ? [parentFormConfig.field, parentFormConfig.index, widget.props.field.name || widget.uid]
        : widget.props.field.name
    "
    :label-col="labelCol"
    :label-align="widget.props.field?.labelAlign"
    :wrapper-col="wrapperCol"
    :extra="widget.props.field?.extra"
    :rules="rules"
  >
    <component :is="widgetToRender" :config="widget" />
  </AFormItem>

  <component v-if="widget.class === 'special'" :is="widgetToRender" :config="widget" />
</template>

<script setup lang="ts">
import { computed, provide, type PropType, type Component } from 'vue'
import { camelCase } from 'lodash'
import { tryParse } from '@/utils/fusion'
import SubFormRenderer from './layout-widgets/sub-form.vue'
import GridRenderer from './layout-widgets/grid.vue'
import TabsRenderer from './layout-widgets/tabs.vue'
import StepsRenderer from './layout-widgets/steps.vue'
import {
  parentFieldKey,
  type FormWidget,
  type Widget,
  type ParentFormPropType
} from '@/types/workflow'

const components = import.meta.glob('@/components/form-renderer/widgets/*.vue', { eager: true })

defineOptions({ name: 'WidgetRenderer' })

const props = defineProps({
  widget: {
    type: Object as PropType<Widget>,
    required: true
  },
  parentFormConfig: {
    type: Object as PropType<ParentFormPropType>
  }
})

const labelCol = computed(() => {
  const width = (props.widget as FormWidget).props.field?.labelWidth
  return width ? { style: { width } } : tryParse((props.widget as FormWidget).props.field?.labelCol)
})

const wrapperCol = computed(() => {
  return tryParse(props.widget.props.field?.wrapperCol)
})

const rules = computed(() => tryParse((props.widget as FormWidget).props.field.rules))

const widgetToRender = computed(() => {
  const type = props.widget.type
  for (const key in components) {
    if (camelCase(key.split('/')[5].split('.vue')[0]) === type) {
      return (components[key] as any).default as Component
    }
  }

  return null
})

provide(parentFieldKey, props.parentFormConfig)
</script>
