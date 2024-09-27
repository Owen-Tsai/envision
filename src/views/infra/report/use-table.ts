import { ref, computed, type Ref } from 'vue'
import dayjs from 'dayjs'
import useRequest from '@/hooks/use-request'
import { getReportList, type ListQueryParams, type ReportVO } from '@/api/infra/report'
import type { FormInstance, TableProps } from 'ant-design-vue'
import type { TablePaginationConfig } from 'ant-design-vue/es/table/interface'

export const columns: TableProps['columns'] = [
  { title: '报表名称', dataIndex: 'name', key: 'name' },
  { title: '报表编号', dataIndex: 'code', key: 'code' },
  { title: '创建人', dataIndex: 'creator', key: 'creator' },
  { title: '上次编辑者', dataIndex: 'updater', key: 'updater' },
  {
    title: '上次编辑时间',
    minWidth: 120,
    dataIndex: 'updateTime',
    key: 'updateTime',
    sortDirections: ['ascend', 'descend'],
    sorter: (a: ReportVO, b: ReportVO) => {
      return dayjs(a.updateTime).isSameOrBefore(b.updateTime) ? 1 : -1
    }
  },
  { title: '操作', width: 220 }
]

export const useTable = (formRef: Ref<FormInstance | undefined>) => {
  const queryParams = ref<ListQueryParams>({})

  const { data, execute, pending } = useRequest(
    () =>
      getReportList({
        ...queryParams.value
      }),
    {
      immediate: true
    }
  )

  const pagination = computed<TablePaginationConfig>(() => ({
    pageSize: queryParams.value.pageSize,
    current: queryParams.value.pageNo,
    total: data.value?.total,
    showQuickJumper: true,
    showSizeChanger: true,
    showTotal(total, range) {
      return `第 ${range[0]}~${range[1]} 项 / 共 ${total} 项`
    }
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
    onFilterReset
  }
}
