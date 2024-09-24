import { computed, inject } from 'vue'
import { fieldCtxConfigKey, type FieldCtxConfig } from '@/types/workflow/form'
import { formModelCtxKey, type FormModelContext } from '@/types/workflow'

const useModel = (field: string) => {
  const ctx = inject<FormModelContext>(formModelCtxKey)
  const fieldCtx = inject<FieldCtxConfig>(fieldCtxConfigKey)
  const { step, parentField, formData } = fieldCtx || {}

  const model = computed({
    get: () => {
      if (formData) {
        return formData[field]
      }
      if (ctx) {
        const formData = ctx.formData as any
        const info = ctx.schema.info
        if (parentField) {
          return formData.value[parentField.field][parentField.index][field]
        } else {
          if (info.paginated) {
            return formData.value[step as number]?.[field]
          } else {
            return formData.value[field]
          }
        }
      }

      return undefined
    },
    set: (val) => {
      if (formData) {
        formData[field] = val
      } else if (ctx) {
        const info = ctx.schema.info
        if (parentField) {
          ;(ctx.formData.value as any)[parentField.field][parentField.index][field] = val
        } else {
          if (info.paginated) {
            console.log((ctx.formData.value as any[0]) === (ctx.formData.value as any[1]))
            ;(ctx.formData.value as any)[step as number][field] = val
          } else {
            ;(ctx.formData.value as any)[field] = val
          }
        }
      }
    }
  })

  return {
    model
  }
}

export default useModel
