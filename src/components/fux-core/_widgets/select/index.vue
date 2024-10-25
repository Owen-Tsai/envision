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
import { ref, computed, watch } from 'vue'
import { type SelectProps } from 'ant-design-vue'
import { tryParse, filterOption } from '@fusionx/utils'
import { useModel, useOptions } from '../../_hooks'
import type { WidgetMap } from '@/types/fux-core'

const { config } = defineProps<{
  config: WidgetMap['select']
}>()

const fieldNames = computed<SelectProps['fieldNames']>(() => tryParse(config.props.fieldNames))

const { options } = useOptions(config)
const { model } = useModel(config)

const filterFn = (input: string, option: any) => {
  const label = fieldNames.value?.label
  return filterOption(input, option, label || 'label')
}
</script>
