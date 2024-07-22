<template>
  <ASelect
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
import { ref, computed, type PropType } from 'vue'
import { type SelectProps } from 'ant-design-vue'
import { tryParse, filterOption } from '@/utils/envision'
import { type WidgetConfigMap } from '@/types/workflow'
import useDict from '@/hooks/use-dict'

const props = defineProps({
  config: {
    type: Object as PropType<WidgetConfigMap['select']>,
    required: true
  }
})

const options = ref<SelectProps['options']>([])

const fieldNames = computed<SelectProps['fieldNames']>(() =>
  tryParse(props.config.props.fieldNames)
)

const settings = props.config.props.options
if (settings?.type === 'static') {
  options.value = settings.staticData || []
} else if (settings?.type === 'dict') {
  if (!settings.dictType) options.value = []
  const [dictData] = useDict(settings.dictType!)
  options.value = dictData.value
} else {
  // todo: options via API
  options.value = []
}

const filterFn = (input: string, option: any) => {
  const label = fieldNames.value?.label
  return filterOption(input, option, label || 'label')
}
</script>
