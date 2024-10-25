<template>
  <div class="">
    <div v-html="highlighted" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import useHighlighter from '@/hooks/use-highlighter'
import { useDesignerInjection } from '../../../_hooks'

const { schema } = useDesignerInjection()

const highlighted = computed(() => useHighlighter(JSON.stringify(schema?.value, null, 2), 'json'))
</script>
