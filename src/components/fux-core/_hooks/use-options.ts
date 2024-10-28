import { ref, watch, computed, type Ref, type WritableComputedRef } from 'vue'
import { useRendererInjection } from './use-context'
import evalExpression from '../_utils/expression'
import useDict from '@/hooks/use-dict'
import type { SelectProps, CheckboxGroupProps, RadioGroupProps } from 'ant-design-vue'
import type { WidgetMap, WidgetPropsMap } from '@/types/fux-core/form'
import type { DictDataEntry } from '@/api/system/dict/data'

type OptionType<T> = T extends WidgetMap['select']
  ? SelectProps['options']
  : T extends WidgetMap['checkbox']
    ? CheckboxGroupProps['options']
    : T extends WidgetMap['radio']
      ? RadioGroupProps['options']
      : never

type Options = CheckboxGroupProps['options'] | SelectProps['options'] | RadioGroupProps['options']

/**
 * used in select, checkbox, radio components
 */
export const useOptions = <
  T extends WidgetMap['select'] | WidgetMap['checkbox'] | WidgetMap['radio']
>(
  config: T
): { options: Ref<OptionType<T> | []> } => {
  const optionAttr = config.props.options
  const options = ref<OptionType<T> | []>([])
  const dictData = ref<Ref<DictDataEntry[]>[]>()
  const rendererCtx = useRendererInjection()

  if (optionAttr?.type === 'static') {
    options.value = optionAttr.value || []
  } else if (optionAttr?.type === 'dict') {
    if (optionAttr.value && rendererCtx && rendererCtx.prod) {
      dictData.value = useDict(optionAttr.value)
    }
  } else if (optionAttr?.type === 'expression') {
    // todo: fill with data from instance.$states.[apiName]
  }

  watch(
    () => dictData.value,
    (val) => {
      if (optionAttr?.type === 'dict' && val) {
        options.value = val[0]
      }
    },
    { immediate: true }
  )

  watch(
    () => rendererCtx?.$state.value,
    (val) => {
      if (rendererCtx && val) {
        if (optionAttr.value && optionAttr.type === 'expression') {
          options.value = evalExpression(`{{${optionAttr.value}}}` as string, val)
        }
      }
    },
    {
      deep: true
    }
  )

  return {
    options: options.value || []
  }
}

export const useOptionInfo = <
  T extends WidgetMap['select'] | WidgetMap['checkbox'] | WidgetMap['radio']
>(
  config: T
) => {
  const rendererCtx = useRendererInjection()

  const optionSetInfo = computed<false | string>(() => {
    // don't display optionSetInfo in prod
    if (rendererCtx && rendererCtx.prod) return false
    if (config.props.options.type === 'dict') {
      return '数据由字典设置'
    }
    if (config.props.options.type === 'expression') {
      return '数据由表达式设置'
    }

    return ''
  })

  return {
    optionSetInfo
  }
}

export const useOptionSettings = (
  model: WritableComputedRef<
    WidgetPropsMap['select'] | WidgetPropsMap['checkbox'] | WidgetPropsMap['radio']
  >
) => {
  const cachedMap = ref<Record<string, any>>({})

  const addOption = () => {
    ;(model.value.options.value as Options)?.push({
      label: undefined,
      value: ''
    })
  }

  const removeOption = (idx: number) => {
    ;(model.value.options.value as Options)?.splice(idx, 1)
  }

  watch(
    () => model.value.options.type,
    (newVal, oldVal) => {
      const value = model.value.options.value
      cachedMap.value[oldVal!] = value
      if (cachedMap.value[newVal!]) {
        model.value.options.value = cachedMap.value[newVal!]
      } else {
        model.value.options.value = undefined
      }
    }
  )

  return {
    cachedMap,
    addOption,
    removeOption
  }
}
