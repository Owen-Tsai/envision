import { message } from 'ant-design-vue'
import { deleteDictType, type DictTypeVO } from '@/api/system/dict/type'

const useActions = (requestData: () => void) => {
  const entry = ref<DictTypeVO | undefined>()
  const visible = ref(false)

  const { push } = useRouter()

  const onEdit = (record?: DictTypeVO) => {
    entry.value = record
    visible.value = true
  }

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
    entry,
    visible,
    onEdit,
    onDelete,
    onShowData,
  }
}

export default useActions
