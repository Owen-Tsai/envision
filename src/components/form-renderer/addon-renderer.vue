<template>
  <template v-if="addonType === 'text'">{{ addonValue }}</template>
  <component v-else :is="icon" />
</template>

<script lang="ts" setup>
import { getCurrentInstance, computed, type PropType } from 'vue'

const iconsMap = getCurrentInstance()?.proxy?.$icons

const props = defineProps({
  addonType: {
    type: String as PropType<'icon' | 'text'>,
    default: 'text'
  },
  addonValue: {
    type: String
  }
})

const icon = computed(() => {
  if (props.addonValue && iconsMap && iconsMap[props.addonValue]) {
    return iconsMap[props.addonValue]
  }

  return undefined
})
</script>
