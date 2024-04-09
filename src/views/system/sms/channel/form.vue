<template>
  <AModal
    v-model:open="open"
    :title="id === undefined ? '新增短信渠道' : '编辑短信渠道'"
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
        <AFormItem label="短信签名" name="signature">
          <AInput v-model:value="formData.signature" placeholder="请输入菜单名称" />
        </AFormItem>
        <AFormItem label="渠道编码" name="code">
          <ASelect
            v-model:value="formData.code"
            :options="systemSmsChannelCode"
            placeholder="渠道编码"
          />
        </AFormItem>
        <AFormItem label="启用状态" name="status">
          <ARadioGroup v-model:value="formData.status" :options="commonStatus" />
        </AFormItem>
        <AFormItem label="备注" name="email">
          <ATextarea v-model:value="formData.remark" placeholder="请输入备注信息" />
        </AFormItem>
        <AFormItem label="API Key" name="apiKey">
          <AInput v-model:value="formData.apiKey" placeholder="请输入短信渠道的 API 账号" />
        </AFormItem>
        <AFormItem label="密钥" name="apiSecret">
          <AInput v-model:value="formData.apiSecret" placeholder="请输入短信渠道的 API 密钥" />
        </AFormItem>
        <AFormItem label="发送回调URL" name="callbackUrl">
          <AInput
            v-model:value="formData.callbackUrl"
            placeholder="请输入短信发送后的回调请求地址"
          />
        </AFormItem>
      </ASpin>
    </AForm>
  </AModal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { message, type FormInstance, type FormProps } from 'ant-design-vue'
import {
  getChannelDetail,
  addChannel,
  updateChannel,
  type ChannelVO
} from '@/api/system/sms/channel'
import useDict from '@/hooks/use-dict'

const loading = ref(false)

const { commonStatus, systemSmsChannelCode } = useDict('common_status', 'system_sms_channel_code')

const rules = ref<FormProps['rules']>({
  signature: [{ required: true, message: '请输入短信签名' }],
  code: [{ required: true, message: '请选择渠道编码' }],
  apiKey: [{ required: true, message: '请输入短信渠道的 API Key' }]
})

const props = defineProps({
  id: {
    type: Number,
    default: undefined
  }
})

const emit = defineEmits(['success', 'close'])

const formData = ref<ChannelVO>({
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
    if (props.id !== undefined) {
      // edit
      await updateChannel(formData.value)
      message.success('保存成功')
    } else {
      // add
      await addChannel(formData.value)
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
if (props.id) {
  loading.value = true
  getChannelDetail(props.id).then((data) => {
    formData.value = data
    loading.value = false
  })
}
</script>
