import DefaultLayout from '@/layouts'
import MinimalLayout from '@/layouts/minimal/index.vue'
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
    path: '/workflow/:appId',
    name: 'WorkflowDesignRoot',
    component: MinimalLayout,
    redirect: 'WorkflowDesign',
    children: [
      {
        path: '',
        name: 'WorkflowDesign',
        component: () => import('@/views/workflow/index.vue'),
        meta: {
          title: '应用设计'
        }
      }
    ]
  },
  {
    path: '/',
    name: '__root__',
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
      },
      {
        path: '/infra/code-gen/edit',
        name: 'CodeGenEdit',
        component: () => import('@/views/infra/code-gen/edit/index.vue'),
        meta: {
          title: '代码生成配置'
        }
      }
    ]
  }
]
