import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getToken, removeToken, setToken } from '@/utils/auth'
import {
  login as doLogin,
  logout as doLogout,
  getInfo,
  type LoginDTO,
  type LoginVO,
  type UserInfoVO
} from '@/api/login'

import defaultAvatar from '~img/default-avatar.png'

export default defineStore('user', () => {
  const token = ref(getToken())
  const id = ref<number>()
  const name = ref<string>()
  const avatar = ref<string>()
  const roles = ref<string[]>([])
  const permissions = ref<string[]>([])
  const deptName = ref<string>()
  const phoneNumber = ref<string>()

  const login = (loginInfo: LoginVO) => {
    const { username, password, captchaVerification, tenantName } = loginInfo

    return new Promise<LoginVO>((resolve, reject) => {
      doLogin({
        username: username.trim(),
        password,
        tenantName,
        captchaVerification
      })
        .then((data) => {
          const { accessToken, refreshToken } = data
          setToken({ accessToken, refreshToken })
          token.value = t
          resolve(data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  const getUserInfo = () => {
    return new Promise<UserInfoVO>((resolve, reject) => {
      getInfo()
        .then((res) => {
          const { user, roles: rs, permissions: ps } = res

          const userAvatar =
            user.avatar === '' || !user.avatar
              ? defaultAvatar
              : import.meta.env.VITE_APP_BASE_API + user.avatar

          if (rs && rs.length > 0) {
            roles.value = rs
            permissions.value = ps as string[]
          } else {
            roles.value = ['ROLE_DEFAULT']
          }

          name.value = user.userName
          id.value = user.userId
          avatar.value = userAvatar
          deptName.value = user.dept.deptName
          phoneNumber.value = user.phonenumber
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
    name,
    avatar,
    roles,
    deptName,
    permissions,
    token,
    phoneNumber,
    login,
    logout,
    getUserInfo
  }
})
