<template>
  <div class="setting-panel">
    <div class="tabs-container flex-center">
      <div
        v-for="item in tabs"
        :key="item"
        class="tab-item flex-center flex-1 p-2"
        :class="{ active: item === activeTab }"
        @click="activeTab = item"
      >
        {{ item }}
      </div>
    </div>

    <div class="h-full overflow-auto">
      <EScrollbar wrapper-class="h-full" class="h-full">
        <FormSettings v-show="activeTab === tabs[0]" class="p-4" />
        <WidgetSettings v-show="activeTab === tabs[1]" class="p-4 pb-12" />
      </EScrollbar>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import FormSettings from './form-settings.vue'
import WidgetSettings from './widget-settings.vue'

const tabs = ['表单配置', '组件配置']
const activeTab = ref(tabs[0])
</script>

<style lang="scss" scoped>
.setting-panel {
  background-color: var(--colorBgContainer);
}
.tabs-container {
  border-bottom: 1px solid var(--colorBorder);
  gap: 1px;
  background-color: var(--colorBorder);
}
.tab-item {
  background-color: var(--colorBgContainer);
  cursor: pointer;

  &.active {
    background-color: var(--colorPrimaryBg);
    color: var(--colorPrimary);
  }
}
</style>
