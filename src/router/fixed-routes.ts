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
      title: '登录',
    },
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
        // component: () => import('@/views/workflow/index.vue'),
        component: () => import('@/views/app-design/index.vue'),
        meta: {
          title: '应用设计',
        },
      },
    ],
  },
  {
    path: '/app-design',
    name: 'AppDesignRoot',
    component: MinimalLayout,
    redirect: 'AppDesign',
    children: [
      {
        path: '',
        name: 'AppDesign',
        component: () => import('@/views/app-design/index.vue'),
        meta: {
          title: '应用设计',
        },
      },
    ],
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
          title: '首页',
          keepAlive: true,
        },
      },
      {
        path: '/system/dict/data/:type',
        name: 'DictData',
        component: () => import('@/views/system/dict/data/index.vue'),
        meta: {
          title: '字典数据',
          activeMenuKey: '/system/dict',
          keepAlive: true,
        },
      },
      {
        path: '/infra/code-gen/edit',
        name: 'CodeGenEdit',
        component: () => import('@/views/infra/code-gen/edit/index.vue'),
        meta: {
          title: '代码生成配置',
          activeMenuKey: '/infra/code-gen',
        },
      },
      {
        path: '/business/:appId/audit',
        name: 'BusinessAuditList',
        component: () => import('@/views/audit/list/index.vue'),
        meta: {
          title: '应用审核',
        },
      },
      {
        path: '/business2/:appId/audit',
        name: 'BusinessAuditList2',
        component: () => import('@/views/business/audit/index.vue'),
        meta: {
          title: '应用审核',
        },
      },
      {
        path: '/business/:appId/audit/form',
        name: 'BusinessAuditForm',
        component: () => import('@/views/audit/detail/index.vue'),
        meta: {
          title: '应用审核',
        },
      },
      {
        path: '/business2/:appId/audit/form',
        name: 'BusinessAuditForm2',
        component: () => import('@/views/business/audit/form.vue'),
        meta: {
          title: '应用审核',
        },
      },
      {
        path: '/_demo',
        name: 'DEMO',
        component: () => import('@/views/_demo/index.vue'),
        meta: {
          title: '应用审核',
        },
      },
    ],
  },
]
