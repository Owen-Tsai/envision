<template>
  <AFormItem label="接受类型" name="accept">
    <AInput v-model:value="computedProps.accept" />
  </AFormItem>
  <AFormItem label="上传接口地址" name="action">
    <AInput v-model:value="computedProps.action" />
  </AFormItem>
  <AFormItem label="展示样式" name="type">
    <ASelect v-model:value="computedProps.type" :options="typeOptions" />
  </AFormItem>
  <AFormItem label="图片参数名" name="name">
    <AInput v-model:value="computedProps.name" default-value="file" />
  </AFormItem>
  <AFormItem label="图片大小限制" name="maxSize">
    <AInputNumber v-model:value="computedProps.maxSize" addon-after="KB" class="w-full" />
  </AFormItem>
  <AFormItem label="图片数量限制" name="maxCount">
    <AInputNumber v-model:value="computedProps.maxCount" class="w-full" />
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
import type { WPropsImage } from '@/types/workflow'

const typeOptions = [
  { label: '图片墙', value: 'grid' },
  { label: '列表', value: 'list' },
  { label: '行内列表', value: 'inline' }
]

const props = defineProps({
  opts: {
    type: Object as PropType<WPropsImage>,
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
