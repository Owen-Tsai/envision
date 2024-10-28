<template>
  <Upload
    v-model:value="model"
    :action="config.props.action"
    :accept="config.props.accept"
    :list-type="config.props.type"
    :limit="config.props.limit"
    :size-limit="config.props.sizeLimit"
    :disabled="config.props.disabled"
  />
</template>

<script lang="ts" setup>
import { useModel } from '../../_hooks'
import Upload from '@/components/upload/index.vue'
import type { WidgetMap } from '@/types/fux-core/form'

const { config } = defineProps<{
  config: WidgetMap['upload']
}>()

const { model } = useModel(config)
</script>
