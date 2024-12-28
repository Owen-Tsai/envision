import type {
  SelectProps,
  CascaderProps,
  RadioGroupProps,
  CheckboxGroupProps,
  TreeSelectProps,
  DatePickerProps,
} from 'ant-design-vue'

interface FieldProps {
  label?: string
  extra?: string
  labelAlign?: 'left' | 'right'
  labelCol?: string
  labelWidth?: string
  wrapperCol?: string
  wrapperWidth?: string
  name?: string
  required?: boolean
  rules?: string
  validateTrigger?: string[]
}

export type CommonOption = {
  label?: string
  value: string
}

export type OptionSourceType = 'static' | 'dict' | 'expression'

export type OptionTypeOf<T, OST = OptionSourceType> = OST extends 'static'
  ? { type?: 'static'; value?: T }
  : { type?: 'expression' | 'dict'; value?: string }

export type JsonOptionType = {
  type?: 'static' | 'expression'
  value?: string
}

/**
 * 在输入框的前后缀（prefix/suffix）中使用的配置类型。
 * 也用在 Rate 组件中以指定符号。
 */
export type AddonProps = {
  type: 'icon' | 'text'
  value?: string
}

export interface WPropsCommon {
  disabled?: boolean
  readonly?: boolean
  hide?: boolean
  required?: boolean
  field: FieldProps
  event?: Record<string, string>
}

export interface WPropsInput extends WPropsCommon {
  allowClear?: boolean
  defaultValue?: string
  maxlength?: number
  placeholder?: string
  showCount?: boolean
  prefix?: AddonProps
  suffix?: AddonProps
}

export interface WPropsInputNumber extends WPropsCommon {
  allowClear?: boolean
  controls?: boolean
  defaultValue?: string
  max?: number
  min?: number
  placeholder?: string
  precision?: number
  prefix?: AddonProps
  step?: number
}

export interface WPropsTextarea extends WPropsCommon {
  allowClear?: boolean
  autoResize?: boolean
  defaultValue?: string
  showCount?: boolean
  maxlength?: number
  placeholder?: string
  minRows?: number
  maxRows?: number
  rows?: number
}

export interface WPropsSelect extends WPropsCommon {
  allowClear?: boolean
  defaultValue?: string | string[]
  fieldNames?: string
  listHeight?: number
  maxTagCount?: number
  maxTagTextLength?: number
  mode?: SelectProps['mode']
  options: OptionTypeOf<SelectProps['options']>
  placeholder?: string
  placement?: SelectProps['placement']
  showSearch?: boolean
}

export interface WPropsCascader extends WPropsCommon {
  defaultValue?: string
  allowClear?: boolean
  allowParentNode?: boolean
  fieldNames?: string
  lazyLoad?: boolean
  lazyLoadUrl?: string
  multiple?: boolean
  maxTagCount?: number
  maxTagTextLength?: number
  options: JsonOptionType
  placement?: CascaderProps['placement']
  showCheckedStrategy?: CascaderProps['showCheckedStrategy']
}

export interface WPropsRadio extends WPropsCommon {
  defaultValue?: string
  options: OptionTypeOf<RadioGroupProps['options']>
  type?: 'button' | 'solid-button' | 'default'
  placement?: 'vertical' | 'horizontal'
}

export interface WPropsCheckbox extends WPropsCommon {
  defaultValue?: string[]
  options: OptionTypeOf<CheckboxGroupProps['options']>
}

export interface WPropsTreeSelect extends WPropsCommon {
  allowClear?: boolean
  defaultValue?: string
  fieldNames?: string
  showSearch?: boolean
  listHeight?: number
  maxTagCount?: number
  maxTagTextLength?: number
  multiple?: boolean
  placeholder?: string
  placement?: SelectProps['placement']
  searchPlaceholder?: string
  showCheckedStrategy?: TreeSelectProps['showCheckedStrategy']
  simpleMode?: boolean
  showLine?: boolean
  lazyLoad?: boolean
  lazyLoadUrl?: string
  options: JsonOptionType
}

export interface WPropsSlider extends WPropsCommon {
  defaultValue?: number | [number, number]
  max?: number
  min?: number
  range?: boolean
  step?: number
  dots?: boolean
  marks?: string
  disableStep?: boolean
  hideTooltip?: boolean
  reverse?: boolean
}

export interface WPropsRate extends WPropsCommon {
  allowClear?: boolean
  allowHalf?: boolean
  symbol?: AddonProps
  count?: number
  tooltips?: string
}

export interface WPropsSwitch extends WPropsCommon {
  checkedValue?: string
  unCheckedValue?: string
}

export interface WPropsDatePicker extends WPropsCommon {
  allowClear?: boolean
  defaultValue?: string
  format?: string
  inputReadOnly?: boolean
  picker?: DatePickerProps['picker']
  placeholder?: string
  placement?: SelectProps['placement']
  valueFormat?: string
  submitFormat?: string
  showTime?: boolean
}

export interface WPropsTimePicker extends WPropsCommon {
  allowClear?: boolean
  defaultValue?: string
  disabled?: boolean
  format?: string
  hourStep?: number
  minuteStep?: number
  placeholder?: string
  placement?: SelectProps['placement']
  secondStep?: number
  use12Hours?: boolean
  valueFormat?: string
}

export interface WPropsDateRangePicker extends WPropsCommon {
  allowClear?: boolean
  defaultValue: [any, any]
  format?: string
  inputReadOnly?: boolean
  picker?: DatePickerProps['picker']
  placeholder: [string, string]
  placement?: SelectProps['placement']
  valueFormat?: string
  submitFormat?: string
  showTime?: boolean
}

export interface WPropsTimeRangePicker extends WPropsCommon {
  allowClear?: boolean
  defaultValue: [any, any]
  disabled?: boolean
  format?: string
  hourStep?: number
  minuteStep?: number
  placeholder: [string, string]
  placement?: SelectProps['placement']
  secondStep?: number
  use12Hours?: boolean
  valueFormat?: string
}

export interface WPropsUpload extends WPropsCommon {
  action?: string
  accept?: string[]
  type?: 'text' | 'picture' | 'picture-card'
  multiple?: boolean
  limit?: number
  sizeLimit?: number
}

export interface FormWidgetPropsMap {
  input: WPropsInput
  textarea: WPropsTextarea
  inputNumber: WPropsInputNumber
  select: WPropsSelect
  cascader: WPropsCascader
  radio: WPropsRadio
  checkbox: WPropsCheckbox
  treeSelect: WPropsTreeSelect
  slider: WPropsSlider
  rate: WPropsRate
  switch: WPropsSwitch
  datePicker: WPropsDatePicker
  timePicker: WPropsTimePicker
  dateRangePicker: WPropsDateRangePicker
  timeRangePicker: WPropsTimeRangePicker
  upload: WPropsUpload
}
