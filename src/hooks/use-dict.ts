import useDictStore from '@/stores/dict'
import { getDictData, type DictDataEntry } from '@/api/system/dict/data'
import type { Ref } from 'vue'

export function useDict(arg?: string | undefined, ...rest: string[]): Ref<DictDataEntry[]>[]

export function useDict(arg: string | undefined, ...rest: string[]) {
  if (arg === undefined) {
    return [[]]
  }

  const args = [arg, ...rest]

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
