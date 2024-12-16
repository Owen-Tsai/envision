import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { deleteConfig, type SysConfigVO } from '@/api/infra/sys-config'

const useActions = (requestData: () => void) => {
  const entry = ref<SysConfigVO | undefined>()
  const visible = ref(false)

  const onEdit = (record?: SysConfigVO) => {
    entry.value = record
    visible.value = true
  }

  const onDelete = (record: SysConfigVO) => {
    deleteConfig(record.id!).then(() => {
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
