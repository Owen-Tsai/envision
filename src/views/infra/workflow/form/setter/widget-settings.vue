<template>
  <div>
    <AForm v-if="selectedWidget !== undefined" :model="selectedWidget" layout="vertical">
      <template
        v-if="
          selectedWidget.type !== 'grid' &&
          selectedWidget.type !== 'tabs' &&
          selectedWidget.type !== 'steps'
        "
      >
        <AFormItem label="字段标识" extra="表单字段的唯一标识">
          <AInput v-model:value="selectedWidget.props.field.name" />
        </AFormItem>
        <AFormItem label="字段标签">
          <AInput v-model:value="selectedWidget.props.field.label" />
        </AFormItem>
        <AFormItem label="标签对齐方式">
          <ASelect
            v-model:value="selectedWidget.props.field.labelAlign"
            :options="labelAlignOpts"
          />
        </AFormItem>
        <AFormItem label="标签列属性">
          <AInput v-model:value="selectedWidget.props.field.labelCol" />
        </AFormItem>
        <AFormItem label="标签列宽度">
          <AInput
            v-model:value="selectedWidget.props.field.labelWidth"
            placeholder="输入含单位的值(px/%)"
          />
        </AFormItem>
        <AFormItem label="组件列属性">
          <AInput v-model:value="selectedWidget.props.field.wrapperCol" />
        </AFormItem>
      </template>

      <template v-else>
        <AFormItem label="字段标识" extra="表单字段的唯一标识">
          <AInput v-model:value="selectedWidget.props.field.name" />
        </AFormItem>
        <AFormItem label="组件列属性">
          <AInput v-model:value="selectedWidget.props.field.wrapperCol" />
        </AFormItem>
      </template>

      <component :is="comp" :opts="selectedWidget.props" />
    </AForm>
    <div v-else>
      <AEmpty description="选择一个组件以开始配置" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject, computed } from 'vue'
import { find, kebabCase } from 'lodash'
import { labelAlignOpts } from './use-settings-data'
import { injectionKey, type FormCreatorCtx } from '@/types/workflow'

const { selectedWidget } = inject<FormCreatorCtx>(injectionKey)!
const setterComps = import.meta.glob('./setting-fields/*.vue', { eager: true })

const comp = computed(() => {
  if (!selectedWidget.value) {
    return undefined
  }
  const type = selectedWidget.value.type
  return (
    find(
      setterComps,
      (val, key) => key.split('setting-fields/')[1].replace('.vue', '') === kebabCase(type)
    ) as any
  ).default
})
</script>
