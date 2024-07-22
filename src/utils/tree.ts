import type { TreeProps } from 'ant-design-vue'
export type Tree = Exclude<TreeProps['treeData'], undefined>[number]

export const filterTree = (tree: Tree, searchText: string): Tree | null => {
  if (tree.name.includes(searchText)) {
    return { ...tree }
  } else {
    const filteredChildren = tree.children
      ? tree.children.map((child) => filterTree(child, searchText)).filter(Boolean)
      : []
    if (filteredChildren.length > 0) {
      return { ...tree, children: filteredChildren as Tree[] }
    } else {
      return null
    }
  }
}

export const findNode = <T>(
  tree: T[],
  predicate: (e: T) => boolean,
  childrenField = 'children'
): T | null => {
  for (const node of tree) {
    if ((node as any)[childrenField]) {
      return findNode((node as any)[childrenField], predicate, childrenField)
    }

    if (predicate(node)) {
      return node
    }
  }

  return null
}
