import useStorage from '@/hooks/use-storage'

type Token = {
  accessToken: string
  refreshToken: string
}

const storage = useStorage()

const tokenKey = 'access-token'
const refreshTokenKey = 'refresh-token'

// tenant, which is a useless feature we probably will never use
const tenantIdKey = 'tenant-id'
const tenantNameKey = 'tenant-name'

export const getToken = (): string => {
  return storage.get(tokenKey)
}

export const getRefreshToken = (): string => {
  return storage.get(refreshTokenKey)
}

export const setToken = (token: Token) => {
  storage.set(tokenKey, token.accessToken)
  storage.set(refreshTokenKey, token.refreshToken)
}

export const removeToken = () => {
  storage.delete(tokenKey)
  storage.delete(refreshTokenKey)
}

export const getFormattedToken = (raw?: string) => {
  const token = raw || getToken()
  if (!token) return null
  return `Bearer ${token}`
}

export const getTenantName = (): string => {
  return storage.get(tenantNameKey)
}

export const setTenantName = (username: string) => {
  storage.set(tenantNameKey, username, { exp: 30 * 24 * 3600 })
}

export const removeTenantName = () => {
  storage.delete(tenantNameKey)
}

export const getTenantId = (): string => {
  return storage.get(tenantIdKey)
}

export const setTenantId = (username: string) => {
  storage.set(tenantIdKey, username)
}

export const removeTenantId = () => {
  storage.delete(tenantIdKey)
}
