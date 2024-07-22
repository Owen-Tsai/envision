<template>
  <ALayout>
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
import { RouterView } from 'vue-router'

const viewCache = useViewCache()

const routerAlive = ref(true)
</script>
