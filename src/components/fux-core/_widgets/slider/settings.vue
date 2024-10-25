<template>
  <AFormItem label="默认值" name="defaultValue">
    <AInputNumber v-if="!model.range" v-model:value="model.defaultValue as number" class="w-full" />
    <div v-else class="flex items-center gap-1">
      <AFormItemRest>
        <AInputNumber v-model:value="(model.defaultValue as [number, number])[0]" />
        <span>~</span>
        <AInputNumber v-model:value="(model.defaultValue as [number, number])[1]" />
      </AFormItemRest>
    </div>
  </AFormItem>
  <AFormItem label="最小值" name="min">
    <AInputNumber v-model:value="model.min" default-value="0" class="w-full" />
  </AFormItem>
  <AFormItem label="最大值" name="max">
    <AInputNumber v-model:value="model.max" default-value="100" class="w-full" />
  </AFormItem>
  <AFormItem label="步长" name="step">
    <AInputNumber v-model:value="model.step" default-value="1" class="w-full" />
  </AFormItem>
  <AFormItem label="刻度" name="marks">
    <AInput v-model:value="model.marks" />
  </AFormItem>

  <AFormItem label="仅允许拖动至刻度" name="disableStep" class="boolean-field">
    <ASwitch v-model:checked="model.disableStep" />
  </AFormItem>
  <AFormItem label="显示步长刻度" name="dots" class="boolean-field">
    <ASwitch v-model:checked="model.dots" />
  </AFormItem>
  <AFormItem label="反向坐标轴" name="reverse" class="boolean-field">
    <ASwitch v-model:checked="model.reverse" />
  </AFormItem>
  <AFormItem label="允许范围选择" name="range" class="boolean-field">
    <ASwitch v-model:checked="model.range" @change="onRangeModeChange" />
  </AFormItem>
  <AFormItem label="隐藏 Tooltip" name="hideTooltip" class="boolean-field">
    <ASwitch v-model:checked="model.hideTooltip" />
  </AFormItem>
  <AFormItem label="禁用组件" name="disabled" class="boolean-field">
    <ASwitch v-model:checked="model.disabled" />
  </AFormItem>
  <AFormItem label="隐藏字段" name="hide" class="boolean-field">
    <ASwitch v-model:checked="model.hide" />
  </AFormItem>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue'
import type { WPropsSlider } from '@/types/fux-core'

const { attrs } = defineProps<{
  attrs: WPropsSlider
}>()

const emit = defineEmits(['update:attrs'])

const model = computed({
  get: () => attrs,
  set: (val) => {
    emit('update:attrs', val)
  }
})

const onRangeModeChange = () => {
  model.value.defaultValue = undefined
}
</script>
