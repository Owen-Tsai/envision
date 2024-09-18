<template>
  <ATag v-if="dictEntry?.colorType" :color="dictEntry.colorType">{{ dictEntry.label }}</ATag>
  <span v-else :class="dictEntry?.cssClass">{{ dictEntry?.label }}</span>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue'
import type { DictDataEntry } from '@/api/system/dict/data'

const props = defineProps({
  dictObject: {
    type: Object as PropType<DictDataEntry[]>,
    required: true
  },
  value: {
    type: [String, Number, Boolean],
    required: true
  }
})

const dictEntry = computed(() => {
  return props.dictObject.find((e) => {
    if (typeof props.value === 'boolean') {
      return e.value === `${props.value}`
    }

    return e.value == props.value
  })
})
</script>
