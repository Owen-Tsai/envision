<template>
  <div class="view">
    <ARow :gutter="24">
      <ACol :span="24" :lg="6">
        <ACard
          :body-style="{
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }"
          class="tree-card"
        >
          <AInput v-model:value="searchText" class="mb-4" placeholder="输入关键字过滤" allow-clear>
            <template #suffix>
              <SearchOutlined />
            </template>
          </AInput>
          <div class="flex-grow" ref="wrapper">
            <a-spin :spinning="loading">
              <ATree
                v-model:selected-keys="selectedKeys"
                :tree-data="filteredTreeData"
                :field-names="{ key: 'id', title: 'name' }"
                :height="treeHeight"
                @select="(key, { node }) => onTreeNodeSelect(node)"
              />
            </a-spin>
          </div>
        </ACard>
      </ACol>
      <ACol :span="24" :lg="18">
        <!-- <Details :id="selectedKeys[0]" /> -->
        <Form v-model:id="selectedKeys[0]" @success="execute" />
      </ACol>
    </ARow>
  </div>
</template>

<script lang="ts" setup>
import useAreaTree from './use-area-tree'
import Form from './form.vue'

// layout specific
const layout = import.meta.env.VITE_APP_LAYOUT
const style = ref<{ height: string; top: string }>(
  layout === 'default'
    ? {
        height: 'calc(100vh - 130px)',
        top: '110px',
      }
    : {
        height: 'calc(100vh - 68px)',
        top: '52px',
      },
)

const wrapper = useTemplateRef('wrapper')
const { height: treeHeight } = useElementSize(wrapper)

const { loading, execute, filteredTreeData, searchText, selectedKeys, onTreeNodeSelect } =
  useAreaTree()

defineOptions({ name: 'SystemArea' })
</script>

<style lang="scss" scoped>
.tree-card {
  @apply sticky;
  top: v-bind('style.top');
  height: v-bind('style.height');
}
</style>
