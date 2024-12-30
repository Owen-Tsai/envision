<template>
  <ACascader v-bind="{ ...$props, ...$attrs }" v-model:value="model" @change="onChange" />
</template>

<script setup lang="ts">
import { last } from 'lodash-es'
import type { CascaderProps } from 'ant-design-vue'
import { type CascaderOptionType } from 'ant-design-vue/es/cascader'

const props = defineProps<{
  allowClear?: boolean
  changeOnSelect?: boolean
  defaultValue?: CascaderProps['defaultValue']
  showCheckedStrategy?: CascaderProps['showCheckedStrategy']
  disabled?: boolean
  fieldNames?: CascaderProps['fieldNames']
  maxTagCount?: number
  multiple?: boolean
  maxTagTextLength?: number
  loadData?: CascaderProps['loadData']
  options?: CascaderProps['options']
  value?: string | number | (string | number)[]
}>()

const model = ref<CascaderProps['value']>()

const emit = defineEmits(['update:value'])

const onChange: CascaderProps['onChange'] = (newValue, paths) => {
  if (props.multiple) {
    if (newValue === undefined || newValue.length === 0) {
      emit('update:value', [])
    } else {
      const values = newValue.map((e) => last(e))
      emit('update:value', values)
    }
  } else {
    if (newValue === undefined || newValue.length === 0) {
      emit('update:value', undefined)
    } else {
      emit('update:value', last(newValue as any))
    }
  }
}

const findNodePaths = (
  options: CascaderOptionType[],
  values: (string | number)[] | string | number,
) => {
  const targetSet = Array.isArray(values) ? new Set(values) : new Set([values])
  const result: (string | number)[][] = []

  const dfs = (option: CascaderOptionType, path: (string | number)[]) => {
    const currentPath = [...path, option[props.fieldNames?.value || 'value']]

    // 允许数字和字符串相互转换
    // @todo: 后期最好移除并在建表时统一字段类型
    let has: boolean = false
    const optionVal = option[props.fieldNames?.value || 'value']
    const optionType = typeof optionVal
    const valType = Array.isArray(values) ? typeof values[0] : typeof values

    if (optionType === 'string') {
      if (valType === 'string') {
        has = targetSet.has(optionVal)
      } else {
        has = targetSet.has(parseInt(optionVal))
      }
    } else {
      if (valType === 'number') {
        has = targetSet.has(optionVal)
      } else {
        has = targetSet.has(optionVal + '')
      }
    }

    if (has) {
      result.push(currentPath as (number | string)[])
    }

    if (option.children) {
      for (const child of option.children) {
        dfs(child, currentPath as (number | string)[])
      }
    }
  }

  for (const option of options) {
    dfs(option, [])
  }

  return props.multiple ? result : result[0] || []
}

watch(
  () => [props.options, props.value],
  ([options, value]) => {
    console.log(options, value)
    // model.value = processed
    if (options === undefined) {
      model.value = []
    }
    if (value === undefined) {
      model.value = undefined
    }

    console.log(options, value)
    if (options == undefined || value == undefined) {
      return
    }

    const path = findNodePaths(
      options as CascaderOptionType[],
      value as string | number | (string | number)[],
    )

    model.value = path
  },
  { immediate: true },
)
</script>
