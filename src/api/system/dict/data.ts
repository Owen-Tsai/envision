import request from '@/utils/request'

export type DictData = {
  cssClass?: string
  dictCode: number
  dictLabel: string
  dictSort: number
  dictType: string
  dictValue: string
  listClass?: string
  status?: '0' | '1'
}

export type DictDataVO = Array<DictData>

export function getDictData(dictType: string) {
  return request.get<DictDataVO>({
    url: `/system/dict/data/type/${dictType}`
  })
}
