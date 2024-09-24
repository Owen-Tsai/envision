import { inject } from 'vue'
import request from '@/utils/request'
import { flatten, kebabCase } from 'lodash'
import emitter from '@/utils/emitter'
import { type EventType, type FormSchema } from '@/types/workflow/form'
import { formModelCtxKey, type FormModelContext } from '@/types/workflow'

/**
 * Hook for using actions of EFK
 * including
 *  1. handler: evaluated function callback for configured widget actions;
 *  2. eventBus: instance methods, which are bound to the exposed `handler`
 *     and can be called via `this` in FormCreator scope.
 *     Also, expose these functions in FormRenderer component.
 */
export const useActions = () => {
  const { schema, formData } = inject(formModelCtxKey) as FormModelContext
  const handler = (evt: EventType) => {}

  const eventBus = {
    getFormData: () => {
      return formData.value
    },
    getSchema: () => {
      return schema
    },
    show: (name: string) => {
      emitter.emit('widget:show', name)
    },
    hide: (name: string) => {
      emitter.emit('widget:hide', name)
    },
    getValue: (name: string) => {
      // should consider steps
      if (Array.isArray(formData.value)) {
        const records = flatten(formData.value)
        return (records as Record<string, any>)[name]
      } else {
        return (formData.value as Record<string, any>)[name]
      }
    },
    setValue: (name: string, value: any) => {
      if (schema.info.paginated) {
        const [tableName, fieldName] = name.split(':')
        const tableIdx = schema.info.tables.findIndex((table) => table.name === tableName)
        ;(formData.value as Array<Record<string, any>>)[tableIdx][fieldName] = value
      } else {
        ;(formData.value as Record<string, any>)[name] = value
      }
    },
    submit: () => {
      if (schema.info.paginated) {
        throw new Error('仅可在单表模式下调用 submit 提交')
      }
      const target = schema.info.tables[0]
      const api = `/applications/${kebabCase(target.name)}/create`

      request.post({ url: api, data: formData.value })
    }
  }

  return {
    handler,
    eventBus
  }
}
