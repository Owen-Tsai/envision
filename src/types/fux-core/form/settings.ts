export interface AttrSettingSchema {
  component?: 'AInput' | 'ATextarea' | 'ASelect' | 'ARadio' | 'AInputNumber' | 'ASwitch'
  label?: string
  name: string
  extra?: string
  props?: Record<string, any>
}
