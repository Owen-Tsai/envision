<template>
  <AFormItem label="默认值" name="defaultValue">
    <AInput v-model:value="model.defaultValue" />
  </AFormItem>
  <AFormItem label="占位文字" name="placeholder">
    <AInput v-model:value="model.placeholder" />
  </AFormItem>
  <AFormItem label="最大长度" name="maxlength">
    <AInputNumber v-model:value="model.maxlength" class="w-full" />
  </AFormItem>
  <AFormItem label="固定行数" name="rows">
    <AInputNumber v-model:value="model.rows" class="w-full" />
  </AFormItem>
  <AFormItem label="自动调整行数" name="autoResize" class="boolean-field">
    <ASwitch v-model:checked="model.autoResize" />
  </AFormItem>
  <AFormItem label="最小行数" name="minRows">
    <AInputNumber v-model:value="model.minRows" :disabled="model.autoResize" class="w-full" />
  </AFormItem>
  <AFormItem label="最大行数" name="maxRows">
    <AInputNumber v-model:value="model.maxRows" :disabled="model.autoResize" class="w-full" />
  </AFormItem>
  <AFormItem label="允许清空" name="allowClear" class="boolean-field">
    <ASwitch v-model:checked="model.allowClear" />
  </AFormItem>
  <AFormItem label="显示字数" name="showCount" class="boolean-field">
    <ASwitch v-model:checked="model.showCount" />
  </AFormItem>
  <AFormItem label="禁用组件" name="disabled" class="boolean-field">
    <ASwitch v-model:checked="model.disabled" />
  </AFormItem>
  <AFormItem label="只读字段" name="readonly" class="boolean-field">
    <ASwitch v-model:checked="model.readonly" />
  </AFormItem>
  <AFormItem label="隐藏字段" name="hide" class="boolean-field">
    <ASwitch v-model:checked="model.hide" />
  </AFormItem>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue'
import type { WPropsTextarea } from '@/types/fux-core/form'

const { attrs } = defineProps<{
  attrs: WPropsTextarea
}>()

const emit = defineEmits(['update:attrs'])

const model = computed({
  get: () => attrs,
  set: (val) => {
    emit('update:attrs', val)
  },
})
</script>
