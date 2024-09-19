<template>
  <AFormItem label="最大值" name="count">
    <AInputNumber v-model:value="computedProps.count" default-value="5" class="w-full" />
  </AFormItem>
  <AFormItem label="评分字符" name="prefix">
    <AInput v-if="computedProps.characterType === 'text'" v-model:value="computedProps.character">
      <template #addonBefore>
        <ASelect v-model:value="computedProps.characterType" :options="inputAddonOpts" />
      </template>
    </AInput>
    <IconSelect
      v-else
      v-model:value="computedProps.character"
      :show-preview="false"
      placement="left"
    >
      <template #addonBefore>
        <ASelect v-model:value="computedProps.characterType" :options="inputAddonOpts" />
      </template>
    </IconSelect>
  </AFormItem>
  <AFormItem label="提示信息" name="tooltips">
    <ATextarea v-model:value="computedProps.tooltips" />
  </AFormItem>

  <AFormItem label="允许半选" name="allowHalf" class="setter-boolean-field">
    <ASwitch v-model:checked="computedProps.allowHalf" />
  </AFormItem>
  <AFormItem label="允许清空" name="allowClear" class="setter-boolean-field">
    <ASwitch v-model:checked="computedProps.allowClear" />
  </AFormItem>
  <AFormItem label="只读字段" name="disabled" class="setter-boolean-field">
    <ASwitch v-model:checked="computedProps.disabled" />
  </AFormItem>
  <AFormItem label="隐藏字段" name="hide" class="setter-boolean-field">
    <ASwitch v-model:checked="computedProps.hide" />
  </AFormItem>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue'
import { inputAddonOpts } from '../use-settings-data'
import IconSelect from '@/components/icon-select/index.vue'
import type { WPropsRate } from '@/types/workflow/form'

const props = defineProps({
  opts: {
    type: Object as PropType<WPropsRate>,
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
