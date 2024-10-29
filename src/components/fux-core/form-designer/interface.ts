import type { AppSchema } from '@/types/fux-core'

export interface PanelProps {
  width?: number | string
  collapsible?: boolean
}

export interface Props {
  factoryPanel?: PanelProps
  setterPanel?: PanelProps
  schema: AppSchema
}
