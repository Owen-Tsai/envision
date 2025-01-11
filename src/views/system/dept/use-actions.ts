import { message } from 'ant-design-vue'
import { deleteDept, type DeptVO } from '@/api/system/dept'

const useActions = (requestData: () => void) => {
  const onDelete = (record: DeptVO) => {
    deleteDept(record.id!).then(() => {
      message.success('删除成功')
      requestData()
    })
  }

  return { onDelete }
}

export default useActions
