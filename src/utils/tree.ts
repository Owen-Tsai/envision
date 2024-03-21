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
