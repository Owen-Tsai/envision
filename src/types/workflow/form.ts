import type { Ref } from 'vue'
import type {
  SelectProps,
  CheckboxGroupProps,
  RadioGroupProps,
  CascaderProps,
  TreeSelectProps,
  SliderProps,
  DatePickerProps,
  ButtonProps
} from 'ant-design-vue'

export type OptionSource = 'static' | 'dict' | 'api'

export type FormProps = {
  colon?: boolean
  disabled?: boolean
  labelAlign?: 'left' | 'right'
  labelCol?: string
  labelWidth?: string
  wrapperCol?: string
  wrapperWidth?: string
  layout?: 'horizontal' | 'vertical'
  // extra params
  params?: string
}

// props for `AFormItem`
export type FieldProps = {
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

type LayoutFieldProps = {
  field: {
    label?: string
    name?: string
    wrapperCol?: string
  }
}

type CommonPropsBase = {
  disabled?: boolean
  readonly?: boolean
  hide?: boolean
  required?: boolean
}

export const eventEnums = ['change', 'focus', 'blur', 'click', 'input'] as const

export type EventType = (typeof eventEnums)[number]

type EventCbkProps = {
  [x in EventType]?: string
}

type OptionTypeOf<T> = {
  type: OptionSource
  dictType?: string
  staticData?: T
  apiName?: string
}

type JsonOptionType = {
  type: Omit<OptionSource, 'dict'>
  staticData?: string
  apiName?: string
}

export type WPropsCommon = {
  field: FieldProps
  event: EventCbkProps
} & CommonPropsBase

// #region form widgets
export type WPropsInput = {
  // currently not supported due to duplicated features as `prefix`
  addonBefore?: string
  // currently not supported due to duplicated features as `suffix`
  addonAfter?: string
  allowClear?: boolean
  defaultValue?: string
  maxlength?: number
  placeholder?: string
  prefix?: string
  prefixType?: 'icon' | 'text'
  showCount?: boolean
  suffix?: string
  suffixType?: 'icon' | 'text'
} & WPropsCommon

export type WPropsInputNumber = {
  // currently not supported due to duplicated features as `prefix`
  addonBefore?: string
  // currently not supported due to duplicated features as `suffix`
  addonAfter?: string
  allowClear?: boolean
  controls?: boolean
  defaultValue?: string
  max?: number
  min?: number
  placeholder?: string
  precision?: number
  prefix?: string
  prefixType?: 'icon' | 'text'
  step?: number
} & WPropsCommon

export type WPropsSelect = {
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
} & WPropsCommon

export type WPropsCheckbox = {
  defaultValue?: string[]
  options: OptionTypeOf<CheckboxGroupProps['options']>
} & WPropsCommon

export type WPropsRadio = {
  defaultValue?: string
  optionType?: 'button' | 'solid-button' | 'default'
  options: OptionTypeOf<RadioGroupProps['options']>
} & WPropsCommon

export type WPropsCascader = {
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
} & WPropsCommon

export type WPropsSlider = {
  defaultValue?: SliderProps['defaultValue']
  dots?: boolean
  marks?: string
  max?: number
  min?: number
  range?: boolean
  reverse?: boolean
  step?: SliderProps['step']
  disableStep?: boolean
  tooltipPlacement?: SliderProps['tooltipPlacement']
  hideTooltip?: boolean
} & WPropsCommon

export type WPropsRate = {
  allowClear?: boolean
  allowHalf?: boolean
  character?: string
  characterType?: 'icon' | 'text'
  count?: number
  tooltips?: string
} & WPropsCommon

export type WPropsSwitch = {
  checkedValue?: string
  unCheckedValue?: string
} & WPropsCommon

export type WPropsDatePicker = {
  allowClear?: boolean
  defaultValue?: string
  format?: string
  inputReadOnly?: boolean
  picker?: DatePickerProps['picker']
  placeholder?: string
  placement?: SelectProps['placement']
  valueFormat?: string
  showTime?: boolean
} & WPropsCommon

export type WPropsDateRangePicker = {
  allowClear?: boolean
  defaultValue: [any, any]
  format?: string
  inputReadOnly?: boolean
  picker?: DatePickerProps['picker']
  placeholder: [string, string]
  placement?: SelectProps['placement']
  valueFormat?: string
  showTime?: boolean
} & WPropsCommon

export type WPropsTextarea = {
  allowClear?: boolean
  autoResize?: boolean
  defaultValue?: string
  showCount?: boolean
  maxlength?: number
  placeholder?: string
  minRows?: number
  maxRows?: number
  rows?: number
} & WPropsCommon

export type WPropsTimePicker = {
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
} & WPropsCommon

export type WPropsTimeRangePicker = {
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
} & WPropsCommon

export type WPropsTreeSelect = {
  allowClear?: boolean
  defaultValue?: string | string[]
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
  treeData: JsonOptionType
  simpleMode?: boolean
  showLine?: boolean
} & WPropsCommon

export type WPropsUpload = {
  accept?: string
  action?: string
  beforeUpload?: string
  data?: string
  headers?: string
  maxCount?: number
  maxSize?: number
  multiple?: boolean
  folder?: boolean
  name?: string
  withCredentials?: boolean
} & WPropsCommon

export type WPropsImage = {
  accept?: string
  type?: 'list' | 'grid' | 'inline'
  action?: string
  beforeUpload?: string
  data?: string
  headers?: string
  maxCount?: number
  maxSize?: number
  method?: string
  name?: string
  withCredentials?: boolean
} & WPropsCommon
// #endregion

// #region layout widgets
export type WPropsGridCol = {
  span: number
  widgets: Widget[]
}

export type WPropsTabsPane = {
  title: string
  widgets: Widget[]
}

export type WPropsStep = {
  title: string
  desc?: string
  widgets: Widget[]
}

export type WPropsSubFormEntry = {
  widgets: Widget[]
}

export type WPropsTableForm = {
  title?: string
  width?: string
  widgets: Widget[]
}

export type WPropsGrid = {
  align?: 'top' | 'middle' | 'bottom' | 'stretch'
  justify?: 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
  gutter?: number
  wrap?: boolean
  children: WPropsGridCol[]
} & LayoutFieldProps

export type WPropsTabs = {
  centered?: boolean
  destroyInactivePanes?: boolean
  size?: 'large' | 'middle' | 'small'
  type?: 'line' | 'card'
  children: WPropsTabsPane[]
} & LayoutFieldProps

export type WPropsSteps = {
  size?: 'default' | 'small'
  type?: 'default' | 'navigation' | 'dot'
  children: WPropsStep[]
  model: {
    current: number
  }
} & LayoutFieldProps

export type WPropsSubForm = {
  max?: number
  children: WPropsSubFormEntry[]
} & LayoutFieldProps

export type WPropsTableColumn = {
  align?: 'left' | 'right' | 'center'
  title?: string
  width?: string
  key?: string
  formatter?: string
}

export type WPropsTablePagination = {
  pageSize?: number
  lite?: boolean // showLessItems
  small?: boolean // size="small"
}

export type WPropsDataTable = {
  columns?: WPropsTableColumn[]
  pagination: WPropsTablePagination
  children: WPropsTableForm[]
  model: {
    mode: 'table' | 'form'
  }
} & LayoutFieldProps
// #endregion

// #region special widgets
export type WPropsButton = {
  type?: ButtonProps['type']
  label?: string
  block?: boolean
  danger?: boolean
  href?: string
  target?: string
  icon?: string
  loading?: boolean
  shape?: ButtonProps['shape']
} & Pick<WPropsCommon, 'event' | 'hide' | 'disabled' | 'field'>
// #endregion

// #region widget maps

type FormWidgetPropsMap = {
  input: WPropsInput
  textarea: WPropsTextarea
  inputNumber: WPropsInputNumber
  select: WPropsSelect
  checkbox: WPropsCheckbox
  radio: WPropsRadio
  cascader: WPropsCascader
  slider: WPropsSlider
  rate: WPropsRate
  switch: WPropsSwitch
  datePicker: WPropsDatePicker
  dateRangePicker: WPropsDateRangePicker
  timePicker: WPropsTimePicker
  timeRangePicker: WPropsTimeRangePicker
  treeSelect: WPropsTreeSelect
  upload: WPropsUpload
  image: WPropsImage
}

type LayoutWidgetPropsMap = {
  grid: WPropsGrid
  tabs: WPropsTabs
  steps: WPropsSteps
  subForm: WPropsSubForm
  dataTable: WPropsDataTable
}

type SpecialWidgetPropsMap = {
  button: WPropsButton
}

type WidgetPropsMap = FormWidgetPropsMap & LayoutWidgetPropsMap & SpecialWidgetPropsMap

type ConfigOf<T extends keyof WidgetPropsMap> = {
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

export type WidgetConfigMap = {
  [x in WidgetType]: ConfigOf<x>
}

export type Widget = WidgetConfigMap[keyof WidgetConfigMap]
export type FormWidget = WidgetConfigMap[keyof FormWidgetPropsMap]
export type LayoutWidget = WidgetConfigMap[keyof LayoutWidgetPropsMap]
export type SpecialWidget = WidgetConfigMap[keyof SpecialWidgetPropsMap]
// #endregion

// #region schema&injection

export type APIConfig = {
  name: string
  url: string
  method: 'get' | 'post' | 'delete' | 'put'
  params?: string
}

export type FunctionConfig = {
  name: string
  body?: string
}

export type FormSchema = {
  widgets: Widget[]
  functions: Record<string, FunctionConfig>
  remoteAPIs: Record<string, APIConfig>
} & FormProps

export const injectionKey = Symbol('efk')
export const formDataKey = Symbol('formData')
export const parentFieldKey = Symbol('parentField')
export const debugKey = Symbol('debug')

export type FormCreatorCtx = {
  schema: FormSchema
  debug?: boolean
  selectedWidget: Ref<Widget | undefined>
  deleteWidget: (uid: string) => void
  duplicateWidget: (config: Widget) => void
}

export type FormDataCtx = {
  formData: Ref<Record<string, any>>
}

export type ParentFormPropType = {
  field: string
  index: number
}
