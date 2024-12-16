<template>
  <AFormItem label="子表单最小数量" name="min">
    <AInputNumber
      v-model:value="model.min"
      :min="0"
      :max="model.max || undefined"
      :step="1"
      :precision="0"
      class="w-full"
    />
  </AFormItem>
  <AFormItem label="子表单最大数量" name="max">
    <AInputNumber
      v-model:value="model.max"
      :min="model.min || undefined"
      :step="1"
      :precision="0"
      class="w-full"
    />
  </AFormItem>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { WPropsSubForm } from '@/types/fux-core/form'

const { attrs } = defineProps<{
  attrs: WPropsSubForm
}>()

const emit = defineEmits<{
  (e: 'update:attrs', val: WPropsSubForm): void
}>()

const model = computed({
  get: () => attrs,
  set: (val) => {
    emit('update:attrs', val)
  },
})
</script>
