import { ref, provide, type Ref, inject, createVNode } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { useRoute } from 'vue-router'
import { merge, flattenDeep, drop } from 'lodash-es'
import dayjs from 'dayjs'
import { getApplicationDetail, type ApplicationVO } from '@/api/application'
import {
  updateAppSchema,
  getAppDesignSchemaByAppId,
  getProcessXML,
  updateProcessXML,
  addMenuById,
  updateMenuById,
  type AppSchemaVO,
  createAppSchema
} from '@/api/fux'
import nodes from '@/components/fux-core/_utils/initial-node-config'
import type { StepsProps } from 'ant-design-vue'
import type { AppSchema } from '@/types/fux-core'

export type AppDesignerCtx = {
  appSchema: Ref<AppSchema>
  appEditMode: Ref<'create' | 'update' | 'unknown'>
}

const APP_DESIGN_CTX = Symbol('app-designer-ctx')

const _defaultAppSchema: AppSchema = {
  form: {
    widgets: [],
    labelWidth: '88px',
    labelAlign: 'right'
  },
  flow: {
    nodes: [
      {
        ...nodes['start']
      }
    ]
  },
  info: {
    tables: [],
    gridColumns: false,
    paginated: false
  },
  version: '1.0'
}

export const useSteps = () => {
  const step = ref(0)

  const steps: StepsProps['items'] = [
    { title: '数据源配置' },
    { title: '表单设计' },
    { title: '流程编排' }
  ]

  return {
    step,
    steps
  }
}

/**
 * Save, load and update app design result
 */
export const useAppDesigner = () => {
  const { params } = useRoute()
  const appDetail = ref<ApplicationVO | null>(null)
  const appDesignForm = ref<AppSchemaVO>({})
  const appSchema = ref<AppSchema>(_defaultAppSchema)
  const appEditMode = ref<'create' | 'update' | 'unknown'>('unknown')
  const loading = ref(false)
  const schemaId = ref<string>('')

  const loadAppSchema = async () => {
    loading.value = true
    try {
      const data = await getAppDesignSchemaByAppId(params.appId as string)
      if (data === null || !data.appSchema) {
        appSchema.value = _defaultAppSchema
        appEditMode.value = 'create'
      } else {
        appSchema.value = JSON.parse(data.appSchema)
        schemaId.value = data.id
        appEditMode.value = 'update'
      }
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
    const xml = await getProcessXML({
      id: params.appId as string,
      name: appDetail.value?.name || 'unnamed',
      data: appSchema.value!.flow.nodes
    })

    await updateProcessXML({
      id: appDetail.value!.processIds!,
      name: appDetail.value?.name || 'unnamed',
      bpmnXml: xml.data,
      category: appDetail.value?.type || 'unknown'
    })
  }

  const genAuditMenu = async () => {
    const getSteps = () => {
      const list = flattenDeep(appSchema.value?.flow.nodes)
        .map((node) => {
          // console.log(node)
          if (node.props.actor?.value[0] != 'org') {
            return {
              uid: node.uid,
              name: node.name
            }
          }
        })
        .filter(Boolean)

      return drop(list)
    }

    const id = await createAppSchema(appDesignForm.value)
    if (appEditMode.value === 'create') {
      await addMenuById(id, getSteps())
      appEditMode.value = 'update'
    } else {
      await updateMenuById(id, getSteps())
    }
  }

  const saveAppDesign = () => {
    merge(appDesignForm.value, {
      appSchema: JSON.stringify(appSchema.value),
      name: `${params.appId}-${dayjs().format('YYYYMMDDHHmmss')}`,
      conf: `{}`,
      appId: params.appId as string,
      id: schemaId.value
    })

    //在这里检查一下流程中有没有未选择审核人的节点
    let not_auditor_node = false
    flattenDeep(appSchema.value?.flow.nodes).forEach((node) => {
      if (!(node.type == 'start') && !node.props.actor?.value) {
        not_auditor_node = true
      }
    })
    if (!not_auditor_node) {
      Modal.confirm({
        title: '是否保存当前应用？',
        content: createVNode('div', { style: 'color:red;' }, '请确保当前应用已无审核中的申报！'),
        onOk: async () => {
          loading.value = true
          await genFlowXML()
          await genAuditMenu()
          loading.value = false
          message.success('保存成功')
        }
      })
    } else {
      message.error('流程编排中包含未选择审核人的节点！')
    }
  }

  // onCreated
  loadAppDetail()
  loadAppSchema()

  provide<AppDesignerCtx>(APP_DESIGN_CTX, {
    appSchema,
    appEditMode
  })

  return {
    appDetail,
    appDesignForm,
    appEditMode,
    appSchema,
    loading,
    saveAppDesign
  }
}

export const useAppDesignCtxInjection = () => {
  return inject<AppDesignerCtx>(APP_DESIGN_CTX)
}
