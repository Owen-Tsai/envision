import { message } from 'ant-design-vue'
import { deleteChannel, type ChannelVO } from '@/api/system/sms/channel'

const useActions = (requestData: () => void) => {
  const entry = ref<ChannelVO | undefined>()
  const visible = ref(false)

  const onEdit = (record?: ChannelVO) => {
    entry.value = record
    visible.value = true
  }

  const onDelete = (record: ChannelVO) => {
    deleteChannel(record.id!).then(() => {
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
