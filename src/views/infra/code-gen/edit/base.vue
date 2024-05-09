<template>
  <AForm ref="formRef" :model="formData" :rules="rules" :label-col="{ style: { width: '100px' } }">
    <ARow :gutter="24">
      <ACol :lg="12">
        <AFormItem label="表名称" name="tableName">
          <AInput v-model:value="formData.tableName" placeholder="请输入表名称" />
        </AFormItem>
      </ACol>
      <ACol :lg="12">
        <AFormItem label="表描述" name="tableComment">
          <AInput v-model:value="formData.tableComment" placeholder="请输入表描述" />
        </AFormItem>
      </ACol>
      <ACol :lg="12">
        <AFormItem label="实体类名称" name="className">
          <AInput v-model:value="formData.className" placeholder="请输入实体类名称" />
        </AFormItem>
      </ACol>
      <ACol :lg="12">
        <AFormItem label="作者" name="author">
          <AInput v-model:value="formData.author" placeholder="请输入作者名称" />
        </AFormItem>
      </ACol>
      <ACol :lg="24">
        <AFormItem label="备注" name="remark">
          <ATextarea v-model:value="formData.remark" />
        </AFormItem>
      </ACol>
    </ARow>
  </AForm>
</template>

<script lang="ts" setup>
import { ref, computed, type PropType } from 'vue'
import { type FormProps, type FormInstance } from 'ant-design-vue'
import type { ConfigDetailVO } from '@/api/infra/code-gen'

const props = defineProps({
  model: {
    type: Object as PropType<ConfigDetailVO['table']>
  }
})

const emit = defineEmits(['update:model'])

const formRef = ref<FormInstance>()

const formData = computed({
  get: () => props.model || {},
  set: (val) => {
    emit('update:model', val)
  }
})

const rules: FormProps['rules'] = {
  tableName: [{ required: true, message: '请输入表名称' }],
  tableComment: [{ required: true, message: '请输入表描述' }],
  className: [{ required: true, message: '请输入实体类名称' }],
  author: [{ required: true, message: '请输入作者名称' }]
}

defineExpose({
  formRef
})
</script>
