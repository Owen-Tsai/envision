import { cloneDeep } from 'lodash-es'
import { generateID } from '@/utils/fusion'
import type { Widget, WPropsSubFormEntry, LayoutWidget } from '@/types/workflow/form'

export const getDuplicatedWidgets = (entry: WPropsSubFormEntry[]): Widget[] => {
  const widgetsToClone = entry[0].widgets

  type Children = LayoutWidget['props']['children']

  const cloneChildren = (children: Children) => {
    const clone: Children = []

    children.forEach((child) => {
      const newWidgets: Widget[] = []
      const newChild: Children[number] = cloneDeep(child)

      child.widgets.forEach((widget) => {
        const newWidget: Widget = cloneDeep(widget)
        newWidget.uid = generateID()

        if (newWidget.class === 'layout') {
          const cloned = cloneChildren(newWidget.props.children)
          console.log(cloned)
          ;(newWidget as LayoutWidget).props.children = cloned
        }

        newWidgets.push(newWidget)
      })

      newChild.widgets = newWidgets
      clone.push(newChild as any)
    })

    return clone
  }

  const ret = widgetsToClone.map((widget) => {
    if (widget.class === 'layout') {
      const children = widget.props.children
      const clone = cloneChildren(children)

      return {
        ...widget,
        uid: generateID(),
        props: {
          ...widget.props,
          children: clone
        }
      } as Widget
    } else {
      return {
        ...widget,
        uid: generateID()
      } as Widget
    }
  })

  return ret
}
