<template>
  <ASelect
    v-model:value="model"
    :default-value="config.props.defaultValue"
    :allow-clear="config.props.allowClear"
    :disabled="config.props.disabled"
    :field-names="fieldNames"
    :filter-option="filterFn"
    :list-height="config.props.listHeight"
    :max-tag-count="config.props.maxTagCount"
    :max-tag-text-length="config.props.maxTagTextLength"
    :mode="config.props.mode"
    :options="options"
    :placeholder="config.props.placeholder"
    :placement="config.props.placement"
    show-arrow
    :show-search="config.props.showSearch"
  />
</template>

<script lang="ts" setup>
import { ref, computed, watch, inject, type PropType } from 'vue'
import { type SelectProps } from 'ant-design-vue'
import { tryParse, filterOption } from '@/utils/fusion'
import {
  parentFieldKey,
  type WidgetConfigMap,
  type ParentFormPropType
} from '@/types/workflow/form'
import useDict from '@/hooks/use-dict'
import useModel from '../use-model'

const parentFormConfig = inject<ParentFormPropType | undefined>(parentFieldKey, undefined)

const props = defineProps({
  config: {
    type: Object as PropType<WidgetConfigMap['select']>,
    required: true
  }
})

const { model } = useModel(props.config.props.field.name || props.config.uid, parentFormConfig)
const options = ref<SelectProps['options']>([])

const fieldNames = computed<SelectProps['fieldNames']>(() =>
  tryParse(props.config.props.fieldNames)
)

const settings = props.config.props.options
const [dictData] = useDict(settings.dictType || '')

if (settings?.type === 'static') {
  options.value = settings.staticData || []
} else if (settings?.type === 'dict') {
  if (!settings.dictType) {
    options.value = []
  }
} else {
  // todo: options via API
  options.value = []
}

watch(
  () => dictData?.value,
  (val) => {
    if (settings.type === 'dict' && settings.dictType) {
      options.value = val
    }
  }
)

const filterFn = (input: string, option: any) => {
  const label = fieldNames.value?.label
  return filterOption(input, option, label || 'label')
}
</script>
