<template>
  <div class="factory-panel flex">
    <div class="toolbar flex-shrink-0 flex flex-col justify-between">
      <div>
        <Action
          v-for="(item, i) in toolbarTabs"
          :key="i"
          :active="i === activeTab"
          :title="item.title"
          :icon="item.icon"
          class="mb-1"
          @click="activeTab = i"
        />
      </div>
      <div class="flex flex-col items-center gap-2">
        <ATooltip title="数据源" placement="right" :arrow="false">
          <AButton @click="visible.api = true">
            <template #icon>
              <ApiOutlined />
            </template>
          </AButton>
        </ATooltip>
        <ATooltip title="函数" placement="right" :arrow="false">
          <AButton @click="visible.func = true">
            <template #icon>
              <FunctionOutlined />
            </template>
          </AButton>
        </ATooltip>
        <ATooltip title="预览表单" placement="right" :arrow="false">
          <AButton type="primary" @click="visible.preview = true">
            <template #icon>
              <CaretRightFilled />
            </template>
          </AButton>
        </ATooltip>
      </div>
    </div>

    <div class="h-full flex-1 min-w-0 panel">
      <EScrollbar
        v-show="activeTab === 0"
        class="h-full"
        wrapper-class="h-full"
        style="background-color: var(--colorBgContainer)"
      >
        <!-- component tree -->
        <div class="min-h-full">
          <ATree
            :field-names="{ title: 'label', key: 'uid' }"
            :key="JSON.stringify(componentTree)"
            :tree-data="componentTree"
            default-expand-all
          >
            <template #title="{ label, name, uid }">
              <ATooltip :title="uid" placement="right" :arrow="false">
                <div class="node">
                  <div class="label">{{ label }}</div>
                  <div class="name">{{ name }}</div>
                </div>
              </ATooltip>
            </template>
          </ATree>
        </div>
      </EScrollbar>
      <EScrollbar v-show="activeTab === 1" class="h-full" wrapper-class="h-full">
        <!-- widget list -->
        <Draggable
          :list="buildingBlocks"
          :group="{ name: 'efk', pull: 'clone', put: false }"
          :sort="false"
          item-key="type"
          :clone="cloneWidget"
          :swap-threshold="0.1"
          class="widget-list"
        >
          <template #item="{ element }: { element: Widget; index: number }">
            <Item :widget="element" />
          </template>
        </Draggable>
      </EScrollbar>
      <EScrollbar
        v-show="activeTab === 2"
        direction="horizontal"
        class="h-full"
        wrapper-class="h-full"
        style="background-color: var(--colorBgContainer)"
      >
        <div class="schema-panel flex-shrink-1" v-html="highlightedSchema" />
      </EScrollbar>
    </div>
    <PreviewModal v-model:open="visible.preview" :schema="schema" />
    <FuncModal v-model:open="visible.func" />
    <APIModal v-model:open="visible.api" />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, inject } from 'vue'
import { cloneDeep } from 'lodash'
import Draggable from 'vuedraggable'
import {
  PartitionOutlined,
  BuildOutlined,
  FileTextOutlined,
  CaretRightFilled,
  ApiOutlined,
  FunctionOutlined
} from '@ant-design/icons-vue'
import useHighlighter from '@/hooks/use-highlighter'
import { generateID } from '@/utils/envision'
import { widgetInitConfig } from '../use-widgets'
import Item from './item.vue'
import Action from './toolbar-action.vue'
import schemaToTree from './use-tree'
import PreviewModal from './preview/index.vue'
import FuncModal from './function/index.vue'
import APIModal from './remote-api/index.vue'
import { injectionKey, type WidgetType, type Widget, type FormCreatorCtx } from '@/types/workflow'

const toolbarTabs = [
  { title: '树视图', icon: PartitionOutlined },
  { title: '组件列表', icon: BuildOutlined },
  { title: 'JSON Schema', icon: FileTextOutlined }
]

const activeTab = ref(1)
const visible = reactive({
  preview: false,
  func: false,
  api: false
})

const buildingBlocks = computed(() => {
  const keys = Object.keys(widgetInitConfig) as WidgetType[]
  return keys.map((e) => widgetInitConfig[e])
})

const schema = inject<FormCreatorCtx>(injectionKey)?.schema

const componentTree = computed(() => {
  if (!schema) return []
  return schemaToTree(schema.form.widgets) as any
})

const highlightedSchema = computed(() => {
  return useHighlighter(JSON.stringify(schema, null, 2), 'json')
})

const cloneWidget = (widget: Widget) => {
  const id = generateID()
  const ret = cloneDeep(widget)
  delete ret.icon
  ret.uid = id
  return ret
}
</script>

<style lang="scss" scoped>
.toolbar {
  flex-basis: 48px;
  padding: 8px 4px;
  background-color: var(--colorBgContainer);
  border-right: 1px solid var(--colorBorder);
}

.widget-list {
  background-color: var(--colorBorderSecondary);
  @apply grid grid-cols-2 gap-1px;
}

.schema-panel {
  background-color: var(--colorBgContainer);
  padding: 16px;
  overflow-x: auto;
}

:global(.panel .scrollbar-content) {
  background-color: var(--colorBgContainer);
  height: 100%;
}

:global(.panel .scrollbar__thumbPlaceholder) {
  z-index: 2;
}

.node {
  @apply flex-center;
  gap: 4px;
  .name {
    color: var(--colorTextSecondary);
    font-style: italic;
  }
}
</style>
