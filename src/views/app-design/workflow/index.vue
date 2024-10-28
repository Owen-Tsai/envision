<template>
  <WorkflowDesigner v-model:schema="appSchema.flow" />
</template>

<script setup lang="ts">
import { useAppDesignCtxInjection } from '../use-app-design'
import WorkflowDesigner from '@/components/fux-core/workflow-designer/index.vue'

const { appSchema } = useAppDesignCtxInjection()!
</script>
