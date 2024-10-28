<template>
  <ATextarea
    v-model:value="model"
    :allow-clear="config.props.allowClear"
    :default-value="config.props.defaultValue"
    :disabled="config.props.disabled"
    :maxlength="config.props.maxlength"
    :rows="config.props.rows"
    :readonly="config.props.readonly"
    :placeholder="config.props.placeholder"
    :show-count="config.props.showCount"
    :auto-size="autosize"
  />
</template>

<script lang="ts" setup>
import { useModel } from '../../_hooks'
import { inject, computed, type PropType } from 'vue'
import type { WidgetMap } from '@/types/fux-core/form'

const { config } = defineProps<{
  config: WidgetMap['textarea']
}>()

const { model } = useModel(config)

const autosize = computed(() => {
  if (config.props.minRows || config.props.maxRows) {
    return {
      minrows: config.props.minRows,
      maxRows: config.props.maxRows
    }
  } else {
    return config.props.autoResize
  }
})
</script>
