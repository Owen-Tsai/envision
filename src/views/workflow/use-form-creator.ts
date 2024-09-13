import { ref, type Ref } from 'vue'
import { cloneDeep } from 'lodash'
import { getTableColumns as fetch, type TableColumnsVO } from '@/api/system/application'
import { generateID } from '@/utils/fusion'
import { widgetInitConfig } from './form/use-widgets'
import useWorkflow from '@/stores/workflow'
import type { Schema, WidgetConfigMap, Widget } from '@/types/workflow'

export const defaultInitSchema: Schema = {
  form: {
    widgets: [],
    colon: true,
    layout: 'horizontal'
  },
  remoteAPIs: {},
  functions: {}
}

const getTableColumns = async (tables: string[]) => {
  const resp = await fetch(tables)
  return resp
}

const generateDataTableSchema = (
  info: TableColumnsVO,
  widgets: Widget[]
): WidgetConfigMap['dataTable'] => {
  const columns = info.columns.filter((column) => column.listOperation)

  return {
    ...cloneDeep(widgetInitConfig.dataTable),
    uid: generateID(),
    props: {
      ...cloneDeep(widgetInitConfig.dataTable.props),
      children: [
        {
          title: info.table,
          widgets
        }
      ],
      columns: columns.map((column) => ({
        key: column.javaField,
        title: column.columnComment || column.columnName
      }))
    }
  }
}

const generateWidgetSchema = (
  column: TableColumnsVO['columns'][number],
  tableName: string
): Widget | undefined => {
  const type = (
    column.htmlType === 'datetime' ? 'datePicker' : column.htmlType
  ) as keyof WidgetConfigMap
  if (widgetInitConfig[type]) {
    const ret = {
      ...cloneDeep(widgetInitConfig[type]),
      uid: generateID(),
      props: {
        ...cloneDeep(widgetInitConfig[type].props),
        field: {
          label: column.columnComment || column.columnName,
          name: `${tableName}:${column.javaField}`
        }
      }
    }

    if (
      column.htmlType &&
      ['select', 'checkbox', 'radio'].includes(column.htmlType) &&
      column.dictType
    ) {
      ;(ret as WidgetConfigMap['select' | 'radio' | 'checkbox']).props.options.type = 'dict'
      ;(ret as WidgetConfigMap['select' | 'radio' | 'checkbox']).props.options.dictType =
        column.dictType
    }

    delete ret.icon

    return ret as Widget
  }
}

const generateTableSchema = (columnsInfo: TableColumnsVO) => {
  const { columns, table } = columnsInfo
  // widgets of table
  const tableSchema: Widget[] = []
  columns.forEach((column) => {
    if (!column.createOperation || !column.htmlType) return

    const widget = generateWidgetSchema(column, table)
    widget && tableSchema.push(widget)
  })

  return tableSchema
}

const useFormCreator = (
  appId: string
): { schema: Ref<Schema>; initFormCreator: () => Promise<void>; loading: Ref<boolean> } => {
  const schema = ref<Schema>(cloneDeep(defaultInitSchema))
  const loading = ref(false)

  const generateInitalSchema = async (): Promise<Schema> => {
    const { getDataSource } = useWorkflow()
    const dataSource = getDataSource(appId)

    if (dataSource === null) {
      return defaultInitSchema
    }

    const { paginated, tables } = dataSource
    const tableColumnsInfo = await getTableColumns(tables.map((table) => table.name))

    const wrapperSchema: Widget | Widget[] = paginated
      ? ({
          ...cloneDeep(widgetInitConfig[paginated]),
          uid: generateID(),
          props: {
            ...cloneDeep(widgetInitConfig[paginated].props),
            children: []
          }
        } as Widget)
      : []

    tableColumnsInfo.forEach((info) => {
      const tableSchema = generateTableSchema(info)

      if (dataSource.tables.find((table) => table.name === info.table)?.subTable) {
        if (paginated) {
          // todo: add `dataTable`
          ;(wrapperSchema as WidgetConfigMap['tabs' | 'steps']).props.children.push({
            title: info.tableComment || info.table,
            widgets: [generateDataTableSchema(info, tableSchema)]
          })
        } else {
          // todo: add `subForm`
          ;(wrapperSchema as Widget[]).push(...tableSchema)
        }
      } else {
        if (paginated) {
          ;(wrapperSchema as WidgetConfigMap['tabs' | 'steps']).props.children.push({
            title: info.tableComment || info.table,
            widgets: tableSchema
          })
        } else {
          ;(wrapperSchema as Widget[]).push(...tableSchema)
        }
      }
    })

    return {
      ...defaultInitSchema,
      form: {
        ...defaultInitSchema.form,
        widgets: Array.isArray(wrapperSchema) ? [...wrapperSchema] : [wrapperSchema]
      }
    }
  }

  const initFormCreator = async () => {
    loading.value = true
    try {
      schema.value = await generateInitalSchema()
      loading.value = false
    } catch (e) {
      console.error(e)
    }
  }

  return {
    schema,
    loading,
    initFormCreator
  }
}

export default useFormCreator
