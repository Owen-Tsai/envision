import { message } from 'ant-design-vue'
import { deleteDictData, type DictDataItemVO } from '@/api/system/dict/data'

const useActions = (requestData: () => void) => {
  const onDelete = (record: Partial<DictDataItemVO>) => {
    deleteDictData(record.id!).then(() => {
      message.success('删除成功')
      requestData()
    })
  }

  return {
    onDelete,
  }
}

export default useActions
