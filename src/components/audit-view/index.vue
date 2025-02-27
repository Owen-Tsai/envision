<template>
  <table class="audit-view">
    <tr v-for="(row, rIdx) in splitedItems" :key="rIdx">
      <template v-for="(item, idx) in row" :key="idx">
        <th :style="labelStyle">{{ item.label }}</th>
        <td :style="contentStyle">{{ item.value }}</td>
      </template>
    </tr>
  </table>
</template>

<script setup lang="ts">
import { chunk } from 'lodash-es'
import type { CSSProperties } from 'vue'
import type { AuditItem } from './interface'

const {
  column = 3,
  labelWidth,
  contentWidth,
  items,
} = defineProps<{
  column?: number
  labelWidth?: string
  contentWidth?: string
  items: AuditItem[]
}>()

const splitedItems = computed(() => {
  return chunk(items, column)
})

const labelStyle = computed<CSSProperties>(() =>
  labelWidth
    ? {
        width: labelWidth,
      }
    : {},
)

const contentStyle = computed<CSSProperties>(() =>
  labelWidth
    ? {
        width: contentWidth,
      }
    : {},
)
</script>
