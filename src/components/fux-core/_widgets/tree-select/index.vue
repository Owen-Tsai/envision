<template>
  <ATreeSelect
    v-model:value="model"
    :allow-clear="config.props.allowClear"
    :default-value="defaultValue"
    :field-names="fieldNames"
    :disabled="config.props.disabled"
    :list-height="config.props.listHeight"
    :max-tag-count="config.props.maxTagCount"
    :max-tag-text-length="config.props.maxTagTextLength"
    :multiple="config.props.multiple"
    :placeholder="config.props.placeholder"
    :placement="config.props.placement"
    :show-checked-strategy="config.props.showCheckedStrategy"
    :show-search="config.props.showSearch"
    :tree-line="config.props.showLine"
    :tree-data="options"
    :tree-node-filter-prop="fieldNames ? fieldNames['title'] : undefined"
    :tree-checkable="config.props.multiple"
    :load-data="config.props.lazyLoad ? loadData : undefined"
    @blur="evt?.handler('blur')"
    @change="evt?.handler('change')"
    @focus="evt?.handler('focus')"
  />
</template>

<script lang="ts" setup>
import { useModel, useTreeStructureOptions, useEvents } from '../../_hooks'
import { tryParse } from '@fusionx/utils'
import request from '@/utils/request'
import type { TreeSelectProps } from 'ant-design-vue'
import type { WidgetMap } from '@/types/fux-core/form'

const { config } = defineProps<{
  config: WidgetMap['treeSelect']
}>()

const { model } = useModel(config)
const fieldNames = computed(() => tryParse(config.props.fieldNames))
const defaultValue = computed(() => tryParse(config.props.defaultValue))
const { options } = useTreeStructureOptions(config)
const evt = useEvents(config.props.event)

const loadData: TreeSelectProps['loadData'] = (node) => {
  return new Promise(async (resolve, reject) => {
    const url = config.props.lazyLoadUrl
    if (!url) reject('no url')
    const { value } = node
    node.loading = true
    const res = await request.get<TreeSelectProps['treeData']>({ url, params: { value } })
    resolve(res)
  })
}
</script>
