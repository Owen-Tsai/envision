import initWidgetConfig from './initial-widget-config'

// #region options
// static options used in setters

export const addonOpts = [
  { label: '文本', value: 'text' },
  { label: '图标', value: 'icon' },
]
export const optionSourceOpts = [
  { label: '静态', value: 'static' },
  { label: '字典', value: 'dict' },
  { label: '表达式', value: 'expression' },
]
export const popoverPlacementOpts = [
  { label: '从左上弹出', value: 'topLeft' },
  { label: '从右上弹出', value: 'topRight' },
  { label: '从左下弹出', value: 'bottomLeft' },
  { label: '从右下弹出', value: 'bottomRight' },
]
export const labelLayoutOpts = [
  { label: '标签与组件水平布局', value: 'horizontal' },
  { label: '标签与组件上下布局', value: 'vertical' },
]
export const labelAlignOpts = [
  { label: '居左', value: 'left' },
  { label: '居右', value: 'right' },
]
export const validationTriggerOpts = [
  { value: 'blur' },
  { value: 'focus' },
  { value: 'change' },
  { value: 'input' },
]
export const datePickerModeOpts = [
  { label: '日期选择', value: 'date' },
  { label: '周选择', value: 'week' },
  { label: '月选择', value: 'month' },
  { label: '季度选择', value: 'quarter' },
  { label: '年选择', value: 'year' },
]

export const widgetTypeOpts = Object.keys(initWidgetConfig)
  .map((key) => {
    return {
      label: initWidgetConfig[key].name,
      value: key,
      class: initWidgetConfig[key].class,
    }
  })
  .filter((item) => item.class === 'form')

// #endregion

// #region symbols
// used as provide/inject keys

/**
 * form data injection key, used in renderer
 */
export const FORM_DATA_KEY = Symbol('formData')
/**
 * form designer injection key
 */
export const DESIGNER_KEY = Symbol('designer')
/**
 * form renderer injection key
 */
export const RENDERER_KEY = Symbol('renderer')

/**
 * workflow designer key
 */
export const WORKFLOW_KEY = Symbol('workflow')
/**
 * model injection key
 * used in widgets like dataTable, which has nested form element
 */
export const MODEL_KEY = Symbol('model')

// #endregion

// #region enums
export enum NodeTaskStrategy {
  ROLE = 10,
  ORG = 30,
}
// #endregion
