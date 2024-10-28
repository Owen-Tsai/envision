<template>
  <div class="node-wrapper">
    <div class="node start-node">
      <div class="header">
        <div class="flex items-center gap-1">
          <span class="node-name">{{ config.name }}</span>
        </div>
      </div>
      <div class="body" @click="selectedNode = config">
        <div class="flex items-center justify-between w-full">
          <span class="w-10/12">
            <ATypographyText content="发起人" ellipsis />
          </span>
        </div>
      </div>
    </div>
    <!-- btn -->
    <NodeButton @click="onAddNode" />
  </div>
</template>

<script setup lang="ts">
import NodeButton from '../node-button.vue'
import { useWorkflowCtxInjection } from '../../_hooks'
import type { NodeConfigMap } from '@/types/fux-core/flow'

const { config } = defineProps<{
  config: NodeConfigMap['start']
}>()

const emit = defineEmits(['add-node'])

const { selectedNode } = useWorkflowCtxInjection()!

const onAddNode = (type: keyof NodeConfigMap) => {
  emit('add-node', type)
}
</script>
