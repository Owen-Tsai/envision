import { getEchoData } from '@/api/business/audit'
import { set } from 'lodash-es'
import useTabsStore from '@/stores/tabs'
import { useAppParamsProvider } from './use-context'
import type { AppSchema } from '@/types/fux-core'

const useDataInit = () => {
  const { query } = useRoute()
  const { appId, applyId } = query
  const { setTabTitle } = useTabsStore()

  if (!appId || !applyId) {
    throw new Error('[fusionx-core/renderer] 缺少路由参数`appId`或`applyId`')
  }

  const planId = ref<string>()
  const appSchema = ref<AppSchema>()
  const multiStepMode = ref<boolean>(false)

  /**
   * 数据是否回显完成
   */
  const dataLoaded = ref(false)

  /**
   * 获取数据进行回显
   */
  const getDataToDisplay = async () => {
    const res = await getEchoData(appId as string, applyId as string)
    const { data, plan, schema } = res

    planId.value = plan.id!
    appSchema.value = JSON.parse(schema)

    const tabTitle = plan.appName || plan.item
    if (tabTitle) {
      setTabTitle(tabTitle)
    }

    serializeEchoedData(data)

    useAppParamsProvider({ applyId })

    dataLoaded.value = true
  }

  /**
   * 处理回显数据以适配 Schema 的字段名称
   * @param data 服务器传回的回显数据
   */
  const serializeEchoedData = (data: Record<string, any>) => {
    const ret: Record<string, any> = {}

    Object.keys(data).forEach((key) => {
      if (!Array.isArray(data[key])) {
        const fieldKeys = Object.keys(data[key])

        if (appSchema.value?.info.paginated) {
          multiStepMode.value = true
          const stepPrefix = appSchema.value.info.tables.findIndex((table) => table.name === key)
          fieldKeys.forEach((field) => {
            set(ret, `${stepPrefix}.${key}:${field}`, data[key][field])
          })
        } else {
          // single step mode
          fieldKeys.forEach((field) => {
            set(ret, `${key}:${field}`, data[key][field])
          })
        }
      }
    })
  }

  return {
    getDataToDisplay,
    appSchema,
    planId,
    dataLoaded,
    multiStepMode,
  }
}

export default useDataInit
