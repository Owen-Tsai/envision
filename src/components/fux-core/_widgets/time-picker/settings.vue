<template>
  <AFormItem label="默认值" name="defaultValue">
    <AInput v-model:value="model.defaultValue" />
  </AFormItem>
  <AFormItem label="占位文字" name="placeholder">
    <AInput v-model:value="model.placeholder" />
  </AFormItem>
  <AFormItem label="弹出框位置" name="placement">
    <ASelect
      v-model:value="model.placement"
      :options="popoverPlacementOpts"
      default-value="bottomLeft"
    />
  </AFormItem>
  <AFormItem label="显示格式" name="format">
    <AInput v-model:value="model.format" />
  </AFormItem>
  <AFormItem label="值格式" name="valueFormat">
    <AInput v-model:value="model.valueFormat" />
  </AFormItem>
  <AFormItem label="小时步长" name="hourStep">
    <AInputNumber v-model:value="model.hourStep" class="w-full" />
  </AFormItem>
  <AFormItem label="分钟步长" name="minuteStep">
    <AInputNumber v-model:value="model.minuteStep" class="w-full" />
  </AFormItem>
  <AFormItem label="秒步长" name="secondStep">
    <AInputNumber v-model:value="model.secondStep" class="w-full" />
  </AFormItem>
  <AFormItem label="使用12小时制" name="use12Hours" class="boolean-field">
    <ASwitch v-model:checked="model.use12Hours" />
  </AFormItem>
  <AFormItem label="允许清空" name="allowClear" class="boolean-field">
    <ASwitch v-model:checked="model.allowClear" />
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
import { popoverPlacementOpts } from '../../_utils/const'
import type { WPropsTimePicker } from '@/types/fux-core/form'

const { attrs } = defineProps<{
  attrs: WPropsTimePicker
}>()

const emit = defineEmits(['update:attrs'])

const model = computed({
  get: () => attrs,
  set: (val) => {
    emit('update:attrs', val)
  }
})
</script>
