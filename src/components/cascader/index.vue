<template>
  <ACascader v-bind="props" @change="getValue" />
</template>

<script setup lang="ts">
import type { CascaderProps } from 'ant-design-vue'

// inherit props but override behaviors of v-modal:value
const props = defineProps<CascaderProps>()

const emit = defineEmits(['update:value'])

const model = ref<CascaderProps['value']>()

const findPath = (options: CascaderProps['options'], value: string | number) => {
  if (!options) return []
  for (const item of options) {
    if (item.value === value) {
      return item
    }
    if (Array.isArray(item.children)) {
      const res = findPath(item.children, value)
      if (res) {
        return res
      }
    }
  }
}

const getValue = (value: CascaderProps['value']): void => {
  if (!value) return undefined
  let ret: string | number | (string | number)[] | undefined
  if (Array.isArray(value[1])) {
    ret = value.map((e) => {
      return e[e.length - 1]
    })
  } else {
    ret = value[1]
  }

  emit('update:value', ret)
}

/**
 * 回显时调用
 */
const setValue = (): void => {
  if (!props.options || !props.value) return undefined

  if (Array.isArray(props.value)) {
    // multiple mode
    model.value = props.value.map((e) => {
      return findPath(props.options, e)
    })
  } else {
    model.value = findPath(props.options, props.value)
  }
}

watchEffect(() => {
  setValue()
})
</script>
