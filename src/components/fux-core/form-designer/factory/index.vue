<template>
  <div class="flex">
    <div class="action-bar flex-shrink-0">
      <div class="flex flex-col justify-between h-full">
        <div class="actions flex flex-col gap-1 items-center">
          <ToolbarItem
            v-for="(item, i) in toolbarItems"
            :key="item.title"
            v-bind="item"
            :active="activeItem === i"
            @click="activeItem = i"
          />
        </div>

        <div class="btns flex flex-col gap-2 items-center">
          <ToolbatBtn title="API 数据源" :icon="ApiOutlined" @click="visible.api = true" />
          <ToolbatBtn title="函数" :icon="FunctionOutlined" @click="visible.func = true" />
          <ToolbatBtn
            title="预览表单"
            is-primary
            :icon="CaretRightFilled"
            @click="visible.preview = true"
          />
        </div>
      </div>
    </div>
    <ALayoutSider
      v-model:collapsed="collapsed"
      :collapsible="collapsible"
      :collapsed-width="0"
      theme="light"
      :width="width"
      :trigger="null"
      class="relative"
    >
      <div class="h-full">
        <TreeViewer v-show="activeItem === 0" />
        <WidgetList v-show="activeItem === 1" />
        <SchemaViewer v-show="activeItem === 2" />
      </div>
      <div v-if="collapsible" ref="triggerEl" class="trigger-area">
        <div class="trigger-handle" :style="{ top: top + 'px' }" @click="() => setCollapsed()">
          <DoubleLeftOutlined v-show="!collapsed" />
          <DoubleRightOutlined v-show="collapsed" />
        </div>
      </div>
    </ALayoutSider>
  </div>

  <PreviewModal v-model:open="visible.preview" />
  <ApiModal v-model:open="visible.api" />
  <FuncModal v-model:open="visible.func" />
</template>

<script setup lang="ts">
import { toolbarItems, useToolbar } from './use-toolbar'
import { ApiOutlined, CaretRightFilled, FunctionOutlined } from '@ant-design/icons-vue'
import { useCollapse } from '../../_hooks'
import ToolbarItem from './toolbar-item.vue'
import ToolbatBtn from './toolbar-btn.vue'
import WidgetList from './widget-list/index.vue'
import TreeViewer from './tree-viewer/index.vue'
import SchemaViewer from './schema-viewer/index.vue'
import PreviewModal from '../previewer/index.vue'
import ApiModal from '../api-modal/index.vue'
import FuncModal from '../func-modal/index.vue'
import { HEADER_HEIGHT } from '@/utils/constants'
import type { PanelProps } from '../interface'

const { width = 220, collapsible = true } = defineProps<PanelProps>()

const activeItem = ref(1)

const triggerEl = ref<HTMLDivElement>()

const { collapsed, setCollapsed, top } = useCollapse(triggerEl, 100, HEADER_HEIGHT)
const { visible } = useToolbar()
</script>

<style lang="scss" scoped>
@use '@/styles/mixins.scss' as *;

.action-bar {
  width: 48px;
  padding: 8px 4px;
  height: 100%;
  background-color: var(--color-bg-container);
  border-right: 1px solid var(--color-border);
}
.trigger-handle {
  @include panel-collapse-handle(left);
}
.trigger-area {
  @include panel-collapse-trigger(left);
  &:hover {
    .trigger-handle {
      display: flex;
    }
  }
}
</style>
