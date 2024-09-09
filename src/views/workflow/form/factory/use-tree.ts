import type { Widget } from '@/types/workflow'

type Tree = {
  label: string
  name?: string
  uid?: string
  children?: Tree[]
}

const schemaToTree = (widgets: Widget[]): Tree[] => {
  const result: Tree[] = []

  const visit = (widgets: Widget[], node: Tree[]) => {
    widgets.forEach((widget) => {
      if (widget.type === 'grid' || widget.type === 'tabs' || widget.type === 'steps') {
        const newNode: Tree = {
          label: widget.name,
          children: []
        }
        // find deep
        if (widget.props.children.length > 0) {
          widget.props.children.forEach((childSlot) => {
            visit(childSlot.widgets, newNode.children!)
          })
        }

        node.push(newNode)
      } else {
        node.push({
          label: widget.props.field.label as string,
          name: widget.props.field.name,
          uid: widget.uid
        })
      }
    })
  }

  visit(widgets, result)

  return [
    {
      label: '大纲树',
      name: '',
      children: result
    }
  ]
}

export default schemaToTree
