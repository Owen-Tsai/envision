<template>
  <AEmpty v-if="schema.widgets.length <= 0" description="添加组件进行配置" />
  <AEmpty v-else-if="selectedWidget === undefined" description="选中组件进行配置" />
  <AForm v-else :model="selectedWidget" layout="vertical">
    <AFormItem label="字段标签" name="label">
      <AInput v-model:value="selectedWidget.props.field.label" />
    </AFormItem>
    <AFormItem label="字段名称" name="name">
      <AInput v-model:value="selectedWidget.props.field.name" :placeholder="selectedWidget.uid" />
    </AFormItem>
    <template v-if="selectedWidget.class === 'form'">
      <AFormItem label="组件类型">
        <ASelect
          v-model:value="selectedWidget.type"
          :options="widgetTypeOpts"
          @change="onWdigetTypeChange"
        />
      </AFormItem>
      <AFormItem label="标签对齐方式">
        <ASelect v-model:value="selectedWidget.props.field.labelAlign" :options="labelAlignOpts" />
      </AFormItem>
      <AFormItem label="标签列属性" extra="输入合法的 JSON">
        <AInput v-model:value="selectedWidget.props.field.labelCol" />
      </AFormItem>
      <AFormItem label="标签列宽度" extra="输入含单位的值(px/%)">
        <AInput v-model:value="selectedWidget.props.field.labelWidth" />
      </AFormItem>
      <AFormItem label="组件列属性" extra="输入合法的 JSON">
        <AInput v-model:value="selectedWidget.props.field.wrapperCol" />
      </AFormItem>
    </template>

    <component :is="fragToRender" :attrs="selectedWidget.props" />

    <template v-if="selectedWidget.class === 'form'">
      <AFormItem label="是否必填" name="required" class="boolean-field">
        <ASwitch v-model:checked="selectedWidget.props.field.required" />
      </AFormItem>
      <!-- rules -->
      <AFormItem label="校验时机" extra="组件可能不响应全部校验时机">
        <ASelect
          v-model:value="selectedWidget.props.field.validateTrigger"
          :options="validationTriggerOpts"
          mode="multiple"
          allow-clear
          :show-search="false"
          show-arrow
        />
      </AFormItem>
      <AFormItem label="校验规则">
        <AFormItemRest>
          <ASelect
            :options="validateTypeOpts"
            v-model:value="state.validateType"
            allow-clear
            @change="(v) => onTypeChange(v as string | undefined)"
          />
        </AFormItemRest>
        <Codemirror
          v-show="state.editorVisible"
          v-model="selectedWidget.props.field.rules"
          :tab-size="2"
          :extensions="extensions"
          :style="{ height: '240px', width: '100%', marginTop: '16px' }"
        />
      </AFormItem>
      <!-- event handlers -->
    </template>
  </AForm>
</template>

<script lang="ts" setup>
import { computed, type Ref } from 'vue'
import { kebabCase, cloneDeep } from 'lodash-es'
import { useDesignerInjection } from '../../_hooks'
import { labelAlignOpts, validationTriggerOpts, widgetTypeOpts } from '../../_utils/const'
import useValidator from './use-validation'
import { Codemirror } from 'vue-codemirror'
import extensions from '@/utils/codemirror'
import type { FormWidget } from '@/types/fux-core'
import type { SelectValue } from 'ant-design-vue/es/select'
import initWidgetConfig from '../../_utils/initial-widget-config'

const components = import.meta.glob('../../_widgets/**/settings.vue', {
  eager: true,
  import: 'default'
})

const { schema, selectedWidget } = useDesignerInjection()
const { onTypeChange, state, validateTypeOpts } = useValidator(selectedWidget as Ref<FormWidget>)

const fragToRender = computed(() => {
  if (!selectedWidget.value) return null
  const type = kebabCase(selectedWidget.value.type)
  const frag = components[`../../_widgets/${type}/settings.vue`]
  return frag
})

const onWdigetTypeChange = (v: SelectValue) => {
  const newOpts = cloneDeep(initWidgetConfig[v as keyof FormWidget])
  delete newOpts.icon

  selectedWidget.value!.name = newOpts.name
  selectedWidget.value!.type = newOpts.type
  selectedWidget.value!.props = {
    ...newOpts.props,
    field: {
      name: selectedWidget.value?.props.field.name,
      label: selectedWidget.value?.props.field.label
    }
  }
}
</script>
