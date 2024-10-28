<template>
  <div class="flow-canvas">
    <NodeRenderer v-model:nodes="schema.nodes" />
    <div class="node-wrapper">
      <div class="end-node">流程结束</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWorkflowCtxInjection } from '../../_hooks'
import NodeRenderer from '../../_nodes/index.vue'

const { schema } = useWorkflowCtxInjection()
</script>

<style lang="scss" scoped>
.flow-canvas {
  padding-top: 10vh;
}
</style>
