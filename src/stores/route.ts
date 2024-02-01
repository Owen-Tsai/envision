import { ref, shallowRef } from 'vue'
import { defineStore } from 'pinia'
import DefaultLayout from '@/layouts/default/index.vue'
import { getAsyncRoutes } from '@/api/route'
import type { RouteRecordRaw } from 'vue-router'
import type { RouterMapVO } from '@/api/route'

const modules = import.meta.glob('../views/**/*.vue')

const loadComponentFrom = (path: string, folder: 'views' | 'layouts') => {
  let res
  for (const filename in modules) {
    const file = filename.split(`${folder}/`)[1].split('.vue')[0]
    if (file === path) {
      res = () => modules[path]()
    }
  }
  return res
}

const processRoutes = (routerMap: RouterMapVO): RouteRecordRaw[] => {
  const res: RouteRecordRaw[] = []

  routerMap.forEach((rawEntry) => {
    const entry: RouteRecordRaw = { ...rawEntry }
    if (rawEntry.children && rawEntry.children.length > 0) {
      entry.children = processRoutes(rawEntry.children)
    }
    if (rawEntry.path === '/') {
      entry.component = DefaultLayout
    } else {
      if (rawEntry.meta?.isCustomLayout) {
        if (rawEntry.children && rawEntry.children.length > 0) {
          entry.component = loadComponentFrom(rawEntry.component, 'layouts')
        } else {
          entry.component = loadComponentFrom(rawEntry.component, 'views')
        }
      } else {
        entry.component = loadComponentFrom(rawEntry.component, 'views')
      }
    }

    res.push(entry)
  })

  return res
}

export default defineStore('route', () => {
  const routerMap = ref<RouterMapVO>()
  const asyncRoutes = shallowRef<RouteRecordRaw[]>()

  const fetchRoutes = async () => {
    const res = await getAsyncRoutes()
    routerMap.value = res
    asyncRoutes.value = processRoutes(routerMap.value)
  }

  return {
    routerMap,
    asyncRoutes,
    fetchRoutes
  }
})
