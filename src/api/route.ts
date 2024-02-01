import request from '@/utils/request'
import type { RouteRecordRaw } from 'vue-router'

type RouteMapItem = RouteRecordRaw & {
  component: string
  children?: RouteMapItem[]
}

export type RouterMapVO = RouteMapItem[]

export function getAsyncRoutes() {
  return request.get<RouterMapVO>({
    url: '/getRouters'
  })
}
