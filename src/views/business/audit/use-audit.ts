import {
  approveTask,
  backStartUserTask,
  backTask,
  getAuditProcessDetail,
  getBackOptions,
  getEchoData,
  getProcessInstance,
  rejectTask,
  type AuditProcessDetailsListType,
} from '@/api/business/audit'

const useAudit = () => {
  const formData = reactive<{
    id?: string
    comment?: string
    /** 需要随审核一并提交的表单数据 */
    extraData?: Record<string, any>
  }>({})

  const returnTaskToStarter = () => {}
}
