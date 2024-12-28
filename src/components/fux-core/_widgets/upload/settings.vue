<template>
  <AFormItem label="自定义上传地址" name="action" extra="留空将使用默认地址，通常无需设置">
    <AInput v-model:value="model.action" />
  </AFormItem>
  <AFormItem label="文件类型限制" name="accept">
    <InputTag v-model:value="model.accept" />
  </AFormItem>
  <AFormItem label="文件大小限制" name="sizeLimit">
    <AInputNumber v-model:value="model.sizeLimit" allow-clear addon-after="KB" class="w-full" />
  </AFormItem>
  <AFormItem label="文件数量限制" name="limit">
    <AInputNumber v-model:value="model.limit" allow-clear class="w-full" />
  </AFormItem>
  <AFormItem label="列表类型" name="type">
    <ASelect v-model:value="model.type" :options="listTypeOpts" />
  </AFormItem>
  <AFormItem label="允许多选" name="multiple" class="boolean-field">
    <ASwitch v-model:checked="model.multiple" />
  </AFormItem>
  <AFormItem label="禁用组件" name="disabled" class="boolean-field">
    <ASwitch v-model:checked="model.disabled" />
  </AFormItem>
  <AFormItem label="隐藏字段" name="hide" class="boolean-field">
    <ASwitch v-model:checked="model.hide" />
  </AFormItem>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import InputTag from '@/components/tag-input/index.vue'
import type { WPropsUpload } from '@/types/fux-core/form'

const listTypeOpts = [
  { label: '普通列表', value: 'text' },
  { label: '图片列表', value: 'picture' },
  { label: '图片宫格', value: 'picture-card' },
]

const { attrs } = defineProps<{
  attrs: WPropsUpload
}>()

const emit = defineEmits(['update:attrs'])

const model = computed({
  get: () => attrs,
  set: (val) => {
    emit('update:attrs', val)
  },
})
</script>
