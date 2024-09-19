<template>
  <AFormItem label="默认值" name="defaultValue">
    <AFormItemRest>
      <div class="flex items-center gap-1">
        <AInput v-model:value="computedProps.defaultValue[0]" />
        <span>~</span>
        <AInput v-model:value="computedProps.defaultValue[1]" />
      </div>
    </AFormItemRest>
  </AFormItem>
  <AFormItem label="占位文字" name="placeholder">
    <AFormItemRest>
      <div class="flex items-center gap-1">
        <AInput v-model:value="computedProps.placeholder[0]" />
        <span>~</span>
        <AInput v-model:value="computedProps.placeholder[1]" />
      </div>
    </AFormItemRest>
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
  <AFormItem label="小时步长" name="hourStep">
    <AInputNumber v-model:value="computedProps.hourStep" class="w-full" />
  </AFormItem>
  <AFormItem label="分钟步长" name="minuteStep">
    <AInputNumber v-model:value="computedProps.minuteStep" class="w-full" />
  </AFormItem>
  <AFormItem label="秒步长" name="secondStep">
    <AInputNumber v-model:value="computedProps.secondStep" class="w-full" />
  </AFormItem>
  <AFormItem label="使用12小时制" name="use12Hours" class="setter-boolean-field">
    <ASwitch v-model:checked="computedProps.use12Hours" />
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
import { popoverPlacementOpts } from '../use-settings-data'
import type { WPropsTimeRangePicker } from '@/types/workflow/form'

const props = defineProps({
  opts: {
    type: Object as PropType<WPropsTimeRangePicker>,
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
