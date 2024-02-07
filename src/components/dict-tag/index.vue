<template>
  <ATag v-if="dictEntry?.listClass" :color="dictEntry.listClass">{{ dictEntry.dictLabel }}</ATag>
  <span v-else :class="dictEntry?.cssClass">{{ dictEntry?.dictLabel }}</span>
</template>

<script lang="ts" setup>
import { computed, watch, type PropType } from 'vue'
import type { DictDataVO } from '@/api/system/dict/data'

const props = defineProps({
  dictObject: {
    type: Object as PropType<DictDataVO>
  },
  value: {
    type: String,
    required: true
  }
})

const dictEntry = computed(() => {
  console.log(props.dictObject)
  return props.dictObject?.filter((e) => e.dictValue === props.value)[0]
})

watch(
  () => props.dictObject,
  (nv, ov) => {
    console.log('changed from', ov, 'to', nv)
  },
  { deep: true }
)
</script>
