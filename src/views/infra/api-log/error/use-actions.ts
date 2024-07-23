import { ref } from 'vue'
import { setProcessStatus, exportLog, type ErrorLogVO } from '@/api/infra/api-log/error-log'

const useActions = (requestData: () => void) => {
  const entry = ref<ErrorLogVO>()
  const visible = ref(false)

  const onCheckDetail = (row: ErrorLogVO) => {
    entry.value = row
    visible.value = true
  }

  const onSetStatus = (id: number, status: number) => {
    setProcessStatus(id, status).then(requestData)
  }

  const onExport = () => {
    exportLog()
  }

  return {
    entry,
    visible,
    onCheckDetail,
    onSetStatus,
    onExport
  }
}

export default useActions
