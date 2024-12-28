import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { deletePlan, type PlanVO } from '@/api/application/plan'

const useActions = (requestData: () => void) => {
  const entry = ref<PlanVO | undefined>()
  const visible = ref(false)

  const onEdit = (record?: PlanVO) => {
    entry.value = record
    visible.value = true
  }

  const onDelete = (record: PlanVO) => {
    deletePlan(record.id!).then(() => {
      message.success('删除成功')
      requestData()
    })
  }

  const toDesignPage = (record: PlanVO) => {
    window.open(`${window.origin}/workflow/${record.appId}`)
  }

  return {
    entry,
    visible,
    onEdit,
    onDelete,
    toDesignPage,
  }
}

export default useActions
