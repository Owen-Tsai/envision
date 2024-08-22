<template>
  <ARow
    v-if="widget.type === 'grid'"
    :align="widget.props.align"
    :gutter="widget.props.gutter"
    :justify="widget.props.justify"
    :wrap="widget.props.wrap"
  >
    <ACol v-for="(col, i) in widget.props.children" :key="i" :span="col.span">
      <WidgetRenderer v-for="child in col.widgets" :key="child.uid" :widget="child" />
    </ACol>
  </ARow>
  <ATabs
    v-else-if="widget.type === 'tabs'"
    :centered="widget.props.centered"
    :type="widget.props.type"
    :size="widget.props.size"
    :destroy-inactive-tab-pane="widget.props.destroyInactivePanes"
  >
    <ATabPane v-for="(pane, i) in widget.props.children" :key="i" :tab="pane.title">
      <WidgetRenderer v-for="child in pane.widgets" :key="child.uid" :widget="child" />
    </ATabPane>
  </ATabs>
  <template v-else-if="widget.type === 'steps'">
    <ASteps
      :current="widget.props.model.current"
      :size="widget.props.size"
      :type="widget.props.type === 'dot' ? undefined : widget.props.type"
      :progress-dot="widget.props.type === 'dot'"
      :items="constructStepItems(widget.props.children)"
    />
    <div v-for="(step, i) in widget.props.children" :key="i">
      <div v-if="i === widget.props.model.current" class="steps-container pt-4">
        <WidgetRenderer v-for="child in step.widgets" :key="child.uid" :widget="child" />
      </div>
    </div>
  </template>

  <AFormItem
    v-else
    :label="widget.props.field.label"
    :name="widget.props.field.name"
    :label-col="labelCol"
    :label-align="widget.props.field?.labelAlign"
    :wrapper-col="wrapperCol"
    :extra="widget.props.field?.extra"
    :rules="rules"
  >
    <component :is="widgetToRender" :config="widget" />
  </AFormItem>
</template>

<script setup lang="ts">
import { computed, type PropType, type Component } from 'vue'
import { camelCase } from 'lodash'
import { constructStepItems } from '@/views/infra/workflow/form/use-widgets'
import { tryParse } from '@/utils/envision'
import type { FormWidget, Widget } from '@/types/workflow'

const components = import.meta.glob('@/components/form-renderer/widgets/*.vue', { eager: true })

defineOptions({ name: 'WidgetRenderer' })

const props = defineProps({
  widget: {
    type: Object as PropType<Widget>,
    required: true
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
</script>
