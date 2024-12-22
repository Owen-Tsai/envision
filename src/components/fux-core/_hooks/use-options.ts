import { useRendererInjection } from './use-context'
import { emitter, tryParse } from '@fusionx/utils'
import useDict from '@/hooks/use-dict'
import type {
  SelectProps,
  CheckboxGroupProps,
  RadioGroupProps,
  CascaderProps,
  TreeSelectProps,
} from 'ant-design-vue'
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
  T extends WidgetMap['select'] | WidgetMap['checkbox'] | WidgetMap['radio'],
>(
  config: T,
): { options: Ref<any> } => {
  const optionAttr = config.props.options
  const options = ref<OptionType<T> | []>([])
  const dictData = ref<Ref<DictDataEntry[]>>()
  const rendererCtx = useRendererInjection()

  if (optionAttr?.type === 'static') {
    if (typeof optionAttr.value === 'string') {
      options.value = JSON.parse(optionAttr.value)
    }
    options.value = optionAttr.value || []
  } else if (optionAttr?.type === 'dict') {
    if (optionAttr.value && rendererCtx && rendererCtx.mode === 'prod') {
      dictData.value = useDict(optionAttr.value)[0]
    }
  } else if (optionAttr?.type === 'expression') {
    if (optionAttr.value && rendererCtx && rendererCtx.mode === 'prod') {
      options.value = rendererCtx.$state.value[optionAttr.value]
    }
  }

  watch(
    dictData,
    (val) => {
      if (optionAttr?.type === 'dict' && val) {
        nextTick(() => {
          options.value = val.value
        })
      }
    },
    { immediate: true, deep: true },
  )

  emitter.on('update:state', () => {
    nextTick(() => {
      if (optionAttr.type === 'expression' && optionAttr.value && rendererCtx) {
        options.value = rendererCtx.$state.value[optionAttr.value]
      }
    })
  })

  return {
    options,
  }
}

export const useTreeStructureOptions = <T extends WidgetMap['treeSelect'] | WidgetMap['cascader']>(
  config: T,
): { options: Ref<any> } => {
  const optionAttr = config.props.options
  const options =
    ref<
      T extends WidgetMap['treeSelect'] ? TreeSelectProps['treeData'] : CascaderProps['options']
    >()
  const rendererCtx = useRendererInjection()

  if (optionAttr?.type === 'static') {
    if (optionAttr.value) {
      options.value = JSON.parse(optionAttr.value)
    }
  } else if (optionAttr?.type === 'expression') {
    if (optionAttr.value && rendererCtx && rendererCtx.mode === 'prod') {
      options.value = rendererCtx.$state.value[optionAttr.value]
    }
  }

  emitter.on('update:state', () => {
    nextTick(() => {
      if (optionAttr.type === 'expression' && optionAttr.value && rendererCtx) {
        options.value = rendererCtx.$state.value[optionAttr.value]
      }
    })
  })

  return {
    options,
  }
}

export const useOptionInfo = <
  T extends
    | WidgetMap['select']
    | WidgetMap['checkbox']
    | WidgetMap['radio']
    | WidgetMap['cascader']
    | WidgetMap['treeSelect'],
>(
  config: T,
) => {
  const rendererCtx = useRendererInjection()

  const optionSetInfo = computed<false | string>(() => {
    // don't display optionSetInfo in prod
    if (rendererCtx && rendererCtx.mode === 'prod') return false
    if (config.props.options.type === 'dict') {
      return '数据由字典设置'
    }
    if (config.props.options.type === 'expression') {
      return '数据由表达式设置'
    }

    return false
  })

  return {
    optionSetInfo,
  }
}

export const useOptionSettings = (
  model: WritableComputedRef<
    WidgetPropsMap['select'] | WidgetPropsMap['checkbox'] | WidgetPropsMap['radio']
  >,
) => {
  const cachedMap = ref<Record<string, any>>({})

  const addOption = () => {
    ;(model.value.options.value as Options)?.push({
      label: undefined,
      value: '',
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
    },
  )

  return {
    cachedMap,
    addOption,
    removeOption,
  }
}
