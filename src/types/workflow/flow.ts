import type { Ref } from 'vue'
// #region Flow Types
export type ProcessNodeType = 'audit' | 'cc' | 'start'
export type NodeType = ProcessNodeType | 'condition'
export type AddableNodeType = 'audit' | 'cc' | 'condition'
type ConditionPropsNumber = {
  uid: string
  operator: '==' | '!=' | '>' | '>=' | '<' | '<=' | '~'
  oprd1: number
  oprd2?: number
  includeBoundary?: [boolean, boolean]
}

type ConditionPropsString = {
  uid: string
  operator: '==' | '!=' | 'like' | 'notLike'
  oprd: string
}

type ConditionPropsBoolean = {
  uid: string
  operator: '==' | '!='
  oprd: boolean
}

export type ConditionProps = ConditionPropsNumber | ConditionPropsString | ConditionPropsBoolean

export type NodeFieldProps = {
  uid: string
  flag: 'disabled' | 'hide' | 'editable'
}

export type NPropsAudit = {
  actor: {
    users: (number | string)[]
    roles: (number | string)[]
  }
  fields: NodeFieldProps[]
}

export type NPropsCc = {
  actor: {
    users: (number | string)[]
    roles: (number | string)[]
  }
  fields: NodeFieldProps[]
}

export type NPropsCondition = {
  condition: ConditionProps[]
}

export type NPropsStart = {
  actor: {
    type: number[] // 个人/单位 可以发起
  }
}

export type NodePropsMap = {
  start: NPropsStart
  audit: NPropsAudit
  cc: NPropsCc
  condition: NPropsCondition
}

type ConfigOf<T extends keyof NodePropsMap> = {
  name: string
  type: T
  class: T extends ProcessNodeType ? 'process' : 'condition'
  uid: string
  props: NodePropsMap[T]
}

export type NodeConfigMap = {
  [x in ProcessNodeType]: ConfigOf<x>
}

export type Node = NodeConfigMap[keyof NodeConfigMap]
// #endregion

export type FlowSchema = {
  flow: {
    nodes: Node[]
  }
}

export type FlowCreatorCtx = {
  schema: FlowSchema
  selectedNode: Ref<Node | undefined>
}

export const flowCtxInjectionKey = Symbol('flow')
