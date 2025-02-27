import { useRendererInjection, useNestedModelInjection } from './use-context'
import { get } from 'lodash-es'
import type { FormWidget } from '@/types/fux-core/form'

/**
 * unlike use-model, use-value only returns readonly values
 * and cannot be mutated
 *
 * this hook is used in audit views
 */
export const useValue = (widget: FormWidget) => {
  const formDataCtx = useNestedModelInjection() || useRendererInjection()
  const key = widget.props.field?.name || widget.uid

  if (!formDataCtx) return undefined
  const { formData } = formDataCtx

  return get(formData.value, key)
}

export default useValue
