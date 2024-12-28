const APP_PARAMS_KEY = Symbol('app-params')

export const useAppParamsProvider = (params: Record<string, any>) => {
  provide<Record<string, any>>(APP_PARAMS_KEY, params)
}

export const useAppParamsInjection = () => {
  return inject<Record<string, any> | null>(APP_PARAMS_KEY, null)
}
