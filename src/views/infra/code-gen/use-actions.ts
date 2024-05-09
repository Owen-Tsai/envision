import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { deleteCodeGenConfig, syncTable, type ConfigVO } from '@/api/infra/code-gen'

const useActions = (requestData: () => void) => {
  const entry = ref<ConfigVO | undefined>()
  const visible = reactive({
    import: false,
    preview: false
  })

  const { push } = useRouter()

  const onEdit = (record?: ConfigVO) => {
    push(`/infra/code-gen/edit?id=${record?.id}`)
  }

  const onDelete = (record: ConfigVO) => {
    deleteCodeGenConfig(record.id!).then(() => {
      message.success('删除成功')
      requestData()
    })
  }

  const onPreview = (record: ConfigVO) => {
    entry.value = record
    visible.preview = true
  }

  const onImport = () => {
    visible.import = true
  }

  const onDownload = (record: ConfigVO) => {
    // todo
  }

  const onSync = (record: ConfigVO) => {
    syncTable(record.id!).then(() => {
      message.success('同步成功')
      requestData()
    })
  }

  return {
    entry,
    visible,
    onEdit,
    onDelete,
    onDownload,
    onImport,
    onPreview,
    onSync
  }
}

export default useActions
