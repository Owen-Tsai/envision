<template>
  <ATag v-if="dictEntry?.colorType" :color="dictEntry.colorType">{{ dictEntry.label }}</ATag>
  <span v-else :class="dictEntry?.cssClass">{{ dictEntry?.label }}</span>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue'
import type { DictDataVO } from '@/api/system/dict/data'

const props = defineProps({
  dictObject: {
    type: Object as PropType<DictDataVO>
  },
  value: {
    type: Number,
    required: true
  }
})

const dictEntry = computed(() => {
  return props.dictObject?.filter((e) => e.value === props.value)[0]
})
</script>
