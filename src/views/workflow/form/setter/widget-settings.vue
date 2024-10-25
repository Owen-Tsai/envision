<template>
  <div>
    <AForm v-if="selectedWidget !== undefined" :model="selectedWidget" layout="vertical">
      <template v-if="selectedWidget.class === 'form'">
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
        <AFormItem v-if="selectedWidget.type === 'subForm'" label="字段标签">
          <AInput v-model:value="selectedWidget.props.field.label" />
        </AFormItem>
        <AFormItem label="组件列属性" v-if="selectedWidget.class !== 'special'">
          <AInput v-model:value="selectedWidget.props.field.wrapperCol" />
        </AFormItem>
      </template>

      <component :is="comp" :opts="selectedWidget.props" />

      <template v-if="selectedWidget.class === 'form'">
        <AFormItem label="是否必填" name="required" class="setter-boolean-field">
          <ASwitch v-model:checked="selectedWidget.props.field.required" />
        </AFormItem>
        <!-- rules -->
        <AFormItem label="校验时机" extra="组件可能不响应全部校验时机">
          <ASelect
            v-model:value="selectedWidget.props.field.validateTrigger"
            :options="validationTriggerOpts"
            mode="multiple"
            :show-search="false"
            show-arrow
          />
        </AFormItem>
        <AFormItem label="校验规则">
          <AFormItemRest>
            <ASelect
              :options="validateTypeOpts"
              v-model:value="state.validateType"
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
        <AFormItem label="动作列表">
          <ActionConfig v-model:widget="selectedWidget" />
        </AFormItem>
      </template>
    </AForm>
    <div v-else>
      <AEmpty description="选择一个组件以开始配置" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject, computed, type Ref } from 'vue'
import { find, kebabCase } from 'lodash-es'
import { Codemirror } from 'vue-codemirror'
import { labelAlignOpts, validationTriggerOpts } from './use-settings-data'
import useValidator from './use-validator'
import extensions from '../codemirror'
import ActionConfig from './action-settings.vue'
import { injectionKey, type FormCreatorCtx, type FormWidget } from '@/types/workflow/form'

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

const { state, validateTypeOpts, onTypeChange } = useValidator(selectedWidget as Ref<FormWidget>)
</script>
