import request from '@/utils/request'
import type { Ref } from 'vue'
import type { FormSchema } from '@/types/fux-core'

const useApi = (schema: FormSchema, $state: Ref<Record<string, any>>) => {
  const api = schema.api

  if (api) {
    for (const uid in api) {
      const { params, url, dataIndex } = api[uid]

      request
        .get({
          url,
          params
        })
        .then((res) => {
          $state.value[dataIndex] = res.data
        })
    }
  }
}

export default useApi
