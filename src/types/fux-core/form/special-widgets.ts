import type { ButtonProps } from 'ant-design-vue'
import type { WPropsCommon as CommonProps } from './form-widgets'

type WPropsCommon = Pick<CommonProps, 'event' | 'hide' | 'disabled' | 'field'>

export interface WPropsButton extends WPropsCommon {
  type?: ButtonProps['type']
  label?: string
  block?: boolean
  danger?: boolean
  href?: string
  target?: string
  icon?: string
  loading?: boolean
  shape?: ButtonProps['shape']
}

export interface SpecialWidgetPropsMap {
  button: WPropsButton
}
