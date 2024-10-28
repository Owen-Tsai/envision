import type { FormWidgetPropsMap } from './form-widgets'
import type { LayoutWidgetPropsMap } from './layout-widgets'
import type { SpecialWidgetPropsMap } from './special-widgets'
import type { APIConfig, FormProps, FunctionConfig } from './misc'
export * from './form-widgets'
export * from './layout-widgets'
export * from './special-widgets'
export * from './misc'

export type WidgetPropsMap = FormWidgetPropsMap & LayoutWidgetPropsMap & SpecialWidgetPropsMap

export type ConfigOf<T extends keyof WidgetPropsMap> = {
  name: string
  icon?: string
  type: T
  class: T extends keyof FormWidgetPropsMap
    ? 'form'
    : T extends keyof LayoutWidgetPropsMap
      ? 'layout'
      : 'special'
  uid: string
  props: WidgetPropsMap[T]
}

export type WidgetType = keyof WidgetPropsMap

export type WidgetMap = {
  [x in WidgetType]: ConfigOf<x>
}

export type Widget = WidgetMap[keyof WidgetMap]
export type FormWidget = WidgetMap[keyof FormWidgetPropsMap]
export type LayoutWidget = WidgetMap[keyof LayoutWidgetPropsMap]
export type SpecialWidget = WidgetMap[keyof SpecialWidgetPropsMap]

export interface FormSchema extends FormProps {
  function?: Record<string, FunctionConfig>
  api?: Record<string, APIConfig>
  widgets: Widget[]
}
