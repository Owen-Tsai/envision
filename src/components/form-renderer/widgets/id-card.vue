<template>
  <AUpload
    v-model:file-list="model"
    :multiple="config.props.multiple"
    :max-count="config.props.maxCount"
    :accept="config.props.accept"
    :disabled="config.props.disabled"
    :headers="headers"
    :data="data"
    :name="config.props.name"
  >
    <div></div>
  </AUpload>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import useModel from '../use-model'
import { tryParse } from '@/utils/envision'
import type { WidgetConfigMap } from '@/types/workflow'

const props = defineProps({
  config: {
    type: Object as PropType<WidgetConfigMap['upload']>,
    required: true
  }
})

const { model } = useModel(props.config.props.field.name || props.config.uid)

const headers = computed(() => tryParse(props.config.props.headers) || undefined)
const data = computed(() => tryParse(props.config.props.data) || undefined)
</script>
