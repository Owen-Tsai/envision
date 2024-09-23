import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DataSourceInfo } from '@/types/workflow'

export default defineStore('workflow', () => {
  const appId = ref<string | null>(null)
  const dataSource = ref<DataSourceInfo | null>(null)

  const saveDataSource = (id: string, info: DataSourceInfo) => {
    dataSource.value = info
    appId.value = id
  }

  const getDataSource = (id: string) => {
    return id === appId.value ? dataSource.value : null
  }

  return {
    saveDataSource,
    getDataSource,
    dataSource
  }
})
