<template>
  <div class="view">
    <ARow :gutter="24">
      <ACol :span="24" :lg="5">
        <ACard :body-style="{ padding: '16px' }" class="dept-card">
          <AInput v-model:value="searchText" class="mb-4" placeholder="输入关键字过滤部门">
            <template #suffix>
              <SearchOutlined />
            </template>
          </AInput>
          <ATree
            v-if="!deptTreeLoading"
            v-model:selected-keys="selectedKeys"
            :tree-data="filteredTreeData"
            default-expand-all
          />
        </ACard>
      </ACol>
      <ACol :span="24" :lg="19">
        <ATable></ATable>
      </ACol>
    </ARow>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import useRequest from '@/hooks/use-request'
import { getDeptTree, getUsers, type ListQueryParams } from '@/api/system/user'
import { filterTree, type Tree } from '@/utils/tree'
import type { TableProps } from 'ant-design-vue'

const columns: TableProps['columns'] = [
  { key: 'userId', title: '用户编号' },
  { key: 'userName', title: '用户账号' },
  { key: 'nickName', title: '用户名称' },
  { key: 'deptName', title: '所属部门' },
  { key: 'phonenumber', title: '已绑定手机' },
  { key: 'status', title: '状态' },
  { key: 'createTime', title: '注册时间' }
]

const selectedKeys = ref<number[]>([])
const searchText = ref('')

const filteredTreeData = ref<Tree[]>()

const queryParams = ref<ListQueryParams>()

const { data: deptTree, pending: deptTreeLoading } = useRequest(getDeptTree, {
  immediate: true,
  onSuccess(data) {
    selectedKeys.value[0] = data[0].key
    filteredTreeData.value = data
  }
})

const { data, pending } = useRequest(() => getUsers(queryParams.value))

watch(searchText, () => {
  const filtered: Tree[] = []
  deptTree.value?.forEach((tree) => {
    const result = filterTree(tree, searchText.value)
    if (result) {
      filtered.push(result)
    }
  })

  filteredTreeData.value = filtered
})
</script>

<style lang="scss" scoped>
.dept-card {
  min-height: calc(100vh - 130px);
}
</style>
