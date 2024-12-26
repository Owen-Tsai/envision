<template>
  <Cascader
    v-model:value="model"
    :allow-clear="config.props.allowClear"
    :change-on-select="config.props.allowParentNode"
    :default-value="defaultValue"
    :show-checked-strategy="config.props.showCheckedStrategy"
    :disabled="config.props.disabled"
    :field-names="fieldNames"
    :max-tag-count="config.props.maxTagCount"
    :multiple="config.props.multiple"
    :max-tag-text-length="config.props.maxTagTextLength"
    :load-data="config.props.lazyLoad ? loadData : undefined"
    :options="options"
    @blur="evt?.handler('blur')"
    @change="evt?.handler('change')"
    @focus="evt?.handler('focus')"
  />
</template>

<script lang="ts" setup>
import Cascader from '@/components/cascader/index.vue'
import { useModel, useTreeStructureOptions, useEvents } from '../../_hooks'
import { tryParse } from '@fusionx/utils'
import request from '@/utils/request'
import type { CascaderProps } from 'ant-design-vue'
import type { WidgetMap } from '@/types/fux-core/form'

const { config } = defineProps<{
  config: WidgetMap['cascader']
}>()

const { model } = useModel(config)
const evt = useEvents(config.props.event)
const fieldNames = computed(() => tryParse(config.props.fieldNames))
const defaultValue = computed(() => tryParse(config.props.defaultValue))
const { options } = useTreeStructureOptions(config)

const loadData: CascaderProps['loadData'] = (selectedOpts) => {
  const url = config.props.lazyLoadUrl
  if (!url) return
  try {
    const node = selectedOpts[selectedOpts.length - 1]
    node.loading = true
    request.get<CascaderProps['options']>({ url, params: { value: node.value } }).then((res) => {
      node.children = res
      node.loading = false
    })
  } catch (e) {
    return
  }
}
</script>
