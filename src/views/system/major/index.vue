<template>
  <div class="view">
    <ARow :gutter="24">
      <ACol :span="24" :lg="6">
        <ACard
          ref="wrapper"
          :body-style="{
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }"
          class="tree-card"
        >
          <AInput
            ref="input"
            v-model:value="searchText"
            class="mb-4"
            placeholder="输入关键字过滤"
            allow-clear
          >
            <template #suffix>
              <SearchOutlined />
            </template>
          </AInput>
          <div class="flex-grow">
            <a-spin :spinning="loading">
              <ATree
                v-model:selected-keys="selectedKeys"
                :tree-data="filteredTreeData"
                :field-names="{ key: 'id', title: 'name' }"
                :height="treeH"
                @select="(key, { node }) => onTreeNodeSelect(node)"
              />
            </a-spin>
          </div>
        </ACard>
      </ACol>
      <ACol :span="24" :lg="18">
        <Form v-model:id="selectedKeys[0]" @success="execute" />
      </ACol>
    </ARow>
  </div>
</template>

<script lang="ts" setup>
import useMajorTree from './use-major-tree'
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
const input = useTemplateRef('input')
const { height: wrapperH } = useElementSize(wrapper)
const { height: inputH } = useElementSize(input)
const treeH = computed(() => wrapperH.value - inputH.value - 56)

const { loading, execute, filteredTreeData, searchText, selectedKeys, onTreeNodeSelect } =
  useMajorTree()

defineOptions({ name: 'SystemMajor' })
</script>

<style lang="scss" scoped>
.tree-card {
  @apply sticky;
  top: v-bind('style.top');
  height: v-bind('style.height');
}
</style>
