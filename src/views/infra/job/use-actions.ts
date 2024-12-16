import { ref, reactive } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { deleteJob, runJob, updateJobStatus, type JobVO } from '@/api/infra/job'

const jobStatusEnums = {
  init: 0,
  normal: 1,
  stop: 2,
}

const useActions = (requestData: () => void) => {
  const entry = ref<JobVO | undefined>()
  const visible = reactive({
    form: false,
    detail: false,
  })

  const onEdit = (record?: JobVO) => {
    entry.value = record
    visible.form = true
  }

  const onDelete = (record: JobVO) => {
    deleteJob(record.id!).then(() => {
      message.success('删除成功')
      requestData()
    })
  }

  const onTriggerJob = (record: JobVO) => {
    Modal.confirm({
      title: '执行任务',
      content: `确定执行 ${record.name} 一次吗？`,
      onOk() {
        runJob(record.id!).then(() => {
          message.success('执行成功')
        })
      },
    })
  }

  const onShowDetail = (record: JobVO) => {
    entry.value = record
    visible.detail = true
  }

  const onShowLog = (record: JobVO) => {}

  const onStatusChange = (record: JobVO) => {
    const status =
      record.status === jobStatusEnums.normal ? jobStatusEnums.stop : jobStatusEnums.normal
    updateJobStatus(record.id!, status).then(() => {
      message.success('状态修改成功')
      requestData()
    })
  }

  return {
    entry,
    visible,
    onEdit,
    onDelete,
    onShowDetail,
    onShowLog,
    onStatusChange,
    onTriggerJob,
  }
}

export default useActions
