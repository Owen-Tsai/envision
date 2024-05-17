<template>
  <ALayout>
    <Header />
    <ALayoutContent>
      <RouterView v-if="routerAlive">
        <template #default="{ Component, route }">
          <KeepAlive :include="[...viewCache.keepsList]">
            <component :is="Component" :key="route.fullPath" />
          </KeepAlive>
        </template>
      </RouterView>
    </ALayoutContent>
  </ALayout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import useViewCache from '@/stores/view-cache'
import Header from './header.vue'
import { RouterView } from 'vue-router'

const viewCache = useViewCache()

const routerAlive = ref(true)
</script>

<style lang="scss" scoped>
$header-height: 56px;

.header {
  height: $header-height;
}
.menu-btn {
  @apply absolute right-2 bottom-4;
  background-color: var(--colorFillSecondary);
  color: var(--colorTextSecondary);
}
</style>
