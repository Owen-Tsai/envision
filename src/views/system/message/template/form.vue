<template>
  <AModal
    v-model:open="open"
    :title="record === undefined ? '新增站内信模板' : '编辑站内信模板'"
    :after-close="onClose"
    destroy-on-close
    @ok="submit"
  >
    <AForm
      ref="formRef"
      :model="formData"
      :label-col="{ style: { width: '90px' } }"
      :rules="rules"
      class="mt-4"
    >
      <ASpin :spinning="loading">
        <AFormItem label="站内信类型" name="type">
          <ASelect
            v-model:value="formData.type"
            :options="systemNotifyTemplateType"
            placeholder="请选择站内信类型"
          />
        </AFormItem>
        <AFormItem label="模板名称" name="name">
          <AInput v-model:value="formData.name" placeholder="请输入模板名称" />
        </AFormItem>
        <AFormItem label="模板编码" name="code">
          <AInput v-model:value="formData.code" placeholder="请输入模板编码" />
        </AFormItem>
        <AFormItem label="发送方名称" name="nickname">
          <AInput v-model:value="formData.nickname" placeholder="请输入发送方名称，如“系统”" />
        </AFormItem>
        <AFormItem label="模板内容" name="content">
          <ATextarea v-model:value="formData.content" placeholder="请输入模板内容信息" />
        </AFormItem>
        <AFormItem label="启用状态" name="status">
          <ARadioGroup v-model:value="formData.status" :options="commonStatus" />
        </AFormItem>
        <AFormItem label="备注" name="remark">
          <ATextarea v-model:value="formData.remark" placeholder="请输入备注信息" />
        </AFormItem>
      </ASpin>
    </AForm>
  </AModal>
</template>

<script lang="ts" setup>
import { ref, type PropType } from 'vue'
import { message, type FormInstance, type FormProps } from 'ant-design-vue'
import {
  getTemplateDetail,
  addTemplate,
  updateTemplate,
  type TemplateVO
} from '@/api/system/message/template'
import useDict from '@/hooks/use-dict'

const loading = ref(false)

const { commonStatus, systemNotifyTemplateType } = useDict(
  'common_status',
  'system_notify_template_type'
)

const rules = ref<FormProps['rules']>({
  type: [{ required: true, message: '请选择站内信类型' }],
  name: [{ required: true, message: '请输入模板名称' }],
  code: [{ required: true, message: '请选择模板编码' }],
  nickname: [{ required: true, message: '请输入发送方名称' }],
  content: [{ required: true, message: '请输入模板内容' }]
})

const props = defineProps({
  record: {
    type: Object as PropType<TemplateVO>
  }
})

const emit = defineEmits(['success', 'close'])

const formData = ref<TemplateVO>({
  status: 0
})
const formRef = ref<FormInstance>()

const open = ref(true)

const onClose = () => {
  formRef.value?.resetFields()
  emit('close')
}

const submit = async () => {
  try {
    loading.value = true
    await formRef.value?.validate()
    if (props.record !== undefined) {
      // edit
      await updateTemplate(formData.value)
      message.success('保存成功')
    } else {
      // add
      await addTemplate(formData.value)
      message.success('创建成功')
    }

    open.value = false
    emit('success')
  } catch (e) {
    // do nothing at the moment
    // until we have a unified error handling precedure
  } finally {
    loading.value = false
  }
}

// load detail
if (props.record?.id) {
  loading.value = true
  getTemplateDetail(props.record.id).then((data) => {
    formData.value = data
    loading.value = false
  })
}
</script>
