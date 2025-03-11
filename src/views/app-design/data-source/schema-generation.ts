import { cloneDeep, kebabCase } from 'lodash-es'
import { generateId } from '@fusionx/utils'
import {
  getCodeGenConfigDetail as getTableColumns,
  type ConfigDetailVO,
} from '@/api/infra/code-gen'
import widgetConfigMap from '@/components/fux-core/_utils/initial-widget-config'
import type { AppInfo } from '@/types/fux-core'
import type { FormSchema, WidgetMap, Widget } from '@/types/fux-core/form'

/**
 * 生成单个字段的 schema
 * @param config 字段的配置
 * @param tableName 表名，不传入时生成的字段 name 将不含表名和冒号构成的前缀
 */
const genWidgetSchema = (column: ConfigDetailVO['columns'][number], tableName?: string) => {
  const type = (column.htmlType === 'datetime' ? 'datePicker' : column.htmlType) as keyof WidgetMap
  if (widgetConfigMap[type]) {
    const ret = {
      ...cloneDeep(widgetConfigMap[type]!),
      uid: generateId(),
      props: {
        ...cloneDeep(widgetConfigMap[type]!.props),
        field: {
          label: column.columnComment || column.columnName,
          name: tableName ? `${tableName}:${column.javaField}` : column.javaField,
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

/**
 * 生成 DataTable 组件的 schema
 * @param info DataTable 对应的子表的配置信息
 * @param widgets 子表表单中包含的字段的 schema
 */
const genDataTableSchema = (info: ConfigDetailVO, widgets: Widget[]): WidgetMap['dataTable'] => {
  // columns that should be listed in table mode
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
      url: '/applications/' + kebabCase(info.table.tableName),
    },
  }

  ret.props.columns?.push({ key: 'actions', title: '操作', dataIndex: 'actions' })

  delete ret.icon

  return ret
}

/**
 * 生成栅格布局组件 Grid 的 schema
 * @param count 栅格布局组件的默认分列数量，取值 2 或 3
 * @param widgets 栅格布局组件中包含的字段的 schema
 */
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

/**
 * 生成一个数据表中包含的字段的 schema
 * @param info 表的配置信息
 */
const genWidgetsSchemaOfTable = (tableConfig: ConfigDetailVO, appInfo: AppInfo): Widget[] => {
  const { columns } = tableConfig
  const ret: Widget[] = []

  columns.forEach((column) => {
    // if a field is not intended to be filled by user, ignore
    if (!column.createOperation || !column.htmlType) return

    const isSubTable = !!appInfo.tables.find((t) => t.name === tableConfig.table.tableName)
      ?.subTable

    const widget = isSubTable
      ? genWidgetSchema(column)
      : genWidgetSchema(column, tableConfig.table.tableName)
    if (widget) {
      ret.push(widget)
    }
  })

  return ret
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

  tableColumnsInfo.forEach((tableConfig) => {
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

    let tableSchema: Widget[] = genWidgetsSchemaOfTable(tableConfig, info)
    if (gridColumns) {
      // const colWidgets = genGridSchema(tableSchema, column)
      const gridSchema = genGridSchema(gridColumns, tableSchema)

      tableSchema = [gridSchema]
    }

    if (tables.find((table) => table.id === tableConfig.table.id)?.subTable) {
      if (paginated) {
        tableSchema = genWidgetsSchemaOfTable(tableConfig, info)
        if (gridColumns) {
          // const colWidgets = genGridSchema(tableSchema, column)
          const gridSchema = genGridSchema(gridColumns, tableSchema)

          tableSchema = [gridSchema]
        }
        ;(schemaWrapper as WidgetMap['tabs' | 'steps']).props.children.push({
          title: tableConfig.table.tableComment || tableConfig.table.tableName || '',
          widgets: [genDataTableSchema(tableConfig, tableSchema)],
        })
      } else {
        ;(schemaWrapper as Widget[]).push({
          ...cloneDeep(widgetConfigMap.subForm!),
          uid: generateId(),
          props: {
            ...cloneDeep(widgetConfigMap.subForm!.props),
            field: {
              label: tableConfig.table.tableComment || tableConfig.table.tableName || '',
              name: tableConfig.table,
            },
            children: [...tableSchema],
          },
        } as WidgetMap['subForm'])
      }
    } else {
      if (paginated) {
        ;(schemaWrapper as WidgetMap['tabs' | 'steps']).props.children.push({
          title: tableConfig.table.tableComment || tableConfig.table.tableName || '',
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
