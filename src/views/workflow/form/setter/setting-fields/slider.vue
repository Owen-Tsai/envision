<template>
  <AFormItem label="默认值" name="defaultValue">
    <AInputNumber
      v-if="!computedProps.range"
      v-model:value="computedProps.defaultValue as number"
      class="w-full"
    />
    <div v-else class="flex items-center gap-1">
      <AFormItemRest>
        <AInputNumber v-model:value="(computedProps.defaultValue as [number, number])[0]" />
        <span>~</span>
        <AInputNumber v-model:value="(computedProps.defaultValue as [number, number])[1]" />
      </AFormItemRest>
    </div>
  </AFormItem>
  <AFormItem label="最小值" name="min">
    <AInputNumber v-model:value="computedProps.min" default-value="0" class="w-full" />
  </AFormItem>
  <AFormItem label="最大值" name="max">
    <AInputNumber v-model:value="computedProps.max" default-value="100" class="w-full" />
  </AFormItem>
  <AFormItem label="步长" name="step">
    <AInputNumber v-model:value="computedProps.step" default-value="1" class="w-full" />
  </AFormItem>
  <AFormItem label="刻度" name="marks">
    <AInput v-model:value="computedProps.marks" />
  </AFormItem>
  <AFormItem label="Tooltip 位置" name="tooltipPlacement">
    <ASelect
      v-model:value="computedProps.tooltipPlacement"
      :options="tooltipPlacementOpts"
      default-value="top"
    />
  </AFormItem>

  <AFormItem label="仅允许拖动至刻度" name="disableStep" class="setter-boolean-field">
    <ASwitch v-model:checked="computedProps.disableStep" />
  </AFormItem>
  <AFormItem label="显示步长刻度" name="dots" class="setter-boolean-field">
    <ASwitch v-model:checked="computedProps.dots" />
  </AFormItem>
  <AFormItem label="反向坐标轴" name="reverse" class="setter-boolean-field">
    <ASwitch v-model:checked="computedProps.reverse" />
  </AFormItem>
  <AFormItem label="允许范围选择" name="range" class="setter-boolean-field">
    <ASwitch
      v-model:checked="computedProps.range"
      @change="(v) => onRangeModeChange(v as boolean)"
    />
  </AFormItem>
  <AFormItem label="隐藏 Tooltip" name="hideTooltip" class="setter-boolean-field">
    <ASwitch v-model:checked="computedProps.hideTooltip" />
  </AFormItem>
  <AFormItem label="禁用组件" name="disabled" class="setter-boolean-field">
    <ASwitch v-model:checked="computedProps.disabled" />
  </AFormItem>
  <AFormItem label="隐藏字段" name="hide" class="setter-boolean-field">
    <ASwitch v-model:checked="computedProps.hide" />
  </AFormItem>
</template>

<script lang="ts" setup>
import { ref, computed, type PropType } from 'vue'
import { tooltipPlacementOpts } from '../use-settings-data'
import type { WPropsSlider } from '@/types/workflow/form'

const props = defineProps({
  opts: {
    type: Object as PropType<WPropsSlider>,
    required: true
  }
})

const emit = defineEmits(['update:opts'])

const rememberedValue = ref<number>()
const rememberedRange = ref<[number, number]>()

const computedProps = computed({
  get: () => props.opts,
  set: (val) => {
    emit('update:opts', val)
  }
})

const onRangeModeChange = (val: boolean) => {
  if (val) {
    rememberedValue.value = computedProps.value.defaultValue as number | undefined
    computedProps.value.defaultValue = rememberedRange.value || [1, 1]
  } else {
    rememberedRange.value = computedProps.value.defaultValue as [number, number] | undefined
    computedProps.value.defaultValue = rememberedValue.value || 1
  }
}
</script>
