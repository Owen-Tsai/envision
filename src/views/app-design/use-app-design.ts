import { ref, provide, type Ref, inject } from 'vue'
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

  const loadAppSchema = async () => {
    loading.value = true
    try {
      const data = await getAppDesignSchemaByAppId(params.appId as string)
      if (data === null || !data.appSchema) {
        appSchema.value = _defaultAppSchema
      } else {
        appSchema.value = JSON.parse(data.appSchema)
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
      const list = flattenDeep(appSchema.value?.flow.nodes).map((node) => {
        return {
          uid: node.uid,
          name: node.name
        }
      })

      return drop(list)
    }

    if (appEditMode.value === 'create') {
      const id = await createAppSchema(appDesignForm.value)
      await addMenuById(id, getSteps())
    } else {
      const id = await updateAppSchema(appDesignForm.value)
      await updateMenuById(id, getSteps())
    }
  }

  const saveAppDesign = () => {
    merge(appDesignForm.value, {
      appSchema: JSON.stringify(appSchema.value),
      name: `${params.appId}-${dayjs().format('YYYYMMDDHHmmss')}`,
      conf: `{}`,
      appId: params.appId as string
    })

    Modal.confirm({
      title: '提示',
      content: '是否保存当前应用？',
      onOk: async () => {
        loading.value = true
        await genFlowXML()
        await genAuditMenu()
        loading.value = false
        message.success('保存成功')
      }
    })
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
