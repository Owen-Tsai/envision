<template>
  <ACard title="审核结论">
    <AForm
      ref="auditForm"
      :label-col="{ style: 'width: 100px' }"
      :model="auditFormData"
      :rules="rules"
    >
      <ARow>
        <ACol :span="12">
          <AFormItem label="审核结论" name="result">
            <ARadioGroup v-model:value="auditFormData.result" :options="auditOptions" />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem v-if="auditFormData.result === '3'" label="退回到" name="rtnToTaskKey">
            <ASelect
              v-model:value="auditFormData.rtnToTaskKey"
              :options="taskRtnOpts"
              :field-names="{ label: 'name', value: 'taskDefinitionKey' }"
            />
          </AFormItem>
        </ACol>
      </ARow>
      <AFormItem label="审核意见" name="reason">
        <ATextarea v-model:value="auditFormData.reason" placeholder="请输入审核意见" :rows="4" />
      </AFormItem>
      <AFormItem class="text-right">
        <AButton type="primary" html-type="submit" @click="auditOperation">提交</AButton>
      </AFormItem>
    </AForm>
  </ACard>
</template>

<script setup lang="ts">
import useDict from '@/hooks/use-dict'
import { getTaskReturnOptions } from '@/api/business/audit'
import useActions, { KEY_RETURN_TO_STARTER } from './use-actions'
import type { FormInstance, SelectProps, FormProps } from 'ant-design-vue'

const {
  createTime,
  starter,
  fields = {},
} = defineProps<{
  starter?: string
  createTime?: number
  fields?: Record<string, any>
}>()

const rules: FormProps['rules'] = {
  result: [{ required: true, message: '请选择审核结论', trigger: 'change' }],
  reason: [{ required: true, message: '请输入审核意见', trigger: 'blur' }],
  rtnToTaskKey: [{ required: true, message: '请选择需要退回到的流程环节', trigger: 'change' }],
}

const { query } = useRoute()
const auditFormRef = useTemplateRef<FormInstance>('auditForm')
const { auditFormData, auditOperation } = useActions(auditFormRef, fields)

const taskDefKey = query.taskDefKey as string
const taskId = query.taskId as string

const taskRtnOpts = ref<SelectProps['options']>([])
const [auditOptions] = useDict('app_audit_options')

if (taskDefKey !== 'All') {
  getTaskReturnOptions(taskId).then((res) => {
    taskRtnOpts.value = [
      {
        name: '发起人',
        taskDefinitionKey: KEY_RETURN_TO_STARTER,
      },
      ...res,
    ]
  })
}
</script>
