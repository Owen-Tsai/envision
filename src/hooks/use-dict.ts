import { ref, toRefs } from 'vue'
import { camelCase } from 'lodash'
import useDictStore from '@/stores/dict'
import { getDictData, type DictDataVO } from '@/api/system/dict/data'

const useDict = (...args: string[]) => {
  const res = ref<Record<string, DictDataVO>>({})
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
          data.forEach((entry) => {
            entry.value = parseInt(entry.value + '')
          })
          res.value[key] = data
          dictStore.setDict(dictType, data)
        })
      }
    })
    return toRefs(res.value)
  })()
}

export default useDict
