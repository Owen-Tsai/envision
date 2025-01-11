import { message } from 'ant-design-vue'
import { deleteDictType, type DictTypeVO } from '@/api/system/dict/type'

const useActions = (requestData: () => void) => {
  const { push } = useRouter()

  const onDelete = (record: DictTypeVO) => {
    deleteDictType(record.id!).then(() => {
      message.success('删除成功')
      requestData()
    })
  }

  const onShowData = (record: DictTypeVO) => {
    push(`/system/dict/data/${record.type}`)
  }

  return {
    onDelete,
    onShowData,
  }
}

export default useActions
