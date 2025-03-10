import { message, Modal } from 'ant-design-vue'
import { merge, flattenDeep, compact } from 'lodash-es'
import dayjs from 'dayjs'
import { getApplicationDetail, type ApplicationVO } from '@/api/application'
import {
  getAppSchemaByAppId,
  getProcessXML,
  updateProcessXML,
  addMenuById,
  updateMenuById,
  createAppSchema,
  type AppSchemaVO,
} from '@/api/fux'
import nodes from '@/components/fux-core/_utils/initial-node-config'
import type { StepsProps } from 'ant-design-vue'
import type { AppSchema } from '@/types/fux-core'
import type { AppDesignerCtx } from './interface'
import type { Node } from '@/types/fux-core/flow'

const APP_DESIGN_CTX = Symbol('app-designer-ctx')

const _defaultAppSchema: AppSchema = {
  form: {
    widgets: [],
    labelWidth: '88px',
    labelAlign: 'right',
  },
  flow: {
    nodes: [
      {
        ...nodes['start'],
      },
    ],
  },
  info: {
    tables: [],
    gridColumns: false,
    paginated: false,
  },
  version: '1.0',
}

export const useSteps = () => {
  const step = ref(0)

  const steps: StepsProps['items'] = [
    { title: '数据源配置' },
    { title: '表单设计' },
    { title: '流程编排' },
  ]

  return {
    step,
    steps,
  }
}

/**
 * Save, load and update app design result
 */
export const useAppDesigner = () => {
  const { params } = useRoute()
  const appDetail = ref<ApplicationVO | null>(null)
  const appSchemaVO = ref<AppSchemaVO>({})
  const appSchema = ref<AppSchema>(_defaultAppSchema)
  const appEditMode: AppDesignerCtx['appEditMode'] = ref(null)
  const loading = ref(false)
  const schemaId = ref<string>()

  const schemaLoaded = ref(false)

  const loadAppSchema = async () => {
    loading.value = true
    try {
      const data = await getAppSchemaByAppId(params.appId as string)
      if (data === null || !data.appSchema) {
        appSchema.value = _defaultAppSchema
        appEditMode.value = 'create'
      } else {
        appSchema.value = JSON.parse(data.appSchema)
        appSchemaVO.value = data
        // schemaId.value = data.id
        appEditMode.value = 'update'
      }
      schemaLoaded.value = true
    } catch (e) {
      appSchema.value = _defaultAppSchema
    } finally {
      loading.value = false
    }
  }

  const loadAppDetail = async () => {
    const data = await getApplicationDetail(params.appId as string)
    appDetail.value = data
  }

  const genFlowXML = async () => {
    try {
      const xml = await getProcessXML({
        id: params.appId as string,
        name: appDetail.value?.name || 'unnamed',
        data: appSchema.value!.flow.nodes,
      })
      await updateProcessXML({
        id: appDetail.value!.processIds!,
        name: appDetail.value?.name || 'unnamed',
        bpmnXml: xml.data,
        category: appDetail.value?.type || 'unknown',
      })
    } catch (e) {
      console.log(e)
    }
  }

  const genAuditMenu = async () => {
    const getSteps = (nodes: Node[] = appSchema.value.flow.nodes) => {
      const ret: Node[] = []

      nodes.forEach((node) => {
        if (node.type === 'audit') {
          ret.push(node)
        } else if (node.type === 'group') {
          const nodes = node.props.children.map((n) => getSteps(n))
          ret.push(...flattenDeep(nodes))
        }
      })

      return ret
    }

    const id = await createAppSchema(appSchemaVO.value)
    const auditSteps = compact(getSteps())

    if (appEditMode.value === 'create') {
      await addMenuById(id, auditSteps)
      appEditMode.value = 'update'
    } else {
      await updateMenuById(id, auditSteps)
    }
  }

  const resetTabsCurrent = () => {
    appSchema.value.form.widgets.forEach((widget) => {
      if (widget.type === 'tabs' && widget.props.stepsMode) {
        widget.props.state.current = 0
      }
    })
  }

  const saveAppDesign = () => {
    loading.value = true
    // validation
    const unsetNodes = flattenDeep(appSchema.value.flow.nodes).filter(
      (node) => node.type === 'audit' && !node.props.actor.value,
    )
    // reset tabs current active model to 0
    resetTabsCurrent()

    if (unsetNodes.length > 0) {
      message.error('流程中包含未指派审核人的节点')
      loading.value = false
      return
    }

    merge(appSchemaVO.value, {
      appSchema: JSON.stringify(appSchema.value),
      name: `${params.appId}-${dayjs().format('YYYYMMDDHHmmss')}`,
      conf: `{}`,
      appId: params.appId as string,
      id: schemaId.value,
    })

    const modalContent =
      appEditMode.value === 'create'
        ? '是否保存当前应用？'
        : '你正在编辑已经存在的应用，保存后，应用将迭代到新版本，所有处于审核流程中的业务都将失效。请确保当前应用没有正在审核中的实例再进行保存。'

    Modal.confirm({
      title: '保存应用',
      content: modalContent,
      onOk: async () => {
        loading.value = true
        await genFlowXML()
        await genAuditMenu()
        loading.value = false
        message.success('保存成功')
      },
    })
  }

  // onCreated
  loadAppDetail()
  loadAppSchema()

  provide<AppDesignerCtx>(APP_DESIGN_CTX, {
    appSchema,
    appEditMode,
    appSchemaVer: computed(() => appSchemaVO.value.version),
  })

  return {
    appDetail,
    appSchemaVO,
    appEditMode,
    appSchema,
    loading,
    saveAppDesign,
    schemaLoaded,
  }
}

export const useAppDesignCtxInjection = () => {
  return inject<AppDesignerCtx | null>(APP_DESIGN_CTX, null)
}
