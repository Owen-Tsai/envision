export interface NPropsAudit {
  actor: {
    strategy?: number | string
    value?: (number | string)[]
    text?: string
  }
  // todo: fields should be a map/array altering form widget attributes
  fields: any[]
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
