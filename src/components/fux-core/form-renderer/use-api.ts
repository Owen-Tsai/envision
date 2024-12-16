import request from '@/utils/request'
import { set } from 'lodash-es'
import { emitter } from '@fusionx/utils'
import type { Ref } from 'vue'
import type { AppSchema } from '@/types/fux-core'

const useApi = (schema: Ref<AppSchema>, state: Ref<Record<string, any>>) => {
  const api = schema.value.form?.api

  if (api) {
    for (const uid in api) {
      const { params, url, dataIndex } = api[uid]

      request
        .get({
          url,
          params,
        })
        .then((res) => {
          set(state.value, dataIndex, res)
          emitter.emit('update:state')
        })
    }
  }
}

export default useApi
