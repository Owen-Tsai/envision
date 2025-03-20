import { message } from 'ant-design-vue'
import { deleteInformation, type InformationVO } from '@/api/information'

const useActions = (requestData: () => void) => {
  const onDelete = (record: InformationVO) => {
    deleteInformation(record.id!).then(() => {
      message.success('删除成功')
      requestData()
    })
  }

  return {
    onDelete,
  }
}

export default useActions
