import useRequest from '@/hooks/use-request'
import { getMajorTree } from '@/api/system/major'
import { filterTree, type Tree } from '@/utils/tree'

const useMajorTree = () => {
  const filteredTreeData = ref<Tree[]>()
  const selectedKeys = ref<string[]>([])
  const currentDeptName = ref('全部')
  const searchText = ref('')

  let oldSelectedKey: number | string | undefined = undefined

  const { data, pending } = useRequest(getMajorTree, {
    immediate: true,
    onSuccess(data) {
      // console.log(data)
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
    currentDeptName.value = hasSelected ? '全部' : node.name
  }

  return {
    majorTree: data,
    Loading: pending,
    filteredTreeData,
    selectedKeys,
    searchText,
    onTreeNodeSelect,
  }
}

export default useMajorTree
