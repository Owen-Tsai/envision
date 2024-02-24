import type { DictDataVO } from '@/api/system/dict/data'
import type { SelectProps } from 'ant-design-vue'

export const desensitizePhoneNumber = (str: string) => {
  const start = str.substring(0, 3)
  const end = str.substring(7)

  return `${start}****${end}`
}

export const dictDataToOptions = (dictData: DictDataVO): SelectProps['options'] => {
  return dictData.map((entry) => ({
    label: entry.dictLabel,
    value: entry.dictValue
  }))
}
