<template>
  <ATreeSelect
    :allow-clear="config.props.allowClear"
    :default-value="config.props.defaultValue"
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
  />
</template>

<script setup lang="ts">
import { ref, computed, type PropType } from 'vue'
import { tryParse } from '@/utils/envision'
import type { TreeSelectProps } from 'ant-design-vue'
import type { WidgetConfigMap } from '@/types/workflow'

const props = defineProps({
  config: {
    type: Object as PropType<WidgetConfigMap['treeSelect']>,
    required: true
  }
})

const options = ref<TreeSelectProps['treeData']>([])

const fieldNames = computed(() => tryParse(props.config.props.fieldNames))

const settings = props.config.props.treeData
if (settings?.type === 'static') {
  options.value =
    (typeof settings.staticData === 'string'
      ? tryParse(settings.staticData)
      : settings.staticData) || []
} else {
  // todo: options via API
  options.value = []
}
</script>
