<template>
  <ALayoutSider
    v-model:collapsed="collapsed"
    :collapsible="collapsible"
    :collapsed-width="1"
    :trigger="null"
    theme="light"
    :width="width"
  >
    <div class="h-full">
      <div class="flex items-center">
        <div
          v-for="tab in tabs"
          :key="tab.value"
          class="tab"
          :class="{ active: tab.value === activeKey }"
          @click="activeKey = tab.value"
        >
          {{ tab.label }}
        </div>
      </div>
      <Scrollbar
        wrapper-class="settings h-full"
        class="h-full"
        content-class="overflow-x-hidden"
        direction="vertical"
      >
        <div class="p-4">
          <FormSettings v-show="activeKey === 1" />
          <WidgetSettings v-show="activeKey === 0" />
        </div>
      </Scrollbar>
    </div>
    <div v-if="collapsible" ref="triggerEl" class="trigger-area" :class="{ collapsed }">
      <div class="trigger-handle" :style="{ top: top + 'px' }" @click="() => setCollapsed()">
        <DoubleLeftOutlined v-show="collapsed" />
        <DoubleRightOutlined v-show="!collapsed" />
      </div>
    </div>
  </ALayoutSider>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons-vue'
import { useCollapse } from '../../_hooks'
import useSettings from './use-settings'
import FormSettings from './form-settings.vue'
import WidgetSettings from './widget-settings.vue'
import { HEADER_HEIGHT } from '@/utils/constants'
import type { PanelProps } from '../interface'

const { width = 220, collapsible = true } = defineProps<PanelProps>()
const triggerEl = ref<HTMLDivElement>()

const { collapsed, setCollapsed, top } = useCollapse(triggerEl, 100, HEADER_HEIGHT)
const { activeKey, tabs } = useSettings()
</script>

<style lang="scss" scoped>
@use '@/styles/mixins.scss' as *;

.trigger-handle {
  @include panel-collapse-handle(right);
}
.trigger-area {
  @include panel-collapse-trigger(right);
  &.collapsed {
    left: -8px;
  }
  &:hover {
    .trigger-handle {
      display: flex;
    }
  }
}
.tab {
  width: 50%;
  height: 40px;
  cursor: pointer;
  border-bottom: 1px solid var(--color-border);
  overflow: hidden;
  @apply flex-center;

  &.active {
    background-color: var(--color-primary-bg);
    color: var(--color-primary);
    font-weight: bold;
  }
  &:not(:last-child) {
    border-right: 1px solid var(--color-border-secondary);
  }
}
.settings {
  height: calc(100% - 40px);
}
</style>
