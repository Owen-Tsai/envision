<template>
  <ACascader
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
  />
</template>

<script lang="ts" setup>
import { ref, computed, inject, type PropType } from 'vue'
import request from '@/utils/request'
import useModel from '../use-model'
import { type CascaderProps } from 'ant-design-vue'
import { type WidgetConfigMap } from '@/types/workflow/form'
import { tryParse } from '@/utils/fusion'

const props = defineProps({
  config: {
    type: Object as PropType<WidgetConfigMap['cascader']>,
    required: true
  }
})

const fieldNames = computed(() => tryParse(props.config.props.fieldNames))
const defaultValue = computed(() => tryParse(props.config.props.defaultValue))

const options = ref<CascaderProps['options']>([])
const { model } = useModel(props.config.props.field.name || props.config.uid)

const settings = props.config.props.options
if (settings?.type === 'static') {
  options.value =
    (typeof settings.staticData === 'string'
      ? tryParse(settings.staticData)
      : settings.staticData) || []
} else {
  // todo: options via API
  options.value = []
}

const loadData: CascaderProps['loadData'] = (selectedOpts) => {
  const url = props.config.props.lazyLoadUrl
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
