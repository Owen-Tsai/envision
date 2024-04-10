import { ref, toRefs } from 'vue'
import { camelCase } from 'lodash'
import useDictStore from '@/stores/dict'
import { getDictData, type DictDataEntry } from '@/api/system/dict/data'

const useDict = (...args: string[]) => {
  const res = ref<Record<string, DictDataEntry[]>>({})
  const dictStore = useDictStore()

  return (() => {
    args.forEach((dictType) => {
      const key = camelCase(dictType)
      res.value[key] = []
      const dict = dictStore.getDict(dictType)
      if (dict) {
        res.value[key] = dict
      } else {
        getDictData(dictType).then((data) => {
          const convertedData: DictDataEntry[] = []
          data.forEach((item) => {
            const entry: DictDataEntry = { ...item }
            const intVal = parseInt(item.value)
            if (!isNaN(intVal)) {
              entry.value = intVal
            }
            convertedData.push({ ...entry })
          })
          res.value[key] = convertedData
          dictStore.setDict(dictType, convertedData)
        })
      }
    })
    return toRefs(res.value)
  })()
}

export default useDict
