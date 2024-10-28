<template>
  <AFormItem label="最大值" name="count">
    <AInputNumber v-model:value="model.count" default-value="5" class="w-full" />
  </AFormItem>
  <AFormItem label="评分字符" name="prefix">
    <AInput v-if="model.symbol?.type === 'text'" v-model:value="model.symbol.value">
      <template #addonBefore>
        <ASelect v-model:value="model.symbol.type" :options="addonOpts" />
      </template>
    </AInput>
    <IconSelect
      v-if="model.symbol?.type === 'icon'"
      v-model:value="model.symbol.value"
      :show-preview="false"
      placement="left"
    >
      <template #addonBefore>
        <ASelect v-model:value="model.symbol.type" :options="addonOpts" />
      </template>
    </IconSelect>
  </AFormItem>
  <AFormItem label="提示信息" name="tooltips">
    <ATextarea v-model:value="model.tooltips" />
  </AFormItem>

  <AFormItem label="允许半选" name="allowHalf" class="boolean-field">
    <ASwitch v-model:checked="model.allowHalf" />
  </AFormItem>
  <AFormItem label="允许清空" name="allowClear" class="boolean-field">
    <ASwitch v-model:checked="model.allowClear" />
  </AFormItem>
  <AFormItem label="只读字段" name="disabled" class="boolean-field">
    <ASwitch v-model:checked="model.disabled" />
  </AFormItem>
  <AFormItem label="隐藏字段" name="hide" class="boolean-field">
    <ASwitch v-model:checked="model.hide" />
  </AFormItem>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { addonOpts } from '../../_utils/const'
import type { WPropsRate } from '@/types/fux-core/form'

const { attrs } = defineProps<{
  attrs: WPropsRate
}>()

const emit = defineEmits(['update:attrs'])

const model = computed({
  get: () => attrs,
  set: (val) => {
    emit('update:attrs', val)
  }
})
</script>
