<template>
  <ALayout>
    <ALayoutContent>
      <RouterView v-if="routerAlive">
        <template #default="{ Component, route }">
          <KeepAlive :include="[...keepsList]">
            <component :is="Component" :key="route.fullPath" />
          </KeepAlive>
        </template>
      </RouterView>
    </ALayoutContent>
  </ALayout>
</template>

<script lang="ts" setup>
import useViewCache from '@/stores/view-cache'

const { keepsList } = storeToRefs(useViewCache())

const routerAlive = ref(true)
</script>
