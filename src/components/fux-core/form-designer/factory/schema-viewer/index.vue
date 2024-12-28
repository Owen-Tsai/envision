<template>
  <div class="">
    <div v-html="highlighted" />
  </div>
</template>

<script setup lang="ts">
import useHighlighter from '@/hooks/use-highlighter'
import { useDesignerInjection } from '../../../_hooks'

const { appSchema } = useDesignerInjection()!

const highlighted = computed(() =>
  useHighlighter(JSON.stringify(appSchema?.value, null, 2), 'json'),
)
</script>
