import { message } from 'ant-design-vue'
import { deleteFile, type FileVO } from '@/api/infra/file'

const useActions = (requestData: () => void) => {
  const onDelete = (record: FileVO) => {
    deleteFile(record.id!).then(() => {
      message.success('删除成功')
      requestData()
    })
  }

  return {
    onDelete
  }
}

export default useActions
