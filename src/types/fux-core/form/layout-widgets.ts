import type { Widget } from './index'

interface FieldProps {
  label?: string
  name?: string
}

interface WPropsCommon {
  hide?: boolean
  field: FieldProps
}

export interface WPropsGridCol {
  span?: number
  widgets: Widget[]
}

export interface WPropsGrid extends WPropsCommon {
  align?: 'top' | 'middle' | 'bottom' | 'stretch'
  justify?: 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
  gutter?: number
  wrap?: boolean
  children: WPropsGridCol[]
}

export interface WPropsTabsPane {
  title?: string
  widgets: Widget[]
}

export interface WPropsTabs extends WPropsCommon {
  centered?: boolean
  destroyInactivePanes?: boolean
  size?: 'large' | 'middle' | 'small'
  type?: 'line' | 'card'
  stepsMode?: boolean
  state: {
    current: number
    showActions: boolean
  }
  children: WPropsTabsPane[]
}

export interface WPropsStep {
  title: string
  desc?: string
  widgets: Widget[]
}

export interface WPropsSteps extends WPropsCommon {
  size?: 'default' | 'small'
  type?: 'default' | 'navigation' | 'dot'
  children: WPropsStep[]
  state: {
    current: number
    showActions: boolean
  }
}

export interface WPropsSubForm extends WPropsCommon {
  max?: number
  min?: number
  children: Widget[]
}

export type WPropsTableColumn = {
  align?: 'left' | 'right' | 'center'
  title?: string
  width?: number
  key?: string
  formatter?: {
    type: 'dict' | 'custom' | null
    value: string
  }
  dataIndex?: string
}

export type WPropsTablePagination = {
  pageSize?: number
  lite?: boolean // showLessItems
  small?: boolean // size="small"
}

export interface WPropsDataTable extends WPropsCommon {
  columns?: WPropsTableColumn[]
  pagination: WPropsTablePagination
  formWidth?: string
  widgets: Widget[]
  state: {
    mode: 'table' | 'form'
  }
  url?: string
}

export interface LayoutWidgetPropsMap {
  grid: WPropsGrid
  tabs: WPropsTabs
  steps: WPropsSteps
  subForm: WPropsSubForm
  dataTable: WPropsDataTable
}
