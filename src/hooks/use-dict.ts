import { ref, toRefs } from 'vue'
import useDictStore from '@/stores/dict'
import { getDictData, type DictDataVO } from '@/api/system/dict/data'

const useDict = (...args: string[]) => {
  const res = ref<Record<string, DictDataVO>>({})
  const dictStore = useDictStore()

  return (() => {
    args.forEach((dictType) => {
      res.value[dictType] = []
      const dict = dictStore.getDict(dictType)
      if (dict) {
        res.value[dictType] = dict
      } else {
        getDictData(dictType).then((data) => {
          res.value[dictType] = data
          dictStore.setDict(dictType, data)
        })
      }
    })
    return toRefs(res.value)
  })()
}

export default useDict
