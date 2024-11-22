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

export const getTradeTree = () => {
  return request.get<TradeTreeVO>({
    url: '/system/trade/trade-list_all',
    params: {}
  })
}

export const getTradeInfo = (id: string) => {
  return request.get({
    url: '/system/trade/get',
    params: {
      id: id
    }
  })
}

export const addTradeInfo = (data: AddTradeVO) => {
  return request.post({
    url: '/system/trade/create',
    data
  })
}

export const deleteTradeInfo = (id: string) => {
  return request.delete({
    url: '/system/trade/delete',
    params: {
      id
    }
  })
}

export const modifyTradeInfo = (id: string, name: string) => {
  return request.put({
    url: '/system/trade/update',
    data: {
      id,
      name
    }
  })
}
