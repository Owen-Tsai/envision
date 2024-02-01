import useStorage from '@/hooks/use-storage'

const storage = useStorage()

const tokenKey = 'access-token'

export const getToken = (): string => {
  return storage.get(tokenKey)
}

export const setToken = (val: string) => {
  storage.set(tokenKey, val)
}

export const removeToken = () => {
  storage.delete(tokenKey)
}

export const getFormattedToken = (raw?: string) => {
  const token = raw || getToken()
  if (!token) return null
  return `Bearer ${token}`
}
