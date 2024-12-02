<template>
  <AFormItem :label="config.props.field.label" :rules="rules">
    <div class="entry-container">
      <div class="entry" v-for="(entry, index) in model[field]" :key="index">
        <div v-for="(widget, j) in config.props.children" :key="j">
          <WidgetRenderer :config="transformConfig(widget, index)" :fields="fields" />
        </div>

        <ATooltip title="删除此组">
          <AButton
            class="btn-remove z-1"
            :icon="h(DeleteOutlined)"
            shape="circle"
            danger
            @click="removeEntry(index)"
          />
        </ATooltip>
      </div>

      <AButton class="btn-add" block type="dashed" :icon="h(PlusOutlined)" @click="addEntry">
        新增一项
      </AButton>
    </div>
  </AFormItem>
</template>

<script setup lang="ts">
import { h, ref, computed } from 'vue'
import { cloneDeep } from 'lodash-es'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import WidgetRenderer from '../index.vue'
import { useModel } from '../../_hooks'
import type { FormItemProps } from 'ant-design-vue'
import type { WidgetMap, Widget } from '@/types/fux-core/form'

const { config } = defineProps<{
  config: WidgetMap['subForm']
  fields: any[]
}>()

const { model } = useModel(config)
const field = ref(config.props.field.name || config.uid)

const rules = computed<FormItemProps['rules']>(() => {
  return [
    {
      validator: (rule, value, callback) => {
        if (config.props.min) {
          if (model.value[field.value].length < config.props.min) {
            callback(`至少添加${config.props.min}项`)
          }
        } else if (config.props.max) {
          if (model.value[field.value].length > config.props.max) {
            callback(`最多添加${config.props.max}项`)
          }
        }
        callback()
      }
    }
  ]
})

const transformConfig = (widget: Widget, index: number): Widget => {
  if (widget.class === 'form') {
    const clone = cloneDeep(widget)
    clone.props.field.name = `${config.props.field.name}.${index}.${widget.props.field.name}`
    return clone
  }

  return widget
}

const addEntry = () => {
  model.value[field.value].push({})
}

const removeEntry = (i: number) => {
  model.value[field.value].splice(i, 1)
}
</script>
