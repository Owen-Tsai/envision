<template>
  <ALayout>
    <Header class="header" />
    <ALayout>
      <ALayoutSider
        v-if="screen.lg"
        theme="light"
        :width="240"
        v-model:collapsed="collapsed"
        :collapsed-width="56"
        class="layout-sider px-1"
      >
        <EScrollbar :auto-expand="false" :throttle-wait="50" wrapper-class="h-full" class="h-full">
          <div class="h-full overflow-y-auto pb-2 relative">
            <Menu />
          </div>
        </EScrollbar>
        <AButton class="menu-btn" type="text" size="small" @click="toggle()">
          <template #icon>
            <MenuUnfoldOutlined v-if="collapsed" />
            <MenuFoldOutlined v-else />
          </template>
        </AButton>
      </ALayoutSider>
      <ALayoutContent>
        <TagsContainer />
        <RouterView />
      </ALayoutContent>
    </ALayout>
  </ALayout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useToggle } from '@vueuse/core'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
import useBreakpoint from '@/hooks/use-breakpoint'
import Header from './header.vue'
import Menu from './menu.vue'
import TagsContainer from './tabs-container.vue'

const screen = useBreakpoint()

const collapsed = ref(false)
const toggle = useToggle(collapsed)
</script>

<style lang="scss" scoped>
$header-height: 56px;

.header {
  height: $header-height;
}
.layout-sider {
  position: sticky !important;
  box-sizing: content-box !important;
  height: calc(100vh - $header-height);
  left: 0;
  top: $header-height;
  background-color: var(--colorBgAlt);
}
.menu-btn {
  @apply absolute right-2 bottom-4;
  background-color: var(--colorFillSecondary);
  color: var(--colorTextSecondary);
}
</style>
