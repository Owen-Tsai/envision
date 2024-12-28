import dayjs from 'dayjs'
import useRequest from '@/hooks/use-request'
import { getDictDataList, type ListQueryParams, type DictDataItemVO } from '@/api/system/dict/data'
import type { FormInstance, TableProps } from 'ant-design-vue'
import type { TablePaginationConfig } from 'ant-design-vue/es/table/interface'

export const columns: TableProps['columns'] = [
  { title: '字典编码', width: 90, dataIndex: 'id', key: 'id' },
  { title: '字典标签', dataIndex: 'label', key: 'label' },
  { title: '字典键值', width: 90, dataIndex: 'value', key: 'value' },
  { title: '字典排序', width: 90, dataIndex: 'sort', key: 'sort' },
  { title: '字典状态', width: 90, dataIndex: 'status', key: 'status' },
  { title: '颜色类型', width: 90, dataIndex: 'colorType', key: 'colorType' },
  { title: 'CSS Class', dataIndex: 'cssClass', key: 'cssClass' },
  { title: '备注', width: 140, dataIndex: 'remark', key: 'remark' },
  {
    title: '创建时间',
    width: 120,
    dataIndex: 'createTime',
    key: 'createTime',
    sortDirections: ['ascend', 'descend'],
    sorter: (a: DictDataItemVO, b: DictDataItemVO) => {
      return dayjs(a.createTime).isSameOrBefore(b.createTime) ? 1 : -1
    },
  },
  { title: '操作', width: 140 },
]

export const useTable = (formRef: Ref<FormInstance | undefined>) => {
  const queryParams = ref<ListQueryParams>({})

  const { data, execute, pending } = useRequest(() => getDictDataList(queryParams.value))

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

  const { params } = useRoute()

  if (params.type) {
    queryParams.value.dictType = params.type as string
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
