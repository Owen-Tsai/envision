<template>
  <ACheckboxGroup
    v-model:value="model"
    v-show="isDebugMode ? config.props.options.type === 'static' : true"
    :disabled="config.props.disabled"
    :options="options"
  />
  <div
    class="remote-opts-placeholder"
    v-show="isDebugMode ? config.props.options.type === 'dict' : false"
  >
    （选项经由字典设置）
  </div>
  <div
    class="remote-opts-placeholder"
    v-show="isDebugMode ? config.props.options.type === 'api' : false"
  >
    （选项经由 API 设置）
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, watch, type PropType } from 'vue'
import useDict from '@/hooks/use-dict'
import useModel from '../use-model'
import type { CheckboxGroupProps } from 'ant-design-vue'
import {
  parentFieldKey,
  debugKey,
  type WidgetConfigMap,
  type ParentFormPropType
} from '@/types/workflow'

const parentFormConfig = inject<ParentFormPropType | undefined>(parentFieldKey, undefined)
const isDebugMode = inject<boolean>(debugKey, false)

const props = defineProps({
  config: {
    type: Object as PropType<WidgetConfigMap['checkbox']>,
    required: true
  }
})

const options = ref<CheckboxGroupProps['options']>([])
const { model } = useModel(props.config.props.field.name || props.config.uid, parentFormConfig)
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
</script>
