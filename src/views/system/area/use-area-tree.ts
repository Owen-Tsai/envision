import useRequest from '@/hooks/use-request'
import { getAreaTree } from '@/api/system/area'
import { filterTree, type Tree } from '@/utils/tree'

const useAreaTree = () => {
  const filteredTreeData = ref<Tree[]>()
  const selectedKeys = ref<string[]>([])
  const searchText = ref('')

  let oldSelectedKey: number | string | undefined = undefined

  const { data, pending, execute } = useRequest(getAreaTree, {
    immediate: true,
    onSuccess(data) {
      filteredTreeData.value = data
    },
  })

  watch(searchText, () => {
    const filtered: Tree[] = []
    data.value?.forEach((tree) => {
      const result = filterTree(tree as any, searchText.value)
      if (result) {
        filtered.push(result)
      }
    })

    filteredTreeData.value = filtered
  })

  const onTreeNodeSelect = (node: Tree) => {
    const hasSelected = node.key === oldSelectedKey
    if (!hasSelected) {
      oldSelectedKey = node.key
    } else {
      oldSelectedKey = undefined
    }
  }

  return {
    areaTree: data,
    loading: pending,
    execute,
    filteredTreeData,
    selectedKeys,
    searchText,
    onTreeNodeSelect,
  }
}

export default useAreaTree
