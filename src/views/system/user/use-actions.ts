import { Modal, message } from 'ant-design-vue'
import { deleteUser, updateUserStatus, type UserVO } from '@/api/system/user'

const useActions = (requestData: () => void) => {
  const onDelete = (record: UserVO) => {
    Modal.confirm({
      title: '删除用户',
      content: '此操作不可撤销，确定要删除该用户吗？',
      onOk() {
        deleteUser(record.id!).then(() => {
          requestData()
        })
      },
    })
  }

  const onSetStatus = async (record: UserVO, status: number) => {
    try {
      await updateUserStatus(record.id!, status)
      message.success('操作成功')
    } finally {
      requestData()
    }
  }

  return {
    onDelete,
    onSetStatus,
  }
}

export default useActions
