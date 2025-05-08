import { message, Modal } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { deleteApplication, setPublished, type ApplicationVO } from '@/api/application'

const useActions = (requestData: () => void) => {
  const entry = ref<ApplicationVO | undefined>()
  const visible = reactive({
    editForm: false,
    auditConfigForm: false,
  })

  // const { push } = useRouter()

  const onEdit = (record?: ApplicationVO) => {
    entry.value = record
    visible.editForm = true
  }

  const onDelete = (record: ApplicationVO) => {
    Modal.confirm({
      title: '删除应用',
      content:
        '该操作无法恢复，建议只在确定不再使用该应用且当前不存在用户申报的情况下进行删除。确定要删除该应用吗？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        deleteApplication(record.id!).then(() => {
          message.success('删除成功')
          requestData()
        })
      },
    })
  }

  const toDesignPage = (record: ApplicationVO) => {
    window.open(`${window.origin}/workflow/${record.id}`)
  }

  const onSetPublished = (record: ApplicationVO, published: boolean) => {
    setPublished(record.id!, published).then(() => {
      message.success('操作成功')
      requestData()
    })
  }

  const onAIAuditConfig = () => {
    visible.auditConfigForm = true
  }

  return {
    entry,
    visible,
    onEdit,
    onDelete,
    onSetPublished,
    toDesignPage,
    onAIAuditConfig,
  }
}

export default useActions
