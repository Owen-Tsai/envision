<template>
  <div class="audit-view">
    <AuditEntry
      v-for="widget in schema.form.widgets"
      :key="widget.uid"
      :config="widget"
      :fields="fieldsToRender"
    />
  </div>
</template>

<script setup lang="ts">
import AuditEntry from '../_widgets/audit-entry.vue'
import type { AppSchema } from '@/types/fux-core'
import type { NPropsFieldConfig } from '@/types/fux-core/flow'

const { schema } = defineProps<{
  schema: AppSchema
}>()

const { query } = useRoute()
const taskKey = query.taskDefKey

const fieldsToRender = computed<NPropsFieldConfig[]>(() => {
  if (taskKey) {
    if (taskKey === 'All') {
      const fields: NPropsFieldConfig[] = []
      schema.flow.nodes.forEach((node) => {
        if (node.type === 'audit') {
          node.props.fields.forEach((field) => {
            fields.push(field)
          })
        }
      })
      return fields
    }
    // when taskKey is not 'All':
    const currTask = schema.flow.nodes.find((node) => node.uid == taskKey)
    return currTask?.props.fields || []
  } else {
    return []
  }
})
</script>
