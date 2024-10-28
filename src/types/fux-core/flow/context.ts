import type { Ref } from 'vue'
import type { FlowSchema, Node } from './index'

export interface WorkflowDesignerCtx {
  schema: Ref<FlowSchema>
  selectedNode: Ref<Node | undefined>
  deleteNode: (uid: string) => void
}
