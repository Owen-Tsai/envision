<template>
  <AUpload
    :file-list="model"
    :multiple="config.props.multiple"
    :max-count="config.props.maxCount"
    :accept="config.props.accept"
    :disabled="config.props.disabled"
    :headers="headers"
    :data="data"
    :name="config.props.name"
    :before-upload="beforeUpload"
  >
    <AButton>选择文件</AButton>
  </AUpload>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import useModel from '../use-model'
import { tryParse } from '@/utils/envision'
import request from '@/utils/request'
import type { WidgetConfigMap } from '@/types/workflow'
import type { UploadProps } from 'ant-design-vue'

const props = defineProps({
  config: {
    type: Object as PropType<WidgetConfigMap['upload']>,
    required: true
  }
})

const { model } = useModel(props.config.props.field.name || props.config.uid)

const headers = computed(() => tryParse(props.config.props.headers) || undefined)
const data = computed(() => tryParse(props.config.props.data) || undefined)

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  model.value = [...(model.value || []), file]
  return false
}

const upload = () => {
  const formData = new FormData()
  ;((model.value as UploadProps['fileList']) || []).forEach((file) => {
    formData.append('files[]', file as any)
  })
  if (data.value) {
    Object.keys(data.value || {}).forEach((key) => {
      formData.append(key, data.value![key])
    })
  }

  request
    .post({
      url: props.config.props.action,
      data: formData
    })
    .catch((e) => {
      console.error(e)
    })
}

defineExpose({
  upload
})
</script>
