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
    <ConditionNode
      v-else-if="item.type === 'condition'"
      :config="item"
      :index="i"
      @add-node="(type) => addNode(type, i)"
      @delete="removeNode(i, true)"
    />
    <ConditionalGroup
      v-else-if="item.type === 'group'"
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
import { generateId } from '@fusionx/utils'
import StartNode from './start/index.vue'
import AuditNode from './audit/index.vue'
import ConditionNode from './condition/index.vue'
import ConditionalGroup from './conditional-group.vue'
import nodeConfigMap from '../_utils/initial-node-config'
import type { Node, NodeConfigMap } from '@/types/fux-core/flow'

const { nodes } = defineProps({
  nodes: {
    type: Array as PropType<Node[]>,
    required: true,
  },
})

const emit = defineEmits(['update:nodes', 'clear-branch'])

const computedNodes = computed({
  get: () => nodes,
  set: (val) => {
    emit('update:nodes', val)
  },
})

const addNode = (type: keyof NodeConfigMap, index: number) => {
  const nodeToInsert = cloneDeep(nodeConfigMap[type])

  if (type === 'group') {
    ;(nodeToInsert as NodeConfigMap['group']).props.children.push(
      ...[
        [
          cloneDeep({
            ...nodeConfigMap['condition'],
            uid: generateId(),
            name: '条件1',
          }),
        ],
        [
          cloneDeep({
            ...nodeConfigMap['condition'],
            uid: generateId(),
            name: '条件2',
          }),
        ],
      ],
    )
  }

  computedNodes.value.splice(index + 1, 0, {
    ...nodeToInsert,
    uid: generateId(),
  })
}

const removeNode = (index: number, clearBranch?: boolean) => {
  computedNodes.value.splice(index, 1)

  if (clearBranch) {
    emit('clear-branch')
  }
}

defineOptions({
  name: 'NodeRenderer',
})
</script>
