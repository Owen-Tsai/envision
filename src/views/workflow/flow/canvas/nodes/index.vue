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
      @remove-node="removeNode(i)"
    />
    <ConditionNode
      v-else-if="item.type === 'condition'"
      :config="item"
      :index="index!"
      @add-node="(type) => addNode(type, index!)"
      @remove-node="removeNode(i, true)"
    />
    <div v-else-if="item.type === 'group'" class="conditional-group">
      <div class="text-center relative z-2">
        <AButton shape="round" @click="addBranch(item)">添加条件</AButton>
      </div>
      <div class="node-wrapper -mt-4 z-1">
        <div class="branches">
          <div class="branch" v-for="(subNodes, idx) in item.props.children" :key="idx">
            <NodeRenderer :nodes="subNodes" :index="idx" :parent-nodes="nodes" :group="item" />
            <div v-if="idx === 0" class="edge-line line-tl"></div>
            <div v-if="idx === 0" class="edge-line line-bl"></div>
            <div v-if="idx === item.props.children.length - 1" class="edge-line line-tr"></div>
            <div v-if="idx === item.props.children.length - 1" class="edge-line line-br"></div>
          </div>
        </div>
        <div>
          <AddButton :index="i" @add-node="(type) => addNode(type, i)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import { cloneDeep, drop } from 'lodash'
import { generateID } from '@/utils/fusion'
import StartNode from './start-node.vue'
import AuditNode from './audit-node.vue'
import ConditionNode from './condition-node.vue'
import AddButton from './add-button.vue'
import { nodeInitConfig } from '../../use-nodes'
import type { Node, NodeConfigMap, NodeType } from '@/types/workflow/flow'

const props = defineProps({
  nodes: {
    type: Array as PropType<Node[]>,
    required: true
  },
  index: {
    type: Number
  },
  parentNodes: {
    type: Array as PropType<Node[]>
  },
  group: {
    type: Object as PropType<NodeConfigMap['group']>
  }
})

const emit = defineEmits(['update:nodes', 'update:parentNodes', 'update:group'])

const computedNodes = computed({
  get: () => props.nodes,
  set: (val) => {
    emit('update:nodes', val)
  }
})

const computedParents = computed({
  get: () => props.parentNodes,
  set: (val) => {
    emit('update:parentNodes', val)
  }
})

const computedGroup = computed({
  get: () => props.group,
  set: (val) => {
    emit('update:group', val)
  }
})

const addNode = (type: NodeType, index: number) => {
  const nodeToInsert = cloneDeep(nodeInitConfig[type])
  if (type === 'group') {
    ;(nodeToInsert as NodeConfigMap['group']).props.children.push(
      ...[
        [
          cloneDeep({
            ...nodeInitConfig['condition'],
            uid: generateID(),
            name: '条件1'
          })
        ],
        [
          cloneDeep({
            ...nodeInitConfig['condition'],
            uid: generateID(),
            name: '条件2'
          })
        ]
      ]
    )
  }
  computedNodes.value.splice(index + 1, 0, {
    ...nodeToInsert,
    uid: generateID()
  })
}

const addBranch = (groupNode: NodeConfigMap['group']) => {
  groupNode.props.children.push([
    {
      ...cloneDeep(nodeInitConfig['condition']),
      name: `条件${groupNode.props.children.length + 1}`,
      uid: generateID()
    }
  ])
}

const removeNode = (index: number, isConditionNode?: boolean) => {
  computedNodes.value.splice(index, 1)
  if (isConditionNode) {
    // should clear any nodes in the same group
    computedGroup.value?.props.children.splice(props.index!, 1)
    // if the group, after deletion, has only 1 branch left
    // then we should remove the group, and add nodes to the parent
    if (computedGroup.value?.props.children.length === 1) {
      // get the nodes of the only branch in group
      const branchNodes = computedGroup.value.props.children[0]
      // remove the group
      const idx = computedParents.value?.findIndex((item) => item.uid === computedGroup.value!.uid)
      // add nodes to the parent, drop the first node as it's condition node
      computedParents.value?.splice(idx as number, 1, ...drop(branchNodes))
    }
  }
}

defineOptions({
  name: 'NodeRenderer'
})
</script>
