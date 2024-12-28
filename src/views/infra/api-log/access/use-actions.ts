import { ref } from 'vue'
import { exportLog, type AccessLogVO } from '@/api/infra/api-log/access-log'

const useActions = () => {
  const visible = ref(false)
  const entry = ref<AccessLogVO>()

  const onCheckDetail = (row: AccessLogVO) => {
    entry.value = row
    visible.value = true
  }

  const onExport = () => {
    exportLog()
  }

  return {
    entry,
    visible,
    onCheckDetail,
    onExport,
  }
}

export default useActions
