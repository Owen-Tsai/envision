<template>
  <ARadioGroup
    v-model:value="model"
    :disabled="config.props.disabled"
    :options="options"
    :option-type="config.props.optionType?.includes('button') ? 'button' : undefined"
    :button-style="config.props.optionType === 'solid-button' ? 'solid' : undefined"
    :class="{ hidden: isDebugMode }"
  />
  <div
    class="remote-opts-placeholder"
    v-if="isDebugMode ? config.props.options.type === 'dict' : false"
  >
    （选项经由字典设置）
  </div>
  <div
    class="remote-opts-placeholder"
    v-if="isDebugMode ? config.props.options.type === 'api' : false"
  >
    （选项经由 API 设置）
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, type PropType, watch } from 'vue'
import useDict from '@/hooks/use-dict'
import type { RadioGroupProps } from 'ant-design-vue'
import {
  debugKey,
  parentFieldKey,
  type WidgetConfigMap,
  type ParentFormPropType
} from '@/types/workflow/form'
import useModel from '../use-model'

const parentFormConfig = inject<ParentFormPropType | undefined>(parentFieldKey, undefined)

const isDebugMode = inject<boolean>(debugKey, false)

const props = defineProps({
  config: {
    type: Object as PropType<WidgetConfigMap['radio']>,
    required: true
  }
})

const { model } = useModel(props.config.props.field.name || props.config.uid, parentFormConfig)
const options = ref<RadioGroupProps['options']>([])

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
