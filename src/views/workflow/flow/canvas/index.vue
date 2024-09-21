<template>
  <div class="flow-canvas">
    <NodeRenderer v-model:nodes="schema.nodes" />
    <div class="node-wrapper">
      <div class="end-node">流程结束</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNode } from '../use-nodes'
import NodeRenderer from './nodes/index.vue'

const { selectNode, schema } = useNode()
</script>

<style lang="scss" scoped>
.flow-canvas {
  padding-top: 10vh;
}
</style>
