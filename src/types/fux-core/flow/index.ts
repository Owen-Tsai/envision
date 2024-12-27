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
}

export type NPropsStart = any

export type NodePropsMap = {
  audit: NPropsAudit
  start: NPropsStart
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
