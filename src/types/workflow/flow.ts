import type { Ref } from 'vue'
// #region Flow Types
export type NodeType = 'start' | 'audit' | 'group' | 'condition'
export type ProcessNodeType = 'audit' | 'start' | 'group'

export type NodeFieldProps = {
  uid: string
  flag: 'disabled' | 'hide' | 'editable'
}

export type NPropsAudit = {
  actor: {
    strategy?: number | string
    value?: (number | string)[]
    text?: string
  }
  fields: NodeFieldProps[]
}

export type NPropsConditionalGroup = {
  children: Array<Node[]>
}

export type NPropsCondition = {
  // for now we use string (UEL, unified expression language)
  // this should be replaced by a UEL (de)serializer for better UX
  condition: string
}

export type NPropsStart = {}

export type ProcessNodePropsMap = {
  start: NPropsStart
  audit: NPropsAudit
  group: NPropsConditionalGroup
}

export type NodePropsMap = {
  condition: NPropsCondition
} & ProcessNodePropsMap

type ConfigOf<T extends keyof NodePropsMap> = {
  name: string
  type: T
  uid: string
  props: NodePropsMap[T]
}

export type NodeConfigMap = {
  [x in NodeType]: ConfigOf<x>
}
export type ProcessNodeConfigMap = {
  [x in NodeType]: ConfigOf<x>
}

export type Node = NodeConfigMap[keyof NodeConfigMap]
// #endregion

export type FlowSchema = {
  nodes: Node[]
}

export type FlowCreatorCtx = {
  schema: FlowSchema
  selectedNode: Ref<Node | undefined>
}

export const flowCtxInjectionKey = Symbol('flow')
