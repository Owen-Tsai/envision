<template>
  <AFormItem label="默认值" name="defaultValue">
    <AInput v-model:value="computedProps.defaultValue" />
  </AFormItem>
  <AFormItem label="占位文字" name="placeholder">
    <AInput v-model:value="computedProps.placeholder" />
  </AFormItem>
  <AFormItem label="最大长度" name="maxlength">
    <AInputNumber v-model:value="computedProps.maxlength" class="w-full" />
  </AFormItem>
  <AFormItem label="输入框前缀" name="prefix">
    <AInput v-if="computedProps.prefixType === 'text'" v-model:value="computedProps.prefix">
      <template #addonBefore>
        <ASelect v-model:value="computedProps.prefixType" :options="inputAddonOpts" />
      </template>
    </AInput>
    <IconSelect v-else v-model:value="computedProps.prefix" :show-preview="false" placement="left">
      <template #addonBefore>
        <ASelect v-model:value="computedProps.prefixType" :options="inputAddonOpts" />
      </template>
    </IconSelect>
  </AFormItem>
  <AFormItem label="输入框后缀" name="suffix">
    <AInput v-if="computedProps.suffixType === 'text'" v-model:value="computedProps.suffix">
      <template #addonBefore>
        <ASelect v-model:value="computedProps.suffixType" :options="inputAddonOpts" />
      </template>
    </AInput>
    <IconSelect v-else v-model:value="computedProps.suffix" :show-preview="false" placement="left">
      <template #addonBefore>
        <ASelect v-model:value="computedProps.suffixType" :options="inputAddonOpts" />
      </template>
    </IconSelect>
  </AFormItem>
  <AFormItem label="允许清空" name="allowClear" class="setter-boolean-field">
    <ASwitch v-model:checked="computedProps.allowClear" />
  </AFormItem>
  <AFormItem label="显示字数" name="showCount" class="setter-boolean-field">
    <ASwitch v-model:checked="computedProps.showCount" />
  </AFormItem>
  <AFormItem label="禁用组件" name="disabled" class="setter-boolean-field">
    <ASwitch v-model:checked="computedProps.disabled" />
  </AFormItem>
  <AFormItem label="只读字段" name="readonly" class="setter-boolean-field">
    <ASwitch v-model:checked="computedProps.readonly" />
  </AFormItem>
  <AFormItem label="隐藏字段" name="hide" class="setter-boolean-field">
    <ASwitch v-model:checked="computedProps.hide" />
  </AFormItem>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue'
import { inputAddonOpts } from '../use-settings-data'
import IconSelect from '@/components/icon-select/index.vue'
import type { WPropsInput } from '@/types/workflow/form'

const props = defineProps({
  opts: {
    type: Object as PropType<WPropsInput>,
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
