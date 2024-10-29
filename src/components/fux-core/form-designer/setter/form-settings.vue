<template>
  <AForm :model="schema" layout="vertical">
    <AFormItem label="布局类型">
      <ASelect v-model:value="schema.form.layout" :options="labelLayoutOpts" />
    </AFormItem>
    <AFormItem v-if="schema.form.layout !== 'vertical'" label="标签对齐方式">
      <ASelect v-model:value="schema.form.labelAlign" :options="labelAlignOpts" />
    </AFormItem>
    <AFormItem label="标签列属性" extra="输入合法的 JSON">
      <AInput v-model:value="schema.form.labelCol" />
    </AFormItem>
    <AFormItem label="标签列宽度" extra="输入含单位的值(px/%)">
      <AInput v-model:value="schema.form.labelWidth" />
    </AFormItem>
    <AFormItem label="组件列属性" extra="输入合法的 JSON">
      <AInput v-model:value="schema.form.wrapperCol" />
    </AFormItem>
    <AFormItem
      v-if="schema.form.layout !== 'vertical'"
      label="显示标签后的冒号"
      class="boolean-field"
    >
      <ASwitch v-model:checked="schema.form.colon" />
    </AFormItem>
    <AFormItem label="禁用表单" class="boolean-field">
      <ASwitch v-model:checked="schema.form.disabled" />
    </AFormItem>
  </AForm>
</template>

<script lang="ts" setup>
import { useDesignerInjection } from '../../_hooks'
import { labelAlignOpts, labelLayoutOpts } from '../../_utils/const'

const { schema } = useDesignerInjection()
</script>
