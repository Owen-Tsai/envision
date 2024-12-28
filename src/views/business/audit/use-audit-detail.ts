import {
  getAuditProcessDetail,
  getTaskReturnOptions,
  getProcessInstance,
} from '@/api/business/audit'
import useRequest from '@/hooks/use-request'
import type { SelectProps } from 'ant-design-vue'

const useAudit = () => {
  const { query } = useRoute()
  const { processInstanceId, taskDefKey, taskId } = query

  if (!processInstanceId) {
    throw new Error('缺少路由参数`processInstanceId`')
  }

  const processInfo = ref<any>({})
  const taskReturnOpts = ref<SelectProps['options']>([])

  const { data, pending } = useRequest(() => getAuditProcessDetail(processInstanceId as string), {
    immediate: true,
  })

  // is in audit mode instead of archive
  if (taskDefKey !== 'All') {
    getTaskReturnOptions(taskId as string).then((res) => {
      taskReturnOpts.value = res
    })

    getProcessInstance(processInstanceId as string).then((res) => {
      processInfo.value = res
      // processInfo.value.title = data.name
      // processInfo.value.name = data.starter
    })
  }

  return {
    auditDetail: data,
    auditDetailLoading: pending,
    processInfo,
    taskReturnOpts,
  }
}

export default useAudit
