import { ref, toRefs, type Ref } from 'vue'
import useDictStore from '@/stores/dict'
import { getDictData, type DictDataEntry } from '@/api/system/dict/data'

// todo: add field `useString` in dictType table
// it should be returned together with dict data

export const useDict = (...args: string[]) => {
  const dictStore = useDictStore()

  const result = args.map((dictType) => {
    if (!dictType) {
      return ref([])
    }
    const dict = dictStore.getDict(dictType)
    const data = ref(dict || []) as Ref<DictDataEntry[]>
    if (!dict) {
      getDictData(dictType).then((res) => {
        const convertedData: DictDataEntry[] = []
        res.forEach((item) => {
          const entry: DictDataEntry = { ...item }
          if (!item.useString) {
            // translate boolean
            if (item.value === 'true') {
              ;(entry.value as any) = true
            } else if (item.value === 'false') {
              ;(entry.value as any) = false
            }
            // translate number
            const intVal = parseInt(item.value)
            if (!isNaN(intVal)) {
              entry.value = intVal
            }
          }
          convertedData.push({ ...entry })
        })
        data.value = convertedData
        dictStore.setDict(dictType, convertedData)
      })
    }

    return data
  })

  return result
}

export default useDict
