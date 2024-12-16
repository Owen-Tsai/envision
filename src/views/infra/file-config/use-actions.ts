import { ref } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { deleteConfig, testConfig, type FileConfigVO } from '@/api/infra/file/config'

const useActions = (requestData: () => void) => {
  const entry = ref<FileConfigVO | undefined>()
  const visible = ref(false)

  const onEdit = (record?: FileConfigVO) => {
    entry.value = record
    visible.value = true
  }

  const onDelete = (record: FileConfigVO) => {
    deleteConfig(record.id!).then(() => {
      message.success('删除成功')
      requestData()
    })
  }

  const onTest = (record: FileConfigVO) => {
    testConfig(record.id!).then((res) => {
      Modal.success({
        title: '测试通过',
        content: `文件上传测试成功，预览地址 ${res}`,
      })
    })
  }

  return {
    entry,
    visible,
    onEdit,
    onDelete,
    onTest,
  }
}

export default useActions
