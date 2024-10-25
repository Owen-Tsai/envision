<template>
  <template v-if="addon.type === 'text'">{{ addon.value }}</template>
  <component v-else :is="icon" />
</template>

<script lang="ts" setup>
import { getCurrentInstance, computed } from 'vue'

const iconsMap = getCurrentInstance()?.proxy?.$icons

const props = withDefaults(
  defineProps<{
    addon?: {
      type: 'text' | 'icon'
      value?: string
    }
  }>(),
  {
    addon: () => ({ type: 'text' })
  }
)

const { addon } = props

const icon = computed(() => {
  if (addon.value && iconsMap && iconsMap[addon.value]) {
    return iconsMap[addon.value]
  }

  return undefined
})
</script>
