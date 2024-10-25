import { inject } from 'vue'
import { remove } from 'lodash-es'
import {
  flowCtxInjectionKey,
  type FlowCreatorCtx,
  type NodeConfigMap,
  type Node
} from '@/types/workflow/flow'

export const useNode = () => {
  const { schema, selectedNode } = inject<FlowCreatorCtx>(flowCtxInjectionKey)!

  const selectNode = (node: Node) => {
    selectedNode.value = node
  }

  const deleteNode = (uid: string, siblings?: Node[]) => {
    const list = siblings || schema.nodes
    remove(list, (e) => e.uid === uid)
  }

  return {
    schema,
    selectedNode,
    selectNode,
    deleteNode
  }
}

export const nodeInitConfig: NodeConfigMap = {
  audit: {
    type: 'audit',
    name: '审批人',
    uid: '',
    props: {
      actor: {},
      fields: []
    }
  },
  group: {
    type: 'group',
    name: '条件分支',
    uid: '',
    props: {
      children: []
    }
  },
  start: {
    type: 'start',
    name: '发起人',
    uid: '',
    props: {
      actor: {
        type: []
      }
    }
  },
  condition: {
    type: 'condition',
    name: '条件',
    uid: '',
    props: {
      condition: ''
    }
  }
}
