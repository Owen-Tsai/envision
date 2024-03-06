import nProgress from 'nprogress'
import { message } from 'ant-design-vue'
import { reloginHint } from '@/utils/request/service'
import { getToken } from '@/utils/auth'
import useUserStore from '@/stores/user'
import useAppStore from '@/stores/app'
import router from './index'

const guardWhiteList = ['/login', '/register']

router.beforeEach((to, from, next) => {
  const { setTitle } = useAppStore()
  const userStore = useUserStore()
  nProgress.start()
  to.meta.title && setTitle(to.meta.title)
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      nProgress.done()
    } else if (guardWhiteList.includes(to.path)) {
      next()
    } else {
      if (!userStore.isUserInfoSet) {
        reloginHint.show = true
        userStore
          .getUserInfo()
          .then(() => {
            reloginHint.show = false
            userStore.routes?.forEach((record) => {
              if (!record.path.includes('http')) {
                router.addRoute(record)
              }
            })

            next({ ...to, replace: true })
          })
          .catch((err) => {
            userStore.logout().then(() => {
              message.error(err)
              next({ path: '/' })
            })
          })
      } else {
        next()
      }
    }
  } else {
    if (guardWhiteList.includes(to.path)) {
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`)
      nProgress.done()
    }
  }
})

router.afterEach(() => nProgress.done())
