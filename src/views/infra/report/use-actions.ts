import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { deleteReport, type ReportVO } from '@/api/infra/report'

const useActions = (requestData: () => void) => {
  const url = import.meta.env.VITE_UREPORT_URL
  const entry = ref<ReportVO | undefined>()
  const visible = ref(false)

  const { push } = useRouter()

  const onEdit = (record?: ReportVO) => {
    entry.value = record
    visible.value = true
  }

  const onDelete = (record: ReportVO) => {
    deleteReport(record.id!).then(() => {
      message.success('删除成功')
      requestData()
    })
  }

  const toDesignPage = (record?: ReportVO) => {
    const target = record ? `${url}/designer?_u=${record.name}` : `${url}/designer`
    window.open(target, '_blank')
  }

  const toPreviewPage = (record: ReportVO) => {
    push(`${url}/preview?_u=${record.name}`)
  }

  return {
    entry,
    visible,
    onEdit,
    onDelete,
    toDesignPage,
    toPreviewPage
  }
}

export default useActions
