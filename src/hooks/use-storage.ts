import Cache from 'web-storage-cache'

const useStorage = (storage: 'localStorage' | 'sessionStorage' = 'localStorage') => {
  const cache = new Cache({
    storage
  })

  return cache
}

export default useStorage
