import { set } from 'lodash-es'
import useRequest from '@/hooks/use-request'
import { getEchoData, getProcessInstance } from '@/api/business/audit'
import type { PlanVO } from '@/api/application/plan'
import type { AppSchema } from '@/types/fux-core'
import type FormRenderer from '@/components/fux-core/form-renderer/index.vue'
import type AttachClass from '@/components/attach/attach-class/index.vue'

/**
 * 负责数据的载入和转换
 */
const useData = (
  rendererRef: Ref<InstanceType<typeof FormRenderer> | null>,
  attachListRef: Ref<InstanceType<typeof AttachClass> | null>,
) => {
  const { params, query } = useRoute()

  const appId = params.appId as string
  const applyId = query.applyId as string
  const taskId = query.taskId as string
  const processId = query.processInstanceId as string

  // 申报计划
  const planInfo = ref<PlanVO>({})
  // schema
  const appSchema = ref<AppSchema>()
  // 用户填写的申报数据
  const formData = ref<Record<string, any>>({})

  const loadData = async () => {
    const res = await getEchoData(appId, applyId)
    const { plan, data, schema } = res

    planInfo.value = plan
    appSchema.value = JSON.parse(schema)
    formData.value = serializeFormData(data)

    // fill the formData
    // refresh attachList
    nextTick(() => {
      rendererRef.value?.setFormData(formData.value)
      attachListRef.value?.refreshList()
    })
  }

  const serializeFormData = (raw: Record<string, any>): Record<string, any> => {
    const ret: Record<string, any> = {}
    const keys = Object.keys(raw)

    keys.forEach((key) => {
      // 主表
      if (raw[key] && !Array.isArray(raw[key])) {
        const fields = Object.keys(raw[key])
        if (appSchema.value?.info.paginated) {
          const findIndex = appSchema.value?.info.tables.findIndex((table) => table.name == key)
          fields.forEach((field) => {
            set(ret, `${findIndex}.${key}:${field}`, raw[key][field])
          })
        } else {
          fields.forEach((field) => {
            ret[`${key}:${field}`] = raw[key][field]
          })
        }
      }
    })

    return ret
  }

  loadData()

  // 申报基本信息
  const { data: basicInfo } = useRequest(() => getProcessInstance(processId, taskId), {
    immediate: true,
  })

  return {
    planInfo,
    basicInfo,
    appSchema,
    formData,
    appId,
    applyId,
    taskId,
  }
}

export default useData
