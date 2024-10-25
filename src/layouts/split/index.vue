<template>
  <ALayout>
    <ALayoutSider
      v-if="screen.lg"
      theme="dark"
      :width="240"
      v-model:collapsed="collapsed"
      :collapsed-width="56"
      class="layout-sider px-1"
    >
      <div class="title px-1 py-4" :class="{ 'justify-center': collapsed }">
        <img class="logo" :src="logo" alt="FusionX Logo" />
        <h1 v-show="!collapsed">{{ title }}</h1>
      </div>
      <Scrollbar
        :auto-expand="false"
        :throttle-wait="50"
        wrapper-class="h-full"
        class="flex-grow h-full"
      >
        <div class="h-full overflow-y-auto pb-2">
          <Menu />
        </div>
      </Scrollbar>
    </ALayoutSider>
    <ALayout>
      <Header
        v-model:menu-collapsed="collapsed"
        @update:menu-collapsed="toggle"
        @show-drawer="drawerVisible = true"
      />
      <TagsContainer />
      <RouterView v-if="routerAlive">
        <template #default="{ Component, route }">
          <KeepAlive :include="[...viewCache.keepsList]">
            <component :is="Component" :key="route.fullPath" />
          </KeepAlive>
        </template>
      </RouterView>
    </ALayout>

    <ADrawer
      v-model:open="drawerVisible"
      placement="left"
      :closeable="false"
      :body-style="{ padding: 0 }"
      :width="240"
      :header-style="{ display: 'none' }"
    >
      <ALayout>
        <ALayoutSider
          theme="dark"
          :width="240"
          class="layout-sider px-1 !h-auto !min-h-screen !pb-0"
        >
          <div class="title px-1 py-4" :class="{ 'justify-center': collapsed }">
            <img class="logo" :src="logo" alt="FusionX Logo" />
            <h1 v-show="!collapsed">{{ title }}</h1>
          </div>
          <Menu />
        </ALayoutSider>
      </ALayout>
    </ADrawer>
  </ALayout>
</template>

<script setup lang="ts">
import { ref, nextTick, provide } from 'vue'
import logo from '~img/company-logo.svg'
import { useToggle } from '@vueuse/core'
import useBreakpoint from '@/hooks/use-breakpoint'
import useViewCache from '@/stores/view-cache'
import Header from './header.vue'
import Menu from './menu.vue'
import TagsContainer from './tabs-container.vue'
import { RouterView } from 'vue-router'

const screen = useBreakpoint()

const collapsed = ref(false)
const drawerVisible = ref(false)
const toggle = useToggle(collapsed)

const viewCache = useViewCache()

const routerAlive = ref(true)

// will be provided to the tabsContainer
const reload = () => {
  routerAlive.value = false

  nextTick(() => (routerAlive.value = true))
}

provide('layoutContext', reload)

const title = import.meta.env.VITE_APP_TITLE
</script>

<style lang="scss" scoped>
@use '@/styles/mixins.scss' as *;

.logo {
  @apply size-30px;
  border-radius: 6px;
  user-select: none;
  -webkit-user-drag: none;
}
.layout-sider {
  position: sticky !important;
  box-sizing: border-box !important;
  height: 100vh;
  left: 0;
  top: 0;
  padding-bottom: 64px;
  &:deep(ul.ant-menu) {
    border-right: 0 !important;
  }
  &:deep(.ant-layout-sider-children) {
    display: flex;
    flex-direction: column;
  }
}
.title {
  @apply flex items-center gap-2 flex-shrink-0;

  h1 {
    @apply mb-0 font-bold;
    @inlclude titleFont;
    font-size: var(--fontSizeLG);
    color: rgba(255, 255, 255, 0.85); //!override text color in darkened sider
  }
}
</style>
