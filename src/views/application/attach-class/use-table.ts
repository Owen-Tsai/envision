import { ref, computed, type Ref } from 'vue'
import dayjs from 'dayjs'
import useRequest from '@/hooks/use-request'
import {
  getAttachClassList,
  type ListQueryParams,
  type AttachClassVO,
} from '@/api/application/attach-class'
import type { FormInstance, TableProps } from 'ant-design-vue'
import type { TablePaginationConfig } from 'ant-design-vue/es/table/interface'

export const columns: TableProps['columns'] = [
  { title: '附件分类名称', dataIndex: 'name', key: 'name', ellipsis: true },
  { title: '允许上传类型', dataIndex: 'allowFileType', key: 'allowFileType' },
  { title: '最大文件大小', dataIndex: 'maxFileSize', key: 'maxFileSize' },
  { title: '是否必传', dataIndex: 'ismust', key: 'ismust' },
  { title: '附件分类代码', dataIndex: 'modeName', key: 'modeName' },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  { title: '操作', key: 'actions', width: 240 },
]

export const useTable = (formRef: Ref<FormInstance | undefined>) => {
  const queryParams = ref<ListQueryParams>({})

  const { data, execute, pending } = useRequest(
    () =>
      getAttachClassList({
        ...queryParams.value,
      }),
    {
      immediate: true,
    },
  )

  const pagination = computed<TablePaginationConfig>(() => ({
    pageSize: queryParams.value.pageSize,
    current: queryParams.value.pageNo,
    total: data.value?.total,
    showQuickJumper: true,
    showSizeChanger: true,
    showTotal(total, range) {
      return `第 ${range[0]}~${range[1]} 项 / 共 ${total} 项`
    },
  }))

  const onFilter = () => {
    queryParams.value.pageNo = 1
    execute()
  }

  const onFilterReset = () => {
    formRef.value?.resetFields()
    queryParams.value.pageNo = 1
    execute()
  }

  const onChange = ({ current, pageSize }: TablePaginationConfig) => {
    queryParams.value.pageNo = current
    queryParams.value.pageSize = pageSize

    execute()
  }

  return {
    data,
    execute,
    pending,
    queryParams,
    onChange,
    pagination,
    onFilter,
    onFilterReset,
  }
}
