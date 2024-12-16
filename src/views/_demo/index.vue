<template>
  <div class="view">这是一个演示页面</div>

  <pre>{{ value }}</pre>

  <Cascader
    :options="options"
    v-model:value="value"
    :field-names="{ label: 'key', value: 'key' }"
  />
</template>

<script setup lang="ts">
import Cascader from '@/components/cascader/index.vue'

const value = ref()

const options = [
  {
    key: '0',
    children: [
      {
        key: '0-1',
        children: [{ key: '0-1-1' }, { key: '0-1-2' }]
      },
      {
        key: '0-2',
        children: [{ key: '0-2-1' }, { key: '0-2-2' }]
      }
    ]
  },
  {
    key: '1',
    children: [
      { key: '1-1' },
      {
        key: '1-2',
        children: [{ key: '1-2-1' }, { key: '1-2-2' }]
      }
    ]
  }
]

setTimeout(() => {
  value.value = '0-1-1'
}, 4000)
</script>
