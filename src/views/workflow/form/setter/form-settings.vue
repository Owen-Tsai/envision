<template>
  <AForm :model="schema.form" layout="vertical">
    <AFormItem label="布局类型">
      <ASelect v-model:value="schema.layout" :options="layoutOpts" />
    </AFormItem>
    <AFormItem v-if="schema.layout !== 'vertical'" label="标签对齐方式">
      <ASelect v-model:value="schema.labelAlign" :options="labelAlignOpts" />
    </AFormItem>
    <AFormItem label="标签列属性">
      <AInput v-model:value="schema.labelCol" />
    </AFormItem>
    <AFormItem label="标签列宽度">
      <AInput v-model:value="schema.labelWidth" placeholder="输入含单位的值(px/%)" />
    </AFormItem>
    <AFormItem label="组件列属性">
      <AInput v-model:value="schema.wrapperCol" />
    </AFormItem>
    <AFormItem
      v-if="schema.layout !== 'vertical'"
      label="显示标签后的冒号"
      class="setter-boolean-field"
    >
      <ASwitch v-model:checked="schema.colon" />
    </AFormItem>
    <AFormItem label="禁用表单" class="setter-boolean-field">
      <ASwitch v-model:checked="schema.disabled" />
    </AFormItem>
  </AForm>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { labelAlignOpts, layoutOpts } from './use-settings-data'
import { injectionKey, type FormCreatorCtx } from '@/types/workflow/form'

const { schema } = inject<FormCreatorCtx>(injectionKey)!
</script>
