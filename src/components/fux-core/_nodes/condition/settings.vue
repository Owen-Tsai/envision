<template>
  <AForm :model="model" :label-col="{ style: { width: '80px' } }">
    <AFormItem
      label="条件表达式"
      name="condition"
      :rules="[{ required: true, message: '请填写条件' }]"
      extra="输入符合 UEL 统一表达式语言的条件表达式"
    >
      <AInput v-model:value="model.condition" />
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
