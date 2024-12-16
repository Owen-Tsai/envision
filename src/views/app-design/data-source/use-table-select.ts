import { ref, computed, type Ref } from 'vue'
import useRequest from '@/hooks/use-request'
import { getTableDefList } from '@/api/fux'
import { getDataSourceList } from '@/api/infra/data-source'
import type { AppSchema } from '@/types/fux-core'
import type { SelectProps } from 'ant-design-vue'

export type TableModel = {
  tableName: string
  id: string | number
  dataSourceConfigId: string | number
  tableComment?: string
}

export type SelectValue = {
  label: string
  value: string | number
  option: TableModel
  subTable?: boolean
}

export const useTableSelect = (appSchema: Ref<AppSchema>) => {
  const loading = computed(() => p1.value || p2.value)
  const selectedValues = ref<SelectValue[]>([])
  const tableSortList = ref<AppSchema['info']['tables']>([])

  const { data: tables, execute: getTables, pending: p1 } = useRequest(getTableDefList)
  const { data: dataSources, execute: getDaraSrcs, pending: p2 } = useRequest(getDataSourceList)

  const onTableSelectChange = () => {
    tableSortList.value = selectedValues.value.map((e) => {
      return {
        id: e.option.id,
        name: e.option.tableName,
        comment: e.option.tableComment,
        subTable: e.subTable,
      }
    })
  }

  const initTableSelection = async () => {
    await getDaraSrcs()
    await getTables()

    // mutate selectedValues based on appSchema
    selectedValues.value =
      appSchema.value.info.tables?.map((e) => ({
        label: e.name,
        value: e.id,
        option: tables.value?.find((t) => t.id === e.id) as TableModel,
        subTable: e.subTable,
      })) || []

    onTableSelectChange()
  }

  const filterOption: SelectProps['filterOption'] = (inputValue, option) => {
    return option?.tableComment.includes(inputValue) || option?.tableName.includes(inputValue)
  }

  return {
    tables,
    tableSortList,
    dataSources,
    loading,
    selectedValues,
    onTableSelectChange,
    initTableSelection,
    filterOption,
  }
}
