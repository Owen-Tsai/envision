<template>
  <AFormItem label="开启时的值" name="defaultValue">
    <AInput v-model:value="computedProps.checkedValue" />
  </AFormItem>
  <AFormItem label="关闭时的值" name="defaultValue">
    <AInput v-model:value="computedProps.unCheckedValue" />
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
import type { WPropsSwitch } from '@/types/workflow/form'

const props = defineProps({
  opts: {
    type: Object as PropType<WPropsSwitch>,
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
