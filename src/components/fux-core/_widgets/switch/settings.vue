<template>
  <AFormItem label="开启时的值" name="defaultValue">
    <AInput v-model:value="model.checkedValue" />
  </AFormItem>
  <AFormItem label="关闭时的值" name="defaultValue">
    <AInput v-model:value="model.unCheckedValue" />
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
import type { WPropsSwitch } from '@/types/fux-core/form'

const { attrs } = defineProps<{
  attrs: WPropsSwitch
}>()

const emit = defineEmits(['update:attrs'])

const model = computed({
  get: () => attrs,
  set: (val) => {
    emit('update:attrs', val)
  },
})
</script>
