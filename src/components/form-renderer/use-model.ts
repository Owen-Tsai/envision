import { computed, inject } from 'vue'
import { formDataKey, type FormDataCtx, type ParentFormPropType } from '@/types/workflow/form'

const useModel = (field: string, parentFormConfig?: ParentFormPropType) => {
  const ctx = inject<FormDataCtx>(formDataKey)

  const model = computed({
    get: () => {
      if (ctx) {
        if (parentFormConfig) {
          return ctx.formData.value[parentFormConfig.field][parentFormConfig.index][field]
        } else {
          return ctx.formData.value[field]
        }
      }

      return undefined
    },
    set: (val) => {
      if (ctx) {
        if (parentFormConfig) {
          ctx.formData.value[parentFormConfig.field][parentFormConfig.index][field] = val
        } else {
          ctx.formData.value[field] = val
        }
      }
    }
  })

  return {
    model
  }
}

export default useModel
