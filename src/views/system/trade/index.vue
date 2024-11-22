<template>
  <div class="view">
    <ARow :gutter="24">
      <ACol :span="24" :lg="5">
        <ACard :body-style="{ padding: '16px' }" class="dept-card">
          <AInput v-model:value="searchText" class="mb-4" placeholder="输入关键字过滤">
            <template #suffix>
              <SearchOutlined />
            </template>
          </AInput>
          <a-spin :spinning="Loading">
            <ATree
              v-model:selected-keys="selectedKeys"
              :tree-data="filteredTreeData"
              :field-names="{ key: 'id', title: 'name' }"
              @select="(key, { node }) => onTreeNodeSelect(node)"
              :height="650"
            />
          </a-spin>
        </ACard>
      </ACol>
      <ACol :span="24" :lg="19">
        <Details :id="selectedKeys[0]" />
      </ACol>
    </ARow>
  </div>
</template>

<script lang="ts" setup>
import useTradeTree from './use-trade-tree'

import { SearchOutlined } from '@ant-design/icons-vue'
import Details from '@/views/system/trade/details.vue'

const { Loading, filteredTreeData, searchText, selectedKeys, onTreeNodeSelect } = useTradeTree()

defineOptions({ name: 'SystemTrade' })
</script>

<style lang="scss" scoped></style>
