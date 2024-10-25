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
  <AFormItem label="输入框后缀" name="suffix">
    <AInput v-if="model.suffix?.type === 'text'" v-model:value="model.suffix.value">
      <template #addonBefore>
        <ASelect v-model:value="model.suffix.type" :options="addonOpts" />
      </template>
    </AInput>
    <IconSelect
      v-if="model.suffix?.type === 'icon'"
      v-model:value="model.suffix.value"
      :show-preview="false"
      placement="left"
    >
      <template #addonBefore>
        <ASelect v-model:value="model.suffix.type" :options="addonOpts" />
      </template>
    </IconSelect>
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
import { computed } from 'vue'
import { addonOpts } from '../../_utils/const'
import IconSelect from '@/components/icon-select/index.vue'
import type { WPropsInput } from '@/types/fux-core'

const { attrs } = defineProps<{
  attrs: WPropsInput
}>()

const emit = defineEmits(['update:attrs'])

const model = computed({
  get: () => attrs,
  set: (val) => {
    emit('update:attrs', val)
  }
})
</script>
