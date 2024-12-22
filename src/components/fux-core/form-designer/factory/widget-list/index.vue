<template>
  <div class="h-full">
    <div class="search-box relative">
      <SearchOutlined class="icon" />
      <input class="input" v-model="searchText" placeholder="输入组件名称进行过滤" />
      <CloseCircleFilled class="close" :class="{ hidden: !searchText }" @click="searchText = ''" />
    </div>
    <Scrollbar wrapper-class="h-full" class="h-full" content-class="overflow-x-hidden">
      <Draggable
        :list="filteredList"
        :group="{ name: 'fux', pull: 'clone', put: false }"
        :sort="false"
        item-key="type"
        :clone="cloneWidget"
        :swap-threshold="0.1"
        class="list-wrapper"
      >
        <template #item="{ element }: { element: Widget; index: number }">
          <Item :widget="element" />
        </template>
      </Draggable>
    </Scrollbar>
  </div>
</template>

<script setup lang="ts">
import Draggable from 'vuedraggable'
import initWidgetConfig from '@/components/fux-core/_utils/initial-widget-config'
import { cloneDeep } from 'lodash-es'
import { generateId } from '@fusionx/utils'
import Item from './item.vue'
import type { Widget, WidgetMap } from '@/types/fux-core/form'

const searchText = ref('')

const filteredList = computed(() => {
  return Object.keys(initWidgetConfig)
    .map((key) => initWidgetConfig[key as keyof WidgetMap]!)
    .filter((item) => {
      return item.name.includes(searchText.value) || item.type.includes(searchText.value)
    })
})

const cloneWidget = (widget: Widget) => {
  const id = generateId()
  const ret = cloneDeep(widget)
  delete ret.icon
  ret.uid = id
  return ret
}
</script>

<style lang="scss" scoped>
.close {
  font-size: var(--font-size-sm);
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-tertiary);
  cursor: pointer;
}
.input {
  border: none;
  outline: none;
  height: 40px;
  border-bottom: 1px solid var(--color-border-secondary);
  width: 100%;
  padding: 0 32px;
}
.icon {
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text);
}
.list-wrapper {
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding-bottom: 56px;
}
.search-box input {
  background-color: transparent;
}
</style>
