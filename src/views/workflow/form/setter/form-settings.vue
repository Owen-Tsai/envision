<template>
  <AForm :model="schema.form" layout="vertical">
    <AFormItem label="布局类型">
      <ASelect v-model:value="schema.form.layout" :options="layoutOpts" />
    </AFormItem>
    <AFormItem v-if="schema.form.layout !== 'vertical'" label="标签对齐方式">
      <ASelect v-model:value="schema.form.labelAlign" :options="labelAlignOpts" />
    </AFormItem>
    <AFormItem label="标签列属性">
      <AInput v-model:value="schema.form.labelCol" />
    </AFormItem>
    <AFormItem label="标签列宽度">
      <AInput v-model:value="schema.form.labelWidth" placeholder="输入含单位的值(px/%)" />
    </AFormItem>
    <AFormItem label="组件列属性">
      <AInput v-model:value="schema.form.wrapperCol" />
    </AFormItem>
    <AFormItem
      v-if="schema.form.layout !== 'vertical'"
      label="显示标签后的冒号"
      class="setter-boolean-field"
    >
      <ASwitch v-model:checked="schema.form.colon" />
    </AFormItem>
    <AFormItem label="禁用表单" class="setter-boolean-field">
      <ASwitch v-model:checked="schema.form.disabled" />
    </AFormItem>
  </AForm>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { labelAlignOpts, layoutOpts } from './use-settings-data'
import { injectionKey, type FormCreatorCtx } from '@/types/workflow'

const { schema } = inject<FormCreatorCtx>(injectionKey)!
</script>
