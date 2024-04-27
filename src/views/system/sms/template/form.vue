<template>
  <AModal
    v-model:open="open"
    :title="record === undefined ? '新增短信模板' : '编辑短信模板'"
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
        <AFormItem label="短信渠道" name="channelId">
          <ASelect
            v-model:value="formData.channelId"
            :options="channelData"
            :field-names="{ label: 'signature', value: 'id' }"
            placeholder="请选择短信渠道"
          />
        </AFormItem>
        <AFormItem label="短信类型" name="type">
          <ASelect
            v-model:value="formData.type"
            :options="systemSmsTemplateType"
            placeholder="请选择短信类型"
          />
        </AFormItem>
        <AFormItem label="模板名称" name="name">
          <AInput v-model:value="formData.name" placeholder="请输入模板名称" />
        </AFormItem>
        <AFormItem label="模板编码" name="code">
          <AInput v-model:value="formData.code" placeholder="请输入模板编码" />
        </AFormItem>
        <AFormItem label="模板内容" name="content">
          <ATextarea v-model:value="formData.content" placeholder="请输入模板内容信息" />
        </AFormItem>
        <AFormItem label="启用状态" name="status">
          <ARadioGroup v-model:value="formData.status" :options="commonStatus" />
        </AFormItem>
        <AFormItem label="API 编号" name="apiTemplateId">
          <AInput
            v-model:value="formData.apiTemplateId"
            placeholder="请输入接入的短信平台的 API 模板编号"
          />
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
} from '@/api/system/sms/template'
import useDict from '@/hooks/use-dict'
import type { ChannelListLiteVO } from '@/api/system/sms/channel'

const loading = ref(false)

const { commonStatus, systemSmsTemplateType } = useDict('common_status', 'system_sms_template_type')

const rules = ref<FormProps['rules']>({
  channelId: [{ required: true, message: '请选择短信渠道' }],
  name: [{ required: true, message: '请输入模板名称' }],
  code: [{ required: true, message: '请输入模板编码' }],
  content: [{ required: true, message: '请输入模板内容' }]
})

const props = defineProps({
  record: {
    type: Object as PropType<TemplateVO>
  },
  channelData: {
    type: Array as PropType<ChannelListLiteVO>,
    required: true
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
