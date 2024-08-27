<template>
  <AFormItem label="类型" name="type">
    <ASelect v-model:value="computedOpts.type" :options="typeOpts" default-value="default" />
  </AFormItem>
  <AFormItem label="文本" name="label">
    <AInput v-model:value="computedOpts.label" />
  </AFormItem>
  <AFormItem label="图标" name="icon">
    <IconSelect v-model:value="computedOpts.icon" placement="left" />
  </AFormItem>
  <AFormItem label="形状" name="shape">
    <ASelect v-model:value="computedOpts.shape" :options="shapeOpts" default-value="default" />
  </AFormItem>
  <AFormItem label="视为连接" class="setter-boolean-field">
    <ASwitch v-model:checked="isLink" />
  </AFormItem>
  <div v-show="isLink">
    <AFormItem label="跳转地址" name="href">
      <AInput v-model:value="computedOpts.href" />
    </AFormItem>
    <AFormItem label="_target" name="target">
      <AInput v-model:value="computedOpts.target" />
    </AFormItem>
  </div>
  <AFormItem label="块级按钮" class="setter-boolean-field">
    <ASwitch v-model:checked="computedOpts.block" />
  </AFormItem>
  <AFormItem label="危险样式" class="setter-boolean-field">
    <ASwitch v-model:checked="computedOpts.danger" />
  </AFormItem>
  <AFormItem label="加载中" class="setter-boolean-field">
    <ASwitch v-model:checked="computedOpts.loading" />
  </AFormItem>
  <AFormItem label="禁用组件" class="setter-boolean-field">
    <ASwitch v-model:checked="computedOpts.disabled" />
  </AFormItem>
</template>

<script setup lang="ts">
import { ref, computed, watch, type PropType } from 'vue'
import IconSelect from '@/components/icon-select/index.vue'
import type { WPropsButton } from '@/types/workflow'

const typeOpts = [
  { value: 'default' },
  { value: 'primary' },
  { value: 'dashed' },
  { value: 'text' },
  { value: 'link' }
]

const shapeOpts = [
  { value: 'default', label: '默认' },
  { value: 'circle', label: '圆形' },
  { value: 'round', label: '方形' }
]

const props = defineProps({
  opts: {
    type: Object as PropType<WPropsButton>,
    required: true
  }
})

const emit = defineEmits(['update:opts'])

const computedOpts = computed({
  get: () => props.opts,
  set: (val) => {
    emit('update:opts', val)
  }
})

const isLink = ref(false)

watch(
  () => isLink.value,
  (val) => {
    if (!val) {
      computedOpts.value.href = undefined
      computedOpts.value.target = undefined
    }
  }
)
</script>
