import request from '@/utils/request'

export type TradeTreeNode = {
  id: string
  key: string
  name: string
  code: string
  pid: string
  sort: number
  children?: TradeTreeNode[]
}

export type TradeTreeVO = TradeTreeNode[]

export type AddTradeVO = {
  name: string
  code: string
  pid: string
}

const prefix = '/admin-api/system/trade'

export const getTradeTree = () => {
  return request.get<TradeTreeVO>({
    url: `${prefix}/trade-list_all`,
    params: {},
  })
}

export const getTradeInfo = (id: string) => {
  return request.get({
    url: `${prefix}/get`,
    params: {
      id: id,
    },
  })
}

export const addTradeInfo = (data: AddTradeVO) => {
  return request.post({
    url: `${prefix}/create`,
    data,
  })
}

export const deleteTradeInfo = (id: string) => {
  return request.delete({
    url: `${prefix}/delete`,
    params: {
      id,
    },
  })
}

export const modifyTradeInfo = (id: string, name: string) => {
  return request.put({
    url: `${prefix}/update`,
    data: {
      id,
      name,
    },
  })
}
