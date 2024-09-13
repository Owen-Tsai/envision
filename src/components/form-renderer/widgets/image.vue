<template>
  <AUpload
    :file-list="model"
    :max-count="config.props.maxCount"
    accept="image/*"
    :disabled="config.props.disabled"
    :headers="headers"
    :data="data"
    :name="config.props.name"
    with-credentials
    :list-type="listType"
    :class="{ 'upload-list-inline': config.props.type === 'inline' }"
    :before-upload="beforeUpload"
  >
    <AButton>选择文件</AButton>
  </AUpload>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import { message, Upload, type UploadProps } from 'ant-design-vue'
import useModel from '../use-model'
import { tryParse } from '@/utils/fusion'
import request from '@/utils/request'
import type { WidgetConfigMap } from '@/types/workflow'

const props = defineProps({
  config: {
    type: Object as PropType<WidgetConfigMap['image']>,
    required: true
  }
})

const { model } = useModel(props.config.props.field.name || props.config.uid, parentFormConfig)

const headers = computed(() => tryParse(props.config.props.headers) || undefined)
const data = computed(() => tryParse(props.config.props.data) || undefined)

const listType = computed(() => {
  return props.config.props.type === 'grid' ? 'picture-card' : 'picture'
})

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const size = file.size / 1024
  if (props.config.props.maxSize && size > props.config.props.maxSize) {
    message.error('上传文件大小不能超过 ' + props.config.props.maxSize + 'KB')
    return Upload.LIST_IGNORE
  }
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

<style lang="scss" scoped>
.upload-list-inline {
  :deep(.ant-upload-list) {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
