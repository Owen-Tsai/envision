import request from '@/utils/request'

type Item = {
  createBy: string
  createTime: string
  noticeContent: string
  noticeTitle: string
  noticeId: number
  noticeType: string
  status: string
}

type ListVO = {
  rows: Item[]
}

export function list(params: CommonQueryParams) {
  return request.getRaw<ListVO>({
    url: '/system/notice/list',
    params
  })
}

export function shortList() {
  return request.getRaw<ListVO>({
    url: '/system/notice/list?pageNum=1&pageSize=5'
  })
}
