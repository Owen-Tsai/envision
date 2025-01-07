import { useRendererInjection } from '../_hooks'
import { kebabCase, merge, set } from 'lodash-es'
import request from '@/utils/request'
import { emitter } from '@fusionx/utils'

const useInstanceMethods = () => {
  const { appSchema, $state, formData } = useRendererInjection()!

  const getFormData = () => {
    return formData
  }

  const setFormData = (data: Record<string, any>) => {
    formData.value = data
  }

  const mergeFormData = (key: string, value: any) => {
    const stepWidget = appSchema.value.form.widgets.find(
      (widget) => widget.type === 'steps' || widget.type === 'tabs',
    )
    const currentStep = getCurrentStep()
    if (stepWidget) {
      set(formData.value[currentStep], key, value)
    } else {
      set(formData.value, key, value)
    }
  }

  const getSchema = () => {
    return appSchema.value
  }

  const hide = (name: string) => {
    emitter.emit('widget:hide', name)
  }

  const show = (name: string) => {
    emitter.emit('widget:show', name)
  }

  const setWidgetAttrs = (name: string, attrs: Record<string, any>) => {
    emitter.emit('widget:attrs', {
      name,
      attrs,
    })
  }

  const getStepWidget = () => {
    const stepWidget = appSchema.value.form.widgets.find(
      (widget) => widget.type === 'steps' || widget.type === 'tabs',
    )
    if (!stepWidget) {
      // throw new Error(
      //   '[FusionX/表单渲染器] 无法获取步骤组件: 多步表单必须在组件树顶层中包含表示步骤的组件（tabs/steps）'
      // )
      return null
    }

    return stepWidget
  }

  const getCurrentStep = (): number => {
    const stepWidget = getStepWidget()

    if (!stepWidget) {
      // throw new Error(
      //   '[FusionX/表单渲染器] 无法获取当前步骤: 多步表单必须在组件树顶层中包含表示步骤的组件（tabs/steps）'
      // )
      return 0
    }

    const currentStep = stepWidget.props.state.current
    return currentStep
  }

  /**
   * 保存当前步骤。注意，要求表单中仅有一个表示步骤的组件
   */
  const saveStep = async () => {
    const stepWidget = getStepWidget()
    const currentStep = getCurrentStep()

    // 获取当前步骤提交的接口
    const module = appSchema.value.info.tables[currentStep]
    const api = `/applications/${kebabCase(module.name)}/create`

    await request.post({ url: api, data: formData.value[currentStep] })

    // 前进到下一页
    if (stepWidget) {
      stepWidget.props.state.current += 1
    }
  }

  const toPrevStep = () => {
    const stepWidget = appSchema.value.form.widgets.find(
      (widget) => widget.type === 'steps' || widget.type === 'tabs',
    )
    if (!stepWidget) {
      throw new Error(
        '[FusionX/表单渲染器] 分页表单必须在组件树顶层中包含表示步骤的组件（tabs/steps）',
      )
    }
    stepWidget.props.state.current -= 1
  }

  const toNextStep = () => {
    const stepWidget = appSchema.value.form.widgets.find(
      (widget) => widget.type === 'steps' || widget.type === 'tabs',
    )
    console.log('是否步骤模式：', stepWidget)
    if (!stepWidget) {
      throw new Error(
        '[FusionX/表单渲染器] 分页表单必须在组件树顶层中包含表示步骤的组件（tabs/steps）',
      )
    }
    stepWidget.props.state.current += 1
    console.log(stepWidget.props.state.current)
  }

  /**
   * 暂存整个表单（不进行校验）
   */
  const save = () => {}

  /**
   * 提交整个表单，进行校验
   */
  const submit = async (type: 'create' | 'update') => {
    // 判断是否步骤模式
    const stepWidget = appSchema.value.form.widgets.find(
      (widget) => widget.type === 'steps' || widget.type === 'tabs',
    )
    // 如果不是步骤模式
    if (!stepWidget) {
      // 获取当前表
      const target = appSchema.value.info.tables[0]
      const apiPrefix = target.name == 'com_apply' ? 'admin-api' : 'applications'
      const api = `/${apiPrefix}/${kebabCase(target.name)}/${type}`
      // 直接将formData.value传往后台
      if (type === 'create') {
        return await request.post({ url: api, data: formData.value })
      } else {
        return await request.put({ url: api, data: formData.value })
      }
    } else {
      // 获取当前步骤
      const currentStep = getCurrentStep()
      // 获取当前表
      const target = appSchema.value.info.tables[currentStep]
      const apiPrefix = target.name == 'com_apply' ? 'admin-api' : 'applications'
      const api = `/${apiPrefix}/${kebabCase(target.name)}/${type}`
      if (type === 'create') {
        return await request.post({ url: api, data: formData.value[currentStep] })
      } else {
        return await request.put({ url: api, data: formData.value[currentStep] })
      }
    }
  }

  const getStates = () => {
    return $state.value
  }

  const setStates = (data: Record<string, any>) => {
    merge($state.value, data)
  }

  return {
    getFormData,
    setFormData,
    mergeFormData,
    getSchema,
    getStates,
    setStates,
    hide,
    show,
    setWidgetAttrs,
    getCurrentStep,
    getStepWidget,
    saveStep,
    toPrevStep,
    toNextStep,
    save,
    submit,
  }
}

export default useInstanceMethods
