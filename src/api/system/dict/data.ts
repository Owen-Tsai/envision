import request from '@/utils/request'

export type DictData = {
  colorType?: string
  cssClass?: string
  createTime?: number
  dictType?: string
  id?: number
  value?: string | number
  label?: string
  remark?: string
  sort?: number
  status?: number
}

export type DictDataVO = Array<DictData>

export function getDictData(dictType: string) {
  return request.get<DictDataVO>({
    url: `/system/dict-data/dict-list?type=${dictType}`
  })
}
