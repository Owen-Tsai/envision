<template>
  <EScrollbar
    :thumb-width="8"
    :content-style="{ width: 'fit-content', minWidth: '100%' }"
    wrapper-class="sticky top-14 z-9"
    :auto-expand="false"
  >
    <div class="tabs-container">
      <ADropdown v-for="(tab, i) in tabsView.tabs.value" :key="i" trigger="contextmenu">
        <div class="tag" :class="{ active: isActive(tab[0]) }" @click="onTabClick(tab)">
          <span v-show="isActive(tab[0])" class="dot" />
          <span>{{ tab[1] }}</span>
          <CloseOutlined
            v-if="tab[0] !== '/index'"
            class="close-icon"
            @click.stop="tabsView.removeTab(tab[0])"
          />
        </div>

        <template #overlay>
          <AMenu class="context-menu">
            <AMenuItem @click="reload">重新载入</AMenuItem>
            <AMenuItem v-if="tab[0] !== '/index'" @click="tabsView.removeTab(tab[0])"
              >关闭当前页面</AMenuItem
            >
            <AMenuItem @click="tabsView.removeTabsAfter(i)">关闭右侧页面</AMenuItem>
            <AMenuItem @click="tabsView.removeOtherTabs(tab[0])">关闭其他页面</AMenuItem>
          </AMenu>
        </template>
      </ADropdown>
    </div>
  </EScrollbar>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import { CloseOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import useTabs from '@/hooks/use-tabs'

const router = useRouter()

const tabsView = useTabs()

const isActive = (tabKey: string) => {
  return router.currentRoute.value.fullPath === tabKey
}

const onTabClick = (tab: [string, string]) => {
  router.push(tab[0])
}

const reload = () => {
  const route = router.currentRoute.value
  router.replace(route)
}

watch(router.currentRoute, (val) => {
  tabsView.addTab(val.fullPath, val.meta.title || (val.name as string))
})
</script>

<style lang="scss" scoped>
.tabs-container {
  @apply w-full overflow-hidden flex whitespace-nowrap flex-nowrap px-4 py-1 gap-2;
  font-size: var(--fontSizeSM);
  background-color: var(--colorBgLayoutAlpha);
  border-bottom: 1px solid var(--colorBorderAlt);
  backdrop-filter: blur(8px);
  z-index: 20;

  .tag {
    background-color: var(--colorBgContainer);
    color: var(--colorTextSecondary);
    @apply px-2 py-1 inline-flex items-center gap-1 rounded relative cursor-pointer;

    .close-icon {
      font-size: 10px;
      @apply p-1 rounded;
      &:hover {
        background-color: var(--colorFillSecondary);
      }
      &:active {
        background-color: var(--colorFill);
      }
    }
    &.active {
      background-color: var(--colorPrimaryBg);
      color: var(--colorPrimaryText);
      border: 1px solid var(--colorPrimaryBorder);
      @apply pl-6;
    }
    .dot {
      @apply absolute w-2 h-2 top-1/2 left-2 -translate-y-1/2 rounded;
      background-color: var(--colorPrimaryText);
    }
  }
}

:global(.context-menu .ant-dropdown-menu-item) {
  font-size: 12px !important;
}
</style>
