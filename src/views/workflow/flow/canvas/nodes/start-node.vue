<template>
  <div class="node-wrapper">
    <div class="node start-node">
      <div class="header">
        <div class="flex items-center gap-1">
          <span class="node-name">{{ config.name }}</span>
        </div>
      </div>
      <div class="body" @click="selectNode(config)">
        <div class="flex items-center justify-between w-full">
          <span class="w-10/12">
            <ATypographyText content="发起人" ellipsis />
          </span>
        </div>
      </div>
    </div>
    <!-- btn -->
    <AddButton @add-node="onAddNode" />
  </div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue'
import AddButton from './add-button.vue'
import { useNode } from '../../use-nodes'
import type { NodeConfigMap, ProcessNodeType } from '@/types/workflow/flow'

defineProps({
  config: {
    type: Object as PropType<NodeConfigMap['start']>,
    required: true
  }
})

const { selectNode } = useNode()
const emit = defineEmits(['addNode'])

const onAddNode = (type: ProcessNodeType) => {
  emit('addNode', type)
}
</script>
