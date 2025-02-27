import { cloneDeep } from 'lodash-es'
import { generateId } from '@fusionx/utils'
import {
  getCodeGenConfigDetail as getTableColumns,
  type ConfigDetailVO,
} from '@/api/infra/code-gen'
import widgetConfigMap from '@/components/fux-core/_utils/initial-widget-config'
import type { AppInfo } from '@/types/fux-core'
import type { FormSchema, WidgetMap, Widget } from '@/types/fux-core/form'

const genDataTableSchema = (info: ConfigDetailVO, widgets: Widget[]): WidgetMap['dataTable'] => {
  const columns = info.columns.filter((column) => column.listOperation)
  const ret: WidgetMap['dataTable'] = {
    ...cloneDeep(widgetConfigMap.dataTable)!,
    uid: generateId(),
    props: {
      ...cloneDeep(widgetConfigMap.dataTable!.props),
      widgets: widgets,
      columns: columns.map((column) => ({
        key: column.javaField,
        title: column.columnComment || column.columnName,
        dataIndex: column.javaField,
        formatter: {
          type: column.dictTypeStr ? 'dict' : null,
          value: column.dictTypeStr || '',
        },
      })),
      url: '/applications/' + info.table.tableName,
    },
  }

  ret.props.columns?.push({ key: 'actions', title: '操作', dataIndex: 'actions' })

  delete ret.icon

  return ret
}

const genGridSchema = (count: 2 | 3, widgets: Widget[]): WidgetMap['grid'] => {
  const cols: Array<Widget[]> = []

  widgets.forEach((widget, idx) => {
    for (let i = 0; i < count; i++) {
      if (idx % count === i) {
        if (!cols[i]) cols[i] = []
        cols[i].push(widget)
      }
    }
  })

  const ret: WidgetMap['grid'] = {
    ...cloneDeep(widgetConfigMap.grid)!,
    uid: generateId(),
    props: {
      ...cloneDeep(widgetConfigMap.grid!.props),
    },
  }

  ret.props.children = cols.map((col) => ({
    span: 24 / count,
    widgets: col,
  }))

  return ret
}

const genTableWidgetsSchema = (info: ConfigDetailVO, step?: number): Widget[] => {
  const { columns, table } = info
  // widgets of table
  const tableSchema: Widget[] = []
  columns.forEach((column) => {
    if (!column.createOperation || !column.htmlType) return

    const widget = genWidgetSchema(column, table.tableName || '', step)
    if (widget) {
      tableSchema.push(widget)
    }
  })

  return tableSchema
}

const genWidgetSchema = (
  column: ConfigDetailVO['columns'][number],
  tableName: string,
  step?: number,
): Widget | undefined => {
  const type = (column.htmlType === 'datetime' ? 'datePicker' : column.htmlType) as keyof WidgetMap
  if (widgetConfigMap[type]) {
    const ret = {
      ...cloneDeep(widgetConfigMap[type]!),
      uid: generateId(),
      props: {
        ...cloneDeep(widgetConfigMap[type]!.props),
        field: {
          label: column.columnComment || column.columnName,
          name: `${tableName}:${column.javaField}`,
        },
        hide: `${column.javaField}` == 'id',
      },
    }

    if (
      column.htmlType &&
      ['select', 'checkbox', 'radio'].includes(column.htmlType) &&
      column.dictTypeStr
    ) {
      ;(ret as WidgetMap['select' | 'radio' | 'checkbox']).props.options.type = 'dict'
      ;(ret as WidgetMap['select' | 'radio' | 'checkbox']).props.options.value = column.dictTypeStr
    }

    delete ret.icon

    return ret as Widget
  }
}

const genFormSchemaByAppInfo = async (info: AppInfo): Promise<FormSchema> => {
  const { gridColumns, paginated, tables } = info

  const tableColumnsInfo: ConfigDetailVO[] = []

  for (const table of tables) {
    const resp = await getTableColumns(table.id as number)
    tableColumnsInfo.push(resp)
  }

  const schemaWrapper: Widget | Widget[] = paginated
    ? ({
        ...cloneDeep(widgetConfigMap[paginated]!),
        uid: generateId(),
        props: {
          ...cloneDeep(widgetConfigMap[paginated]!.props),
          children: [],
        },
      } as Widget)
    : []

  tableColumnsInfo.forEach((info, idx) => {
    const gridSchema: WidgetMap['grid'] | null = gridColumns
      ? {
          ...cloneDeep(widgetConfigMap.grid)!,
          uid: generateId(),
          props: {
            ...cloneDeep(widgetConfigMap.grid!.props),
            children: [],
          },
        }
      : null

    delete gridSchema?.icon

    let tableSchema: Widget[] = paginated
      ? genTableWidgetsSchema(info, idx)
      : genTableWidgetsSchema(info)
    if (gridColumns) {
      // const colWidgets = genGridSchema(tableSchema, column)
      const gridSchema = genGridSchema(gridColumns, tableSchema)

      tableSchema = [gridSchema]
    }

    if (tables.find((table) => table.id === info.table.id)?.subTable) {
      if (paginated) {
        tableSchema = genTableWidgetsSchema(info)
        if (gridColumns) {
          // const colWidgets = genGridSchema(tableSchema, column)
          const gridSchema = genGridSchema(gridColumns, tableSchema)

          tableSchema = [gridSchema]
        }
        ;(schemaWrapper as WidgetMap['tabs' | 'steps']).props.children.push({
          title: info.table.tableComment || info.table.tableName || '',
          widgets: [genDataTableSchema(info, tableSchema)],
        })
      } else {
        ;(schemaWrapper as Widget[]).push({
          ...cloneDeep(widgetConfigMap.subForm!),
          uid: generateId(),
          props: {
            ...cloneDeep(widgetConfigMap.subForm!.props),
            field: {
              label: info.table.tableComment || info.table.tableName || '',
              name: info.table,
            },
            children: [...tableSchema],
          },
        } as WidgetMap['subForm'])
      }
    } else {
      if (paginated) {
        ;(schemaWrapper as WidgetMap['tabs' | 'steps']).props.children.push({
          title: info.table.tableComment || info.table.tableName || '',
          widgets: tableSchema,
        })

        delete (schemaWrapper as WidgetMap['tabs' | 'steps']).icon
      } else {
        ;(schemaWrapper as Widget[]).push(...tableSchema)
      }
    }
  }) // forEach

  return {
    widgets: Array.isArray(schemaWrapper) ? [...schemaWrapper] : [schemaWrapper],
    layout: info.gridColumns === 3 ? 'vertical' : 'horizontal',
    labelWidth: info.gridColumns === 3 ? undefined : '100px',
    colon: info.gridColumns !== 3,
    labelAlign: info.gridColumns === 3 ? undefined : 'right',
  }
}

export default genFormSchemaByAppInfo
