<template>
  <App>
    <AConfigProvider dropdown-match-select-width :locale="zhCN" :theme="{ algorithm }">
      <RouterView />
    </AConfigProvider>
  </App>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { App, theme as antTheme } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import useAppStore from '@/stores/app'

const { theme } = storeToRefs(useAppStore())

const { darkAlgorithm, defaultAlgorithm } = antTheme
const algorithm = computed(() => (theme.value === 'dark' ? darkAlgorithm : defaultAlgorithm))
</script>
