import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { DictDataVO } from '@/api/system/dict/data'

export default defineStore('dict', () => {
  const dict = ref<Map<string, DictDataVO>>(new Map())

  const getDict = (type: string) => {
    return dict.value?.get(type)
  }

  const setDict = (type: string, entries: DictDataVO) => {
    dict.value?.set(type, entries)
  }

  const deleteDict = (type: string) => {
    dict.value?.delete(type)
  }

  const clearDict = () => {
    dict.value?.clear()
  }

  return {
    dict,
    getDict,
    setDict,
    deleteDict,
    clearDict
  }
})
