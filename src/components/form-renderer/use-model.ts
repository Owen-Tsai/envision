import { computed, inject } from 'vue'
import { formDataKey, type FormDataCtx } from '@/types/workflow'

const useModel = (field: string) => {
  const ctx = inject<FormDataCtx>(formDataKey)

  const model = computed({
    get: () => (ctx ? ctx.formData.value[field] : undefined),
    set: (val) => {
      if (ctx) {
        ctx.formData.value[field] = val
      }
    }
  })

  return {
    model
  }
}

export default useModel
