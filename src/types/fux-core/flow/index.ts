export interface NPropsFieldConfig {
  name?: string
  config?: 'show' | 'hide' | 'readonly' | 'edit'
}

export interface NPropsAudit {
  actor: {
    strategy?: number | string
    value?: (number | string)[]
    text?: string
  }
  fields: Array<NPropsFieldConfig>
  joint?: boolean // 是否为会签
}

export type NPropsStart = any

export type NPropsConditionalGroup = {
  children: Array<Node[]>
}

export type NPropsCondition = {
  // for now we use string (UEL, unified expression language)
  // this should be replaced by a UEL (de)serializer for better UX
  condition?: string
}

export type NodePropsMap = {
  audit: NPropsAudit
  start: NPropsStart
  condition: NPropsCondition
  group: NPropsConditionalGroup
}

export type ConfigOf<T extends keyof NodePropsMap> = {
  uid: string
  name: string
  type: T
  props: NodePropsMap[T]
}

export type NodeConfigMap = {
  [x in keyof NodePropsMap]: ConfigOf<x>
}

export type Node = NodeConfigMap[keyof NodeConfigMap]

export interface FlowSchema {
  nodes: Node[]
}
