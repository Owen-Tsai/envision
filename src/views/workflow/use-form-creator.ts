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
  const ret = {
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

  delete ret.icon

  return ret
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
      column.dictTypeStr
    ) {
      ;(ret as WidgetConfigMap['select' | 'radio' | 'checkbox']).props.options.type = 'dict'
      ;(ret as WidgetConfigMap['select' | 'radio' | 'checkbox']).props.options.dictType =
        column.dictTypeStr
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

// generate grid children based on passed in widgets
const generateGridSchema = (widgets: Widget[], count: 2 | 3) => {
  const cols: Array<Widget[]> = []
  widgets.forEach((widget, idx) => {
    for (let i = 0; i < count; i++) {
      if (idx % count === i) {
        if (!cols[i]) cols[i] = []
        cols[i].push(widget)
      }
    }
  })

  return cols
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

    const { paginated, tables, column } = dataSource
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
      const gridSchema: WidgetConfigMap['grid'] | null = column
        ? {
            ...cloneDeep(widgetInitConfig.grid),
            uid: generateID(),
            props: {
              ...cloneDeep(widgetInitConfig.grid.props),
              children: []
            }
          }
        : null

      delete gridSchema?.icon
      let tableSchema = generateTableSchema(info)
      if (column) {
        const colWidgets = generateGridSchema(tableSchema, column)

        colWidgets.forEach((widgets) => {
          ;(gridSchema as WidgetConfigMap['grid']).props.children.push({
            span: 24 / column,
            widgets
          })
        })

        tableSchema = [gridSchema!]
        console.log(tableSchema)
      }

      if (dataSource.tables.find((table) => table.name === info.table)?.subTable) {
        if (paginated) {
          ;(wrapperSchema as WidgetConfigMap['tabs' | 'steps']).props.children.push({
            title: info.tableComment || info.table,
            widgets: [generateDataTableSchema(info, tableSchema)]
          })
        } else {
          ;(wrapperSchema as Widget[]).push({
            ...cloneDeep(widgetInitConfig.subForm),
            uid: generateID(),
            props: {
              ...cloneDeep(widgetInitConfig.subForm.props),
              field: {
                label: info.tableComment || info.table,
                name: info.table
              },
              children: [
                {
                  widgets: [...tableSchema]
                }
              ]
            }
          } as WidgetConfigMap['subForm'])
        }
      } else {
        if (paginated) {
          ;(wrapperSchema as WidgetConfigMap['tabs' | 'steps']).props.children.push({
            title: info.tableComment || info.table,
            widgets: tableSchema
          })

          delete (wrapperSchema as WidgetConfigMap['tabs' | 'steps']).icon
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
