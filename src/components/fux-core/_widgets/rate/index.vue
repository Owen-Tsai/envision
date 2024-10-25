<template>
  <ARate
    v-model:value="model"
    :allow-clear="config.props.allowClear"
    :allow-half="config.props.allowHalf"
    :count="config.props.count"
    :disabled="config.props.disabled"
    :tooltips="tooltips"
  >
    <template #character>
      <AddonRenderer v-if="config.props.symbol" :addon="config.props.symbol" />
      <StarFilled v-else />
    </template>
  </ARate>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useModel } from '../../_hooks'
import { tryParse } from '@fusionx/utils'
import AddonRenderer from '@/components/_internal/addon-renderer.vue'
import type { WidgetMap } from '@/types/fux-core'

const { config } = defineProps<{
  config: WidgetMap['rate']
}>()

const { model } = useModel(config)

const tooltips = computed(() => tryParse(config.props.tooltips))
</script>
