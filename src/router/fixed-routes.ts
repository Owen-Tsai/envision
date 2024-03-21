import DefaultLayout from '@/layouts/default/index.vue'
import type { RouteRecordRaw } from 'vue-router'

export const fixedRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      hidden: true,
      title: '登录'
    }
  },
  {
    path: '/',
    component: DefaultLayout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/index/index.vue'),
        meta: {
          title: '首页'
        }
      },
      {
        path: '/system/dict/data/:type',
        name: 'DictData',
        component: () => import('@/views/system/dict/data/index.vue'),
        meta: {
          title: '字典数据'
        }
      }
    ]
  }
]
