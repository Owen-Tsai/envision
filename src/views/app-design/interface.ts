import type { AppSchemaVO } from '@/api/fux'
import type { AppSchema } from '@/types/fux-core'
import type { Ref } from 'vue'

export type AppDesignerCtx = {
  appEditMode: Ref<'create' | 'update' | null>
  appSchema: Ref<AppSchema>
  appSchemaInfo: Ref<Partial<AppSchemaVO>>
}
