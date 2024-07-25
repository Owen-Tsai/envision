<template>
  <ARadioGroup
    v-model:value="model"
    :disabled="config.props.disabled"
    :options="options"
    :option-type="config.props.optionType?.includes('button') ? 'button' : undefined"
    :button-style="config.props.optionType === 'solid-button' ? 'solid' : undefined"
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
import { computed, inject, type PropType } from 'vue'
import useDict from '@/hooks/use-dict'
import type { RadioGroupProps } from 'ant-design-vue'
import { injectionKey, type WidgetConfigMap, type FormCreatorCtx } from '@/types/workflow'
import useModel from '../use-model'

const formCreatorCtx = inject<FormCreatorCtx>(injectionKey)

const isDebugMode = computed(() => !!formCreatorCtx && !!formCreatorCtx.debug)

const props = defineProps({
  config: {
    type: Object as PropType<WidgetConfigMap['radio']>,
    required: true
  }
})

const { model } = useModel(props.config.props.field.name || props.config.uid)

const options = computed<RadioGroupProps['options']>(() => {
  const settings = props.config.props.options
  if (settings?.type === 'static') {
    return settings.staticData || []
  } else if (settings?.type === 'dict') {
    if (!settings.dictType) return []
    const [dictData] = useDict(settings.dictType)
    return dictData.value
  } else {
    // todo: options via API
    return []
  }
})
</script>
