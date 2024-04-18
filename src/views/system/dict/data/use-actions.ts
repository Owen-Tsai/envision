import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { deleteDictData, type DictDataItemVO } from '@/api/system/dict/data'

const useActions = (requestData: () => void) => {
  const entry = ref<DictDataItemVO | undefined>()
  const visible = ref(false)

  const onEdit = (record?: DictDataItemVO) => {
    entry.value = record
    visible.value = true
  }

  const onDelete = (record: DictDataItemVO) => {
    deleteDictData(record.id!).then(() => {
      message.success('删除成功')
      requestData()
    })
  }

  return {
    entry,
    visible,
    onEdit,
    onDelete
  }
}

export default useActions
