export interface FormProps {
  colon?: boolean
  disabled?: boolean
  labelAlign?: 'left' | 'right'
  labelCol?: string
  labelWidth?: string
  wrapperCol?: string
  wrapperWidth?: string
  layout?: 'horizontal' | 'vertical'
}

export interface APIConfig {
  name: string
  dataIndex: string
  url: string
  method: 'get' | 'post' | 'delete' | 'put'
  params?: string
}

export interface FunctionConfig {
  name: string
  body?: string
}
