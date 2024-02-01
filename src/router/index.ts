import { createRouter, createWebHistory } from 'vue-router'
import { fixedRoutes } from './fixed-routes'

const router = createRouter({
  history: createWebHistory(),
  routes: fixedRoutes
})

export default router
