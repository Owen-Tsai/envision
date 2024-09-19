<template>
  <AFormItem label="默认值" name="defaultValue">
    <AInput v-model:value="computedProps.defaultValue" />
  </AFormItem>
  <AFormItem label="选择器模式" name="picker">
    <ASelect
      v-model:value="computedProps.picker"
      :options="datePickerModeOpts"
      default-value="date"
    />
  </AFormItem>
  <AFormItem label="占位文字" name="placeholder">
    <AInput v-model:value="computedProps.placeholder" />
  </AFormItem>
  <AFormItem label="弹出框位置" name="placement">
    <ASelect
      v-model:value="computedProps.placement"
      :options="popoverPlacementOpts"
      default-value="bottomLeft"
    />
  </AFormItem>
  <AFormItem label="显示格式" name="format">
    <AInput v-model:value="computedProps.format" />
  </AFormItem>
  <AFormItem label="值格式" name="valueFormat">
    <AInput v-model:value="computedProps.valueFormat" />
  </AFormItem>
  <AFormItem
    v-if="computedProps.picker === 'date'"
    label="显示时间选择"
    name="showTime"
    class="setter-boolean-field"
  >
    <ASwitch v-model:checked="computedProps.showTime" />
  </AFormItem>
  <AFormItem label="允许清空" name="allowClear" class="setter-boolean-field">
    <ASwitch v-model:checked="computedProps.allowClear" />
  </AFormItem>
  <AFormItem label="禁用组件" name="disabled" class="setter-boolean-field">
    <ASwitch v-model:checked="computedProps.disabled" />
  </AFormItem>
  <AFormItem label="隐藏字段" name="hide" class="setter-boolean-field">
    <ASwitch v-model:checked="computedProps.hide" />
  </AFormItem>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue'
import { popoverPlacementOpts, datePickerModeOpts } from '../use-settings-data'
import type { WPropsDatePicker } from '@/types/workflow/form'

const props = defineProps({
  opts: {
    type: Object as PropType<WPropsDatePicker>,
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
