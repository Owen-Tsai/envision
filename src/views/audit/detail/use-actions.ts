import { Modal, message, notification, type FormInstance } from 'ant-design-vue'
import { returnTask, returnTaskToStart, approveTask, rejectTask } from '@/api/business/audit'
import logger from '@/utils/logger'
import useTabsStore from '@/stores/tabs'

export const KEY_RETURN_TO_STARTER = 'RETURN_TO_STARTER'

/**
 * 负责审核操作，如退回、通过等
 */
const useActions = (auditFormRef: Ref<FormInstance | null>, fields: Record<string, any>) => {
  const { query } = useRoute()
  const { removeAndOpenTab } = useTabsStore()

  const auditFormData = ref({
    result: '1',
    reason: '',
    // 退回到的任务节点的 key
    rtnToTaskKey: '',
  })

  const taskId = query.taskId as string
  const applyId = query.applyId as string
  const appId = query.appId as string
  const processId = query.processInstanceId as string
  const taskKey = query.taskDefKey as string

  /**
   * 退回到发起人
   */
  const returnToStarter = async () => {
    try {
      // 校验审核表单
      await auditFormRef.value?.validateFields()
      const metaData = {
        id: applyId,
        reason: auditFormData.value.reason,
        fields,
      }

      const modal = Modal.confirm({
        title: '退回到发起人',
        content: '确定退回到发起人吗？退回到发起人时，发起人需要重新提交并完成全部审核流程。',
        async onOk() {
          try {
            await returnTaskToStart(metaData)
            modal.destroy()
            notification.success({
              message: '审批完成',
              description: '已退回至发起人',
            })
            removeAndOpenTab(`/business/${appId}/audit?taskDefKey=${taskKey}`)
          } catch (e) {
            message.error('退回失败')
            logger.error(import.meta.url, '退回失败', e)
          }
        },
      })
    } catch (e) {
      // do nothing at the moment
    }
  }

  /**
   * 退回到某审核流程
   */
  const returnTo = async () => {
    try {
      // 校验审核表单
      await auditFormRef.value?.validateFields()
      const metaData = {
        id: applyId,
        targetTaskDefinitionKey: auditFormData.value.rtnToTaskKey,
        reason: auditFormData.value.reason,
        fields,
      }

      const modal = Modal.confirm({
        title: '退回到指定节点',
        content: '退回到指定节点时，该申报将由指定节点审批人重新审核。',
        async onOk() {
          try {
            await returnTask(metaData)
            modal.destroy()
            notification.success({
              message: '审批完成',
              description: '已退回至指定节点',
            })
            removeAndOpenTab(`/business/${appId}/audit?taskDefKey=${taskKey}`)
          } catch (e) {
            message.error('退回失败')
            logger.error(import.meta.url, '退回失败', e)
          }
        },
      })
    } catch (e) {}
  }

  /**
   * 通过审核
   */
  const passAudit = async () => {
    try {
      // 校验审核表单
      await auditFormRef.value?.validateFields()
      const metaData = {
        id: taskId,
        reason: auditFormData.value.reason,
        fields,
      }

      const modal = Modal.confirm({
        title: '通过审核',
        content: '确定通过审核吗？通过审核后，将进入下一环节（如有）或直接完成。',
        async onOk() {
          try {
            await approveTask(metaData)
            modal.destroy()
            notification.success({
              message: '审批完成',
              description: '已通过审核',
            })
          } catch (e) {
            message.error('审批失败')
            logger.error(import.meta.url, '审批失败', e)
          }
        },
      })
    } catch (e) {}
  }

  /**
   * 不通过审核
   */
  const rejectAudit = async () => {
    try {
      // 校验审核表单
      await auditFormRef.value?.validateFields()
      const metaData = {
        id: taskId,
        reason: auditFormData.value.reason,
        fields,
      }

      const modal = Modal.confirm({
        title: '不通过审核',
        content: '确定不通过审核吗？不通过审核后，将进入下一环节（如有）或直接完成。',
        async onOk() {
          try {
            await rejectTask(metaData)
            modal.destroy()
            notification.success({
              message: '审批完成',
              description: '已不通过审核',
            })
          } catch (e) {
            message.error('审批失败')
            logger.error(import.meta.url, '审批失败', e)
          }
        },
      })
    } catch (e) {}
  }

  /**
   * 审核统一方法
   * @param result 审核结论 - 通过 1、不通过 2、退回 3
   */
  const auditOperation = () => {
    switch (auditFormData.value.result) {
      case '1':
        passAudit()
        break
      case '2':
        rejectAudit()
        break
      case '3':
        if (auditFormData.value.rtnToTaskKey === KEY_RETURN_TO_STARTER) {
          returnToStarter()
        } else {
          returnTo()
        }
        break
    }
  }

  return {
    auditFormData,
    auditOperation,
  }
}

export default useActions
