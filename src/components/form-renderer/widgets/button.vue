<template>
  <AButton
    :block="config.props.block"
    :danger="config.props.danger"
    :disabled="config.props.disabled"
    :href="config.props.href"
    :loading="config.props.loading"
    :target="config.props.target"
    :type="config.props.type"
    :shape="config.props.shape"
  >
    <component
      v-if="config.props.icon && iconsMap && iconsMap[config.props.icon]"
      :is="iconsMap[config.props.icon]"
    />
    {{ config.props.label }}
  </AButton>
</template>

<script setup lang="ts">
import { getCurrentInstance, type PropType } from 'vue'
import type { WidgetConfigMap } from '@/types/workflow'

defineProps({
  config: {
    type: Object as PropType<WidgetConfigMap['button']>,
    required: true
  }
})

const iconsMap = getCurrentInstance()?.proxy?.$icons
</script>
