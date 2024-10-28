<template>
  <AFormItem label="默认值" name="defaultValue">
    <AFormItemRest>
      <div class="flex items-center gap-1">
        <AInput v-model:value="model.defaultValue[0]" />
        <span>~</span>
        <AInput v-model:value="model.defaultValue[1]" />
      </div>
    </AFormItemRest>
  </AFormItem>
  <AFormItem label="选择器模式" name="picker">
    <ASelect v-model:value="model.picker" :options="datePickerModeOpts" default-value="date" />
  </AFormItem>
  <AFormItem label="占位文字" name="placeholder">
    <AFormItemRest>
      <div class="flex items-center gap-1">
        <AInput v-model:value="model.placeholder[0]" />
        <span>~</span>
        <AInput v-model:value="model.placeholder[1]" />
      </div>
    </AFormItemRest>
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
  <AFormItem label="提交格式" name="submitFormat" extra="提交时自动转换格式">
    <AInput v-model:value="model.submitFormat" />
  </AFormItem>
  <AFormItem
    v-if="model.picker === 'date'"
    label="显示时间选择"
    name="showTime"
    class="boolean-field"
  >
    <ASwitch v-model:checked="model.showTime" />
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

<script setup lang="ts">
import { computed } from 'vue'
import { popoverPlacementOpts, datePickerModeOpts } from '../../_utils/const'
import type { WPropsDateRangePicker } from '@/types/fux-core/form'

const { attrs } = defineProps<{
  attrs: WPropsDateRangePicker
}>()

const emit = defineEmits(['update:attrs'])

const model = computed({
  get: () => attrs,
  set: (val) => {
    emit('update:attrs', val)
  }
})
</script>
