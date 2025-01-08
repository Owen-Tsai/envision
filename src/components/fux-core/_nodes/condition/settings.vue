<template>
  <AAlert type="info" message="条件表达式" show-icon>
    <template #description>
      需要输入符合 UEL（Unified Expresstion
      Language，统一表达式语言）的表达式，且表达式需要具备布尔类型返回值。详情请查看<a
        href="https://cloud.iocoder.cn/bpm/expression/"
        target="_blank"
        >芋道文档</a
      >。
    </template>
  </AAlert>
  <AForm :model="model" :label-col="{ style: { width: '100px' } }" class="mt-4">
    <AFormItem
      label="条件表达式"
      name="condition"
      :rules="[{ required: true, message: '请填写条件' }]"
    >
      <AInput v-model:value="model.condition" placeholder="例如：${day > 3}" />
    </AFormItem>
  </AForm>
</template>

<script setup lang="ts">
import type { NPropsCondition } from '@/types/fux-core/flow'

const { attrs } = defineProps<{
  attrs: NPropsCondition
}>()

const emit = defineEmits(['update:attrs'])

const model = computed({
  get: () => attrs,
  set: (val) => {
    emit('update:attrs', val)
  },
})
</script>
