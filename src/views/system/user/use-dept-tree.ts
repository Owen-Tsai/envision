import { ref, watch } from 'vue'
import useRequest from '@/hooks/use-request'
import { getDeptTree } from '@/api/system/dept'
import { filterTree, type Tree } from '@/utils/tree'

const useDeptTree = () => {
  const filteredTreeData = ref<Tree[]>()
  const selectedKeys = ref<number[]>([])
  const currentDeptName = ref('')
  const searchText = ref('')

  const { data, pending } = useRequest(getDeptTree, {
    immediate: true,
    onSuccess(data) {
      selectedKeys.value[0] = data[0].key
      filteredTreeData.value = data
      currentDeptName.value = data[0].title
    }
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

  return {
    deptTree: data,
    deptTreeLoading: pending,
    filteredTreeData,
    selectedKeys,
    currentDeptName,
    searchText
  }
}

export default useDeptTree
