import dayjs from 'dayjs'
import useRequest from '@/hooks/use-request'
import { getDataSourceList, type DataSourceVO } from '@/api/infra/data-source'
import type { TableProps } from 'ant-design-vue'

export const columns: TableProps['columns'] = [
  { title: '数据源名称', dataIndex: 'name', key: 'name', width: 160, ellipsis: true },
  { title: '数据源连接', dataIndex: 'url', key: 'url', ellipsis: true },
  { title: '用户名', width: 140, dataIndex: 'username', key: 'username', ellipsis: true },
  {
    title: '创建时间',
    width: 160,
    dataIndex: 'createTime',
    key: 'createTime',
    sortDirections: ['ascend', 'descend'],
    sorter: (a: DataSourceVO, b: DataSourceVO) => {
      return dayjs(a.createTime).isSameOrBefore(b.createTime) ? 1 : -1
    },
  },
  { title: '操作', width: 170 },
]

export const useTable = () => {
  const { data, execute, pending } = useRequest(getDataSourceList, {
    immediate: true,
  })

  return {
    data,
    execute,
    pending,
  }
}
