<template>
  <AFormItem label="接受类型" name="accept">
    <AInput v-model:value="computedProps.accept" />
  </AFormItem>
  <AFormItem label="上传接口地址" name="action">
    <AInput v-model:value="computedProps.action" />
  </AFormItem>
  <AFormItem label="文件参数名" name="name">
    <AInput v-model:value="computedProps.name" default-value="file" />
  </AFormItem>
  <AFormItem label="文件大小限制" name="maxSize">
    <AInputNumber v-model:value="computedProps.maxSize" addon-after="KB" class="w-full" />
  </AFormItem>
  <AFormItem label="允许多选" name="multiple" class="setter-boolean-field">
    <ASwitch v-model:checked="computedProps.multiple" />
  </AFormItem>
  <AFormItem v-if="computedProps.multiple" label="文件数量限制" name="maxCount">
    <AInputNumber v-model:value="computedProps.maxCount" class="w-full" />
  </AFormItem>
  <AFormItem label="允许文件夹上传" name="folder" class="setter-boolean-field">
    <ASwitch v-model:checked="computedProps.folder" />
  </AFormItem>
  <AFormItem label="禁用组件" name="disabled" class="setter-boolean-field">
    <ASwitch v-model:checked="computedProps.disabled" />
  </AFormItem>
  <AFormItem label="请求头" name="headers">
    <Codemirror
      v-model="computedProps.headers"
      :tab-size="2"
      :extensions="extensions"
      :style="{ height: '180px', width: '100%' }"
    />
  </AFormItem>
  <AFormItem label="额外数据" name="data">
    <Codemirror
      v-model="computedProps.data"
      :tab-size="2"
      :extensions="extensions"
      :style="{ height: '180px', width: '100%' }"
    />
  </AFormItem>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import { Codemirror } from 'vue-codemirror'
import extensions from '../../codemirror'
import type { WPropsUpload } from '@/types/workflow'

const props = defineProps({
  opts: {
    type: Object as PropType<WPropsUpload>,
    required: true
  }
})

const emit = defineEmits(['update:opts'])

const computedProps = computed({
  get: () => props.opts,
  set: (val) => {
    emit('update:opts', val)
  }
})
</script>
