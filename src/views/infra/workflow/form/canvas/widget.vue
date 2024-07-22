/** Contains only FormWidgets, no nested structure will be presented */
<template>
  <div
    class="widget-wrapper"
    :class="{ selected: selectedWidget?.uid === config.uid }"
    @click="selectedWidget = config"
  >
    <AFormItem
      :label="config.props.field?.label"
      :name="config.props.field?.name"
      :label-col="labelCol"
      :label-align="config.props.field?.labelAlign"
      :wrapper-col="wrapperCol"
      :extra="config.props.field?.extra"
    >
      <component :is="widget" :config="config" />
    </AFormItem>
    <div class="field-name">
      {{ config.props.field.name || config.uid }}
    </div>
    <div class="drag-handle">
      <FullscreenOutlined :rotate="45" />
    </div>
    <div class="actions">
      <ATooltip title="复制">
        <div class="action" @click.stop="duplicateWidget(config)">
          <CopyFilled />
        </div>
      </ATooltip>
      <ATooltip title="删除">
        <div class="action" @click.stop="deleteWidget(config.uid)">
          <DeleteFilled />
        </div>
      </ATooltip>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, type PropType, type Component } from 'vue'
import { FullscreenOutlined, DeleteFilled, CopyFilled } from '@ant-design/icons-vue'
import { camelCase } from 'lodash'
import { tryParse } from '@/utils/envision'
import {
  injectionKey,
  type FormWidget,
  type LayoutWidget,
  type FormCreatorCtx
} from '@/types/workflow'

const components = import.meta.glob('@/components/form-renderer/widgets/*.vue', { eager: true })

const props = defineProps({
  config: {
    type: Object as PropType<FormWidget>,
    required: true
  },
  parentNode: {
    type: Object as PropType<LayoutWidget>
  }
})

const { selectedWidget, deleteWidget, duplicateWidget } = inject<FormCreatorCtx>(injectionKey)!

const labelCol = computed(() => {
  const width = props.config.props.field?.labelWidth
  return width ? { style: { width } } : tryParse(props.config.props.field?.labelCol)
})

const wrapperCol = computed(() => {
  return tryParse(props.config.props.field?.wrapperCol)
})

const widget = computed(() => {
  const type = props.config.type
  for (const key in components) {
    if (camelCase(key.split('/')[5].split('.vue')[0]) === type) {
      return (components[key] as any).default as Component
    }
  }

  return null
})
</script>

<style lang="scss" scoped>
.widget-wrapper {
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: transparent;
    z-index: 9;
  }
}
</style>
