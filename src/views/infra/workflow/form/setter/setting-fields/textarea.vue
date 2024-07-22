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
  <AFormItem label="固定行数" name="rows">
    <AInputNumber v-model:value="computedProps.rows" class="w-full" />
  </AFormItem>
  <AFormItem label="自动调整行数" name="autoResize" class="setter-boolean-field">
    <ASwitch v-model:checked="computedProps.autoResize" />
  </AFormItem>
  <AFormItem label="最小行数" name="minRows">
    <AInputNumber
      v-model:value="computedProps.minRows"
      :disabled="computedProps.autoResize"
      class="w-full"
    />
  </AFormItem>
  <AFormItem label="最大行数" name="maxRows">
    <AInputNumber
      v-model:value="computedProps.maxRows"
      :disabled="computedProps.autoResize"
      class="w-full"
    />
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
import type { WPropsTextarea } from '@/types/workflow'

const props = defineProps({
  opts: {
    type: Object as PropType<WPropsTextarea>,
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
