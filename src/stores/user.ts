import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import { getToken, removeToken, setToken } from '@/utils/auth'
import { generateRoutes } from '@/utils/route'
import {
  login as doLogin,
  logout as doLogout,
  getPermissionInfo,
  type LoginDTO,
  type LoginVO,
  type PermissionInfoVO
} from '@/api/login'
import type { RouteRecordRaw } from 'vue-router'

import defaultAvatar from '~img/default-avatar.png'

export default defineStore('user', () => {
  const token = ref(getToken())
  const id = ref<number>()
  const isUserInfoSet = ref(false)
  const user = ref<User | undefined>()
  const roles = ref<string[]>([])
  const permissions = ref<string[]>([])
  const routerMap = ref<PermissionInfoVO['menus']>()
  const routes = shallowRef<RouteRecordRaw[]>()

  const login = (loginInfo: LoginDTO) => {
    const { username, password, captchaVerification, tenantName } = loginInfo

    return new Promise<LoginVO>((resolve, reject) => {
      doLogin({
        username: username.trim(),
        password,
        tenantName,
        captchaVerification
      })
        .then((data) => {
          const { accessToken, refreshToken, userId } = data
          setToken({ accessToken, refreshToken })
          token.value = accessToken
          id.value = userId
          resolve(data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  const getUserInfo = () => {
    return new Promise<PermissionInfoVO>((resolve, reject) => {
      getPermissionInfo()
        .then((res) => {
          const { user: u, roles: rs, permissions: ps, menus } = res

          roles.value = rs
          permissions.value = ps
          routerMap.value = menus
          user.value = {
            ...u,
            avatar: u.avatar || defaultAvatar
          }

          isUserInfoSet.value = true
          routes.value = generateRoutes(menus)
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  const logout = () => {
    return new Promise((resolve, reject) => {
      doLogout()
        .then(() => {
          token.value = ''
          roles.value = []
          permissions.value = []
          removeToken()
          resolve(true)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  return {
    id,
    isUserInfoSet,
    roles,
    permissions,
    routes,
    token,
    login,
    logout,
    getUserInfo,
    user
  }
})
