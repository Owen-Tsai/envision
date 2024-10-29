import request from '@/utils/request'
import type { Ref } from 'vue'
import type { AppSchema } from '@/types/fux-core'

const useApi = (schema: Ref<AppSchema>, state: Ref<Record<string, any>>) => {
  console.log(schema.value)
  const api = schema.value.form?.api

  if (api) {
    for (const uid in api) {
      const { params, url, dataIndex } = api[uid]

      request
        .get({
          url,
          params
        })
        .then((res) => {
          state.value[dataIndex] = res.data
        })
    }
  }
}

export default useApi
