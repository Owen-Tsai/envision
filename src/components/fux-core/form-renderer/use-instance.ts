import { useRendererInjection } from '../_hooks'
import { kebabCase, merge, set } from 'lodash-es'
import request from '@/utils/request'
import { emitter } from '@fusionx/utils'

const useInstanceMethods = () => {
  const { appSchema, $state, formData } = useRendererInjection()!

  const getFormData = () => {
    return formData.value
  }

  const setFormData = (data: Record<string, any>) => {
    formData.value = data
  }

  const mergeFormData = (key: string, value: any) => {
    set(formData.value, key, value)
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
      throw new Error(
        '[FusionX/表单渲染器] 无法获取步骤组件: 多步表单必须在组件树顶层中包含表示步骤的组件（tabs/steps）',
      )
    }

    return stepWidget
  }

  const getCurrentStep = (): number => {
    const stepWidget = getStepWidget()

    if (!stepWidget) {
      throw new Error(
        '[FusionX/表单渲染器] 无法获取当前步骤: 多步表单必须在组件树顶层中包含表示步骤的组件（tabs/steps）',
      )
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
    stepWidget.props.state.current += 1
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
  const submit = async () => {
    if (appSchema.value.info.paginated) {
      // 提交分页表单最后一页
      await saveStep()
      // todo: 其他处理？
    } else {
      // 提交单步表单
      const target = appSchema.value.info.tables[0]
      const api = `/applications/${kebabCase(target.name)}/create`
      await request.post({ url: api, data: formData.value })
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
