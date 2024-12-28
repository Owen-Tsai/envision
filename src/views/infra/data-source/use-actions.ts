import { message } from 'ant-design-vue'
import { deleteDataSource, type DataSourceVO } from '@/api/infra/data-source'

const useActions = (requestData: () => void) => {
  const entry = ref<DataSourceVO | undefined>()
  const visible = ref(false)

  const onEdit = (record?: DataSourceVO) => {
    entry.value = record
    visible.value = true
  }

  const onDelete = (record: DataSourceVO) => {
    deleteDataSource(record.id!).then(() => {
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
