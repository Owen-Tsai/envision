import type { AppSchema } from '@/types/fux-core'
import type { NPropsAudit } from '@/types/fux-core/flow'
import FormRenderer from '@/components/fux-core/form-renderer/index.vue'

/**
 * 审核通过时，将附加数据进行提交
 */
const getExtraData = (
  rendererInstance: InstanceType<typeof FormRenderer>,
  appSchema: AppSchema,
) => {
  const { query } = useRoute()
  const { taskDefKey } = query
  const currentNode = appSchema.flow.nodes.find((node) => node.uid === taskDefKey)

  if (currentNode === undefined) {
    throw new Error('找不到当前任务节点，可能是路由参数`taskDefKey`不存在或者不正确')
  }

  const editableFields = (currentNode.props as NPropsAudit).fields.filter(
    (field) => field.config === 'edit',
  )

  const originalData = rendererInstance.getFormData()

  if (appSchema.info.paginated) {
    const stepWidget = rendererInstance.getStepWidget()
    const stepsCount = appSchema.info.tables.length

    stepWidget.props.children.forEach((step, idx) => {})
  }
}
