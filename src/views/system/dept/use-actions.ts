import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { deleteDept, type DeptVO } from '@/api/system/dept'

const useActions = (requestData: () => void) => {
  const entry = ref<DeptVO | undefined>()
  const visible = ref(false)

  const onEdit = (record?: DeptVO) => {
    entry.value = record
    visible.value = true
  }

  const onDelete = (record: DeptVO) => {
    deleteDept(record.id!).then(() => {
      message.success('删除成功')
      requestData()
    })
  }

  return {
    entry,
    visible,
    onEdit,
    onDelete,
  }
}

export default useActions
