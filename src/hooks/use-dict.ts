import { ref, type Ref } from 'vue'
import useDictStore from '@/stores/dict'
import { getDictData, type DictDataEntry } from '@/api/system/dict/data'

const useDict = (...args: string[]) => {
  const dictStore = useDictStore()

  const result = args.map((dictType) => {
    const dict = dictStore.getDict(dictType)
    const data = ref(dict || []) as Ref<DictDataEntry[]>
    if (!dict) {
      getDictData(dictType).then((res) => {
        const convertedData: DictDataEntry[] = []
        res.forEach((item) => {
          const entry: DictDataEntry = { ...item }
          const intVal = parseInt(item.value)
          if (!isNaN(intVal)) {
            entry.value = intVal
          }
          convertedData.push({ ...entry })
        })
        data.value = convertedData
      })
    }

    return data
  })

  return result
}

export default useDict
