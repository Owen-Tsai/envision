import useRequest from '@/hooks/use-request'
import { getDeptTree } from '@/api/system/dept'
import type { ListQueryParams } from '@/api/system/user'
import { filterTree, type Tree } from '@/utils/tree'

const useDeptTree = (queryParams: Ref<ListQueryParams>, requestData: () => void) => {
  const filteredTreeData = ref<Tree[]>()
  const selectedKeys = ref<number[]>([])
  const currentDeptName = ref('全部')
  const searchText = ref('')

  let oldSelectedKey: number | string | undefined = undefined

  const { data, pending } = useRequest(getDeptTree, {
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
    currentDeptName.value = hasSelected ? '全部' : node.name
    queryParams.value.deptId = hasSelected ? undefined : node.key.toString()
    requestData()
  }

  return {
    deptTree: data,
    deptTreeLoading: pending,
    filteredTreeData,
    selectedKeys,
    currentDeptName,
    searchText,
    onTreeNodeSelect,
  }
}

export default useDeptTree
