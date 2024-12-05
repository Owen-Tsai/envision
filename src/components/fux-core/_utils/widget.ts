import { cloneDeep } from 'lodash-es'
import { generateId } from '@fusionx/utils'
import type { FormSchema, Widget } from '@/types/fux-core/form'

type Tree = {
  label: string
  name?: string
  key: string
  children?: Tree[]
}

export const schemaToTree = (schema: FormSchema) => {
  const widgets = schema?.widgets
  if (!widgets) return []

  const tree: Tree[] = []

  const visit = (ws: FormSchema['widgets'], node: Tree[]) => {
    ws?.forEach((w) => {
      const treeNode: Tree = {
        label: w.props.field?.label || w.name,
        name: w.props.field?.name,
        key: w.uid
      }

      if (w.class === 'layout') {
        treeNode.children = []
        if (w.type === 'grid' || w.type === 'steps' || w.type === 'tabs') {
          if (w.props.children) {
            w.props.children.forEach((child: { widgets: Widget[] | undefined }) => {
              visit(child.widgets!, treeNode.children!)
            })
          }
        } else if (w.type === 'subForm') {
          visit(w.props.children, treeNode.children)
        } else {
          // dataTable
          visit(w.props.widgets, treeNode.children)
        }
      }

      node.push(treeNode)
    })
  }

  visit(schema.widgets, tree)

  return [
    {
      label: '组件树',
      name: '',
      children: tree,
      key: 'root'
    }
  ]
}

export const deleteWidgetByUid = (widgets: Widget[], uid: string) => {
  for (let i = 0; i < widgets.length; i++) {
    const w = widgets[i]
    if (w.uid === uid) {
      widgets.splice(i, 1)
      break
    }

    if (w.class === 'layout') {
      if (w.type === 'grid' || w.type === 'steps' || w.type === 'tabs') {
        if (w.props.children) {
          for (let j = 0; j < w.props.children.length; j++) {
            deleteWidgetByUid(w.props.children[j].widgets, uid)
          }
        }
      } else if (w.type === 'subForm') {
        deleteWidgetByUid(w.props.children, uid)
      } else {
        // dataTable
        deleteWidgetByUid(w.props.widgets, uid)
      }
    }
  }
}

export const copyWidget = (widgetToCopy: Widget, siblings: Widget[]) => {
  const newWidget = cloneDeep(widgetToCopy)
  newWidget.uid = generateId()

  if (newWidget.class === 'layout') {
    if (newWidget.type === 'grid' || newWidget.type === 'steps' || newWidget.type === 'tabs') {
      if (newWidget.props.children) {
        newWidget.props.children.forEach((child) => {
          child.widgets.forEach((w) => {
            w.uid = generateId()
            if (w.class === 'layout') {
              copyWidget(w, child.widgets)
            }
          })
        })
      }
    } else if (newWidget.type === 'subForm') {
      newWidget.props.children.forEach((w) => {
        w.uid = generateId()
        if (w.class === 'layout') {
          copyWidget(w, newWidget.props.children)
        }
      })
    } else {
      // dataTable
      newWidget.props.widgets.forEach((w) => {
        w.uid = generateId()
        if (w.class === 'layout') {
          copyWidget(w, newWidget.props.widgets)
        }
      })
    }
  }

  siblings.push(newWidget)
}

/**
 * 获取 widets 中所有字段的 `field.name`（即字段名称）
 * @returns 返回一个字符串数组
 */
export const getWidgetFieldNames = (widgets: Widget[]): string[] => {
  const ret: string[] = []

  widgets.forEach((w) => {
    if (w.class === 'form') {
      ret.push(w.props.field.name || w.uid)
    } else {
      if (w.type === 'grid' || w.type === 'steps' || w.type === 'tabs') {
        if (w.props.children) {
          w.props.children.forEach((child) => {
            ret.push(...getWidgetFieldNames(child.widgets))
          })
        }
      }
    }
  })

  return ret
}
