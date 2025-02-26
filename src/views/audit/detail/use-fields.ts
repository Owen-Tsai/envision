import { set } from 'lodash-es'
import type { AppSchema } from '@/types/fux-core'
import FormRenderer from '@/components/fux-core/form-renderer/index.vue'

const useFields = (
  appSchema: Ref<AppSchema | undefined>,
  formRenderer: Ref<InstanceType<typeof FormRenderer> | null>,
) => {
  const { query } = useRoute()
  const taskDefKey = query.taskDefKey

  const getFields = () => {
    if (!formRenderer.value) return {}
    const allFields = appSchema.value?.flow.nodes.find((node) => node.uid === taskDefKey)?.props
      .fields
    // console.log(allFields)
    const editFields = allFields.filter((field) => field.config == 'edit')
    // console.log(editFields)
    const fieldNameArr: string[] = []
    editFields.forEach((field) => {
      fieldNameArr.push(field.name as string)
    })
    const fields: Record<string, any> = {}
    if (fieldNameArr.length > 0) {
      console.log(formRenderer.value.getFormData())
      const originFormData = formRenderer.value.getFormData().value
      const tablesLength = appSchema.value!.info.tables.length
      const formData: Record<string, any> = {}
      if (tablesLength > 1) {
        const tabs = formRenderer.value.getStepWidget()
        for (let i = 0; i < tablesLength; i++) {
          if (tabs && !tabs.props.children[i].widgets.some((e) => e.type == 'dataTable')) {
            const datakeys = Object.keys(originFormData[i])
            datakeys.forEach((keyName) => {
              set(formData, keyName, originFormData[i][keyName])
            })
          }
        }
      } else {
        const datakeys = Object.keys(originFormData)
        datakeys.forEach((keyName) => {
          set(formData, keyName, originFormData[keyName])
        })
      }
      // console.log(formData)
      fieldNameArr.forEach((fieldName) => {
        const tableNameId = fieldName.split(':')[0] + ':id'
        // console.log(tableNameId)
        if (!fields.hasOwnProperty(tableNameId)) {
          set(fields, tableNameId, formData[tableNameId])
        }
        set(fields, fieldName, formData[fieldName])
      })
      // console.log(fields)
      return fields
    }
    return fields
  }

  return { getFields }
}

export default useFields
