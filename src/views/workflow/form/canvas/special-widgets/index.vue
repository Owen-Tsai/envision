/** Special widgets don't belong to FormContext, thus should not be rendered under FormItem */
<template>
  <div
    class="widget-wrapper"
    :class="{ selected: selectedWidget?.uid === config.uid }"
    @click="selectWidget(config)"
  >
    <component :is="widget" :config="config" />

    <div class="field-name">
      {{ config.props.field.name || config.uid }}
    </div>
    <div class="drag-handle">
      <FullscreenOutlined :rotate="45" />
    </div>
    <div class="actions">
      <ATooltip title="复制">
        <div class="action" @click.stop="duplicateWidget(config, siblings)">
          <CopyFilled />
        </div>
      </ATooltip>
      <ATooltip title="删除">
        <div class="action" @click.stop="deleteWidget(config.uid, siblings)">
          <DeleteFilled />
        </div>
      </ATooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType, type Component } from 'vue'
import { useWidget } from '../../use-widgets'
import { FullscreenOutlined, DeleteFilled, CopyFilled } from '@ant-design/icons-vue'
import { camelCase } from 'lodash'
import { type SpecialWidget, type Widget } from '@/types/workflow/form'

const components = import.meta.glob('@/components/form-renderer/widgets/*.vue', { eager: true })

const props = defineProps({
  config: {
    type: Object as PropType<SpecialWidget>,
    required: true
  },
  siblings: {
    type: Array as PropType<Widget[]>
  }
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

const { selectWidget, selectedWidget, deleteWidget, duplicateWidget } = useWidget()
</script>
