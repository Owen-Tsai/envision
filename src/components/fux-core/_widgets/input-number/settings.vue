<template>
  <AFormItem label="默认值" name="defaultValue">
    <AInputNumber v-model:value="model.defaultValue" />
  </AFormItem>
  <AFormItem label="占位文字" name="placeholder">
    <AInput v-model:value="model.placeholder" />
  </AFormItem>
  <AFormItem label="数字上限" name="max">
    <AInputNumber v-model:value="model.max" class="w-full" />
  </AFormItem>
  <AFormItem label="数字下限" name="min">
    <AInputNumber v-model:value="model.min" class="w-full" />
  </AFormItem>
  <AFormItem label="数值精度" name="precision" extra="保留的小数位数">
    <AInputNumber
      v-model:value="model.precision"
      class="w-full"
      :min="0"
      :step="1"
      :precision="0"
    />
  </AFormItem>
  <AFormItem label="步进值" name="step">
    <AInputNumber v-model:value="model.step" class="w-full" />
  </AFormItem>
  <AFormItem label="输入框前缀" name="prefix">
    <AInput v-if="model.prefix?.type === 'text'" v-model:value="model.prefix.value">
      <template #addonBefore>
        <ASelect v-model:value="model.prefix.type" :options="addonOpts" />
      </template>
    </AInput>
    <IconSelect
      v-if="model.prefix?.type === 'icon'"
      v-model:value="model.prefix.value"
      :show-preview="false"
      placement="left"
    >
      <template #addonBefore>
        <ASelect v-model:value="model.prefix.type" :options="addonOpts" />
      </template>
    </IconSelect>
  </AFormItem>

  <AFormItem label="允许清空" name="allowClear" class="boolean-field">
    <ASwitch v-model:checked="model.allowClear" />
  </AFormItem>
  <AFormItem label="显示操作按钮" name="controls" class="boolean-field">
    <ASwitch v-model:checked="model.controls" />
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
import { computed } from 'vue'
import { addonOpts } from '../../_utils/const'
import IconSelect from '@/components/icon-select/index.vue'
import type { WPropsInputNumber } from '@/types/fux-core'

const { attrs } = defineProps<{
  attrs: WPropsInputNumber
}>()

const emit = defineEmits(['update:attrs'])

const model = computed({
  get: () => attrs,
  set: (val) => {
    emit('update:attrs', val)
  }
})
</script>
