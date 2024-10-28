import type { FormSchema } from '@/types/fux-core/form'

export interface PanelProps {
  width?: number | string
  collapsible?: boolean
}

export interface Props {
  factoryPanel?: PanelProps
  setterPanel?: PanelProps
  schema: FormSchema
}
