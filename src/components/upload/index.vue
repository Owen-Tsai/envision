<template>
  <AUpload
    :action="action || uploadUrl"
    :accept="accept.join(',')"
    :max-count="limit"
    :list-type="listType"
    :multiple="multiple"
    v-model:file-list="fileList"
    :before-upload="beforeUpload"
    :disabled="disabled"
    :custom-request="httpRequest"
    @change="onStatusChange"
    @remove="onRemove"
  >
    <slot>
      <AButton
        v-if="listType === 'text' || listType === 'picture'"
        :icon="h(UploadOutlined)"
        :loading="loading"
      >
        选择文件
      </AButton>

      <template
        v-else-if="listType === 'picture-card' && limit && limit !== 0 && fileList.length < limit"
      >
        <div class="upload-trigger">
          <LoadingOutlined v-if="loading" />
          <PlusOutlined v-else />
          <div class="label mt-2">选择文件</div>
        </div>
      </template>
    </slot>
  </AUpload>
</template>

<script setup lang="ts">
import { h, ref, watch, type PropType } from 'vue'
import { generateID } from '@/utils/fusion'
import { UploadOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { Upload, message, type UploadProps, type UploadFile } from 'ant-design-vue'
import useUpload from '@/hooks/use-upload'

const { LIST_IGNORE } = Upload

const props = defineProps({
  action: String,
  accept: {
    type: Array as PropType<string[]>,
    default: () => ['pdf, png, svg, jpg, doc, docx']
  },
  value: {
    type: [String, Array] as PropType<string | string[]>
  },
  listType: {
    type: String as PropType<UploadProps['listType']>,
    default: 'text'
  },
  multiple: Boolean, // whether user can hold ctrl/shift to select multiple files at once
  sizeLimit: {
    type: Number,
    default: 5 * 1024 // in KB
  },
  autoUpload: Boolean,
  drag: Boolean,
  limit: Number,
  disabled: Boolean,
  loading: Boolean
})

const emit = defineEmits(['update:value', 'start', 'success', 'error', 'finished'])

const uploadedCount = ref<number>(0)
// display uploaded files
const fileList = ref<UploadFile[]>([])
const uploadList = ref<UploadFile[]>([])

const { httpRequest, uploadUrl } = useUpload()

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  // check for the count
  if (props.limit && fileList.value.length >= props.limit) {
    message.error(`上传文件数量不得超过${props.limit}个`)
    return LIST_IGNORE
  }
  // check for the type
  const extName = file.name.split('.').pop()
  if (extName && !props.accept.includes(extName)) {
    message.error(`上传文件格式不符合要求`)
    return LIST_IGNORE
  }
  // check for the size
  if (props.sizeLimit && file.size / 1024 > props.sizeLimit) {
    message.error(`上传文件大小不能超过${props.sizeLimit}KB`)
    return LIST_IGNORE
  }

  uploadedCount.value++
  emit('start')
  return true
}

const updateModel = () => {
  let result: string | string[] = fileList.value.map((file) => file.url!)
  if (props.limit === 1 || typeof props.value === 'string') {
    result = result.join(',')
  }

  emit('update:value', result)
}

const handleSuccess = (file: UploadFile) => {
  message.success('上传成功')
  emit('success')
  emit('finished')

  const idx = fileList.value.findIndex((f) => f.uid === file.uid)
  fileList.value.splice(idx, 1)
  uploadList.value.push({ name: file.name, uid: file.uid, url: file.response.data })

  if (uploadList.value.length === uploadedCount.value) {
    fileList.value.push(...uploadList.value)
    uploadList.value = []
    uploadedCount.value = 0
    updateModel()
  }
}

const handleError = () => {
  message.error('上传失败')
  emit('error')
  emit('finished')
}

const onRemove: UploadProps['onRemove'] = (file) => {
  const index = fileList.value.findIndex((f) => f.uid === file.uid)
  if (index !== -1) {
    fileList.value.splice(index, 1)
    updateModel()
  }
}

const onStatusChange: UploadProps['onChange'] = ({ file }) => {
  if (file.status === 'done') {
    handleSuccess(file)
  } else if (file.status === 'error') {
    handleError()
  }
}

watch(
  () => props.value,
  (val) => {
    fileList.value = []
    if (!val) {
      return
    }

    if (typeof val === 'string') {
      const items = val.split(',').map<UploadFile>((url) => ({
        name: url.split('/').pop() || '',
        uid: generateID(),
        url
      }))
      fileList.value.push(...items)
    } else {
      const items = val.map<UploadFile>((url) => ({
        name: url.split('/').pop() || '',
        uid: generateID(),
        url
      }))
      fileList.value.push(...items)
    }
  },
  { immediate: true, deep: true }
)
</script>
