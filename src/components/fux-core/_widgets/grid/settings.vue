<template>
  <AFormItem label="垂直排列方式" name="align">
    <ASelect v-model:value="model.align" :options="alignOpts" default-value="top" />
  </AFormItem>
  <AFormItem label="水平排列方式" name="justify">
    <ASelect v-model:value="model.justify" :options="justifyOpts" default-value="start" />
  </AFormItem>
  <AFormItem label="栅格间隔" name="gutter">
    <AInputNumber
      v-model:value="model.gutter"
      :min="0"
      :step="1"
      class="w-full"
      @change="(val) => format(val)"
    />
  </AFormItem>
  <AFormItem label="栅格列" name="children">
    <AFormItemRest>
      <div class="cols-list">
        <div v-for="(col, i) in model.children" :key="i" class="flex items-center mb-2 gap-1">
          <AInputNumber class="flex-grow" v-model:value="col.span" />
          <AButton class="flex-shrink-0" type="text" danger @click="removeCol(i)">
            <template #icon>
              <CloseOutlined />
            </template>
          </AButton>
        </div>
        <AButton block type="primary" ghost @click="addCol">新增列</AButton>
      </div>
    </AFormItemRest>
  </AFormItem>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue'
import { CloseOutlined } from '@ant-design/icons-vue'
import { clamp } from 'lodash-es'
import type { WPropsGrid } from '@/types/fux-core'

const alignOpts = [
  { label: '顶部对齐', value: 'top' },
  { label: '中间对齐', value: 'middle' },
  { label: '底部对齐', value: 'bottom' },
  { label: '拉伸填充', value: 'stretch' }
]

const justifyOpts = [
  { label: '开端对齐', value: 'start' },
  { label: '末端对齐', value: 'end' },
  { label: '中间对齐', value: 'center' },
  { label: '两端对齐', value: 'space-between' },
  { label: '中间填充', value: 'space-around' },
  { label: '空间等分', value: 'space-evenly' }
]

const { attrs } = defineProps<{
  attrs: WPropsGrid
}>()

const emit = defineEmits(['update:attrs'])

const model = computed({
  get: () => attrs,
  set: (val) => {
    emit('update:attrs', val)
  }
})

const addCol = () => {
  const spanUsed = model.value.children.reduce((acc, curr) => acc + (curr.span || 0), 0)
  const spanAvailable = clamp(24 - spanUsed, 0, 24)
  model.value.children.push({
    span: spanAvailable,
    widgets: []
  })
}

const removeCol = (idx: number) => {
  model.value.children.splice(idx, 1)
}

const format = (val: any) => {
  if (!val || val === '') {
    model.value.gutter = 0
  }
}
</script>
