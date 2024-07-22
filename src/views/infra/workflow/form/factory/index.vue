<template>
  <div class="factory-panel flex">
    <div class="toolbar flex-shrink-0 flex flex-col gap-1">
      <Action
        v-for="(item, i) in toolbarTabs"
        :key="i"
        :active="i === activeTab"
        :title="item.title"
        :icon="item.icon"
        @click="activeTab = i"
      />
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
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, inject } from 'vue'
import { cloneDeep } from 'lodash'
import Draggable from 'vuedraggable'
import { PartitionOutlined, BuildOutlined, FileTextOutlined } from '@ant-design/icons-vue'
import highlighter from '@/utils/highlighter'
import { generateID } from '@/utils/envision'
import { widgetInitConfig } from '../use-widgets'
import Item from './item.vue'
import Action from './toolbar-action.vue'
import schemaToTree from './use-tree'
import { injectionKey, type WidgetType, type Widget, type FormCreatorCtx } from '@/types/workflow'

const toolbarTabs = [
  { title: '树视图', icon: PartitionOutlined },
  { title: '组件列表', icon: BuildOutlined },
  { title: 'JSON Schema', icon: FileTextOutlined }
]

const activeTab = ref(1)

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
  return highlighter.codeToHtml(JSON.stringify(schema, null, 2), {
    lang: 'json',
    theme: 'min-light'
  })
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
  padding: 0 4px;
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
