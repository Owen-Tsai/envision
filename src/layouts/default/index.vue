<template>
  <ALayout>
    <Header class="header" />
    <ALayout>
      <ALayoutSider v-if="screen.lg" theme="light" :width="240" class="layout-sider px-1">
        <EScrollbar :auto-expand="false" throttle-type="none" wrapper-class="h-full" class="h-full">
          <div class="h-full overflow-y-auto pb-2">
            <Menu class="h-full" />
          </div>
        </EScrollbar>
      </ALayoutSider>
      <ALayoutContent>
        <TagsContainer />
        <RouterView />
      </ALayoutContent>
    </ALayout>
  </ALayout>
</template>

<script lang="ts" setup>
import useBreakpoint from '@/hooks/use-breakpoint'
import Header from './header.vue'
import Menu from './menu.vue'
import TagsContainer from './tabs-container.vue'

const screen = useBreakpoint()
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
</style>
