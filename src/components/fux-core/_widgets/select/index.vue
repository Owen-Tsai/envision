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
    @blur="evt?.handler('blur')"
    @change="evt?.handler('change')"
    @focus="evt?.handler('focus')"
  />
</template>

<script lang="ts" setup>
import { type SelectProps } from 'ant-design-vue'
import { tryParse, filterOption } from '@fusionx/utils'
import { useModel, useOptions, useEvents } from '../../_hooks'
import type { WidgetMap } from '@/types/fux-core/form'

const { config } = defineProps<{
  config: WidgetMap['select']
}>()

const fieldNames = computed<SelectProps['fieldNames']>(() => tryParse(config.props.fieldNames))

const { options } = useOptions(config)
const { model } = useModel(config)
const evt = useEvents(config.props.event)

const filterFn = (input: string, option: any) => {
  const label = fieldNames.value?.label
  return filterOption(input, option, label || 'label')
}
</script>
