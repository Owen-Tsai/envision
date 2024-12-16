import { ref, type Ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'

export type UseRequestOptions<T> = {
  /**
   * Whether or not the request should be executed immediately
   */
  immediate?: boolean
  /**
   * debounce time between two executions (in ms)
   */
  debounceTime?: number
  /**
   * Custom function to transform the response data once succeed
   * @param raw response data
   * @returns transformed response data
   */
  transformer?: (raw: Ref<T | undefined>) => T | undefined
  onSuccess?: (data: T) => void
  onError?: (err: unknown) => void
  onFinish?: () => void
}

const useRequest = <T>(service: () => Promise<T>, options?: UseRequestOptions<T>) => {
  const pending = ref(false)
  const data = ref<T | undefined>(undefined) as Ref<T | undefined>
  const error = ref<unknown | null>(null) as Ref<unknown | null>

  options = options || {}

  const { debounceTime, immediate, transformer, onError, onFinish, onSuccess } = options

  const execute = async () => {
    pending.value = true

    try {
      const response = await service()
      if (transformer) {
        data.value = transformer(data)
      } else {
        data.value = response
      }

      if (onSuccess) {
        onSuccess(response)
      }
    } catch (err) {
      error.value = err as Error
      if (onError) {
        onError(err)
      }
    } finally {
      pending.value = false
      if (onFinish) {
        onFinish()
      }
    }
  }

  if (immediate) {
    execute()
  }

  const debouncedExecute = useDebounceFn(execute, debounceTime)

  return {
    execute: debounceTime ? debouncedExecute : execute,
    pending,
    data,
    error,
  }
}

export default useRequest
