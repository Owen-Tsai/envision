import { safeEval } from '@/utils/eval'
import useInstanceMethods from '../form-renderer/use-instance'
import { useRendererInjection } from '.'

export const useEvents = (eventMap?: Record<string, string>) => {
  const rendererCtx = useRendererInjection()

  if (!rendererCtx) return

  const { appSchema, formData, $state } = rendererCtx

  const {
    getFormData,
    getSchema,
    getStates,
    hide,
    mergeFormData,
    getCurrentStep,
    getStepWidget,
    setFormData,
    setStates,
    setWidgetAttrs,
    show,
    toNextStep,
    toPrevStep,
  } = useInstanceMethods()

  const context: Record<string, any> = {
    $func: {
      getFormData,
      getSchema,
      getStates,
      hide,
      mergeFormData,
      getCurrentStep,
      getStepWidget,
      setFormData,
      setStates,
      setWidgetAttrs,
      show,
      toNextStep,
      toPrevStep,
    },
    $values: formData.value,
    $schema: appSchema.value,
    $state: $state.value,
  }

  const handler = (event: string) => {
    if (!eventMap) return
    // find the designated function and execute it in a safe environment
    const id = eventMap[event]
    const funcConfig = appSchema.value.form.function?.[id]
    if (funcConfig) {
      if (funcConfig.body) {
        safeEval(funcConfig.body, context)
      }
    }
  }

  return {
    handler,
  }
}
