<template>
  <div v-for="(item, i) in nodes" :key="item.uid">
    <StartNode
      v-if="item.type === 'start'"
      :config="item"
      :index="i"
      @add-node="(type) => addNode(type, i)"
    />
    <AuditNode
      v-else-if="item.type === 'audit'"
      :config="item"
      :index="i"
      @add-node="(type) => addNode(type, i)"
      @delete="removeNode(i)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import { cloneDeep } from 'lodash-es'
import { generateID } from '@/utils/fusion'
import StartNode from './start/index.vue'
import AuditNode from './audit/index.vue'
import nodeConfigMap from '../_utils/initial-node-config'
import type { Node, NodeConfigMap } from '@/types/fux-core/flow'

const props = defineProps({
  nodes: {
    type: Array as PropType<Node[]>,
    required: true,
  },
})

const emit = defineEmits(['update:nodes', 'update:parentNodes', 'update:group'])

const computedNodes = computed({
  get: () => props.nodes,
  set: (val) => {
    emit('update:nodes', val)
  },
})

const addNode = (type: keyof NodeConfigMap, index: number) => {
  const nodeToInsert = cloneDeep(nodeConfigMap[type])

  computedNodes.value.splice(index + 1, 0, {
    ...nodeToInsert,
    uid: generateID(),
  })
}

const removeNode = (index: number) => {
  computedNodes.value.splice(index, 1)
}

defineOptions({
  name: 'NodeRenderer',
})
</script>
