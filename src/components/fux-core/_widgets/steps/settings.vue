<template>
  <AFormItem label="样式外观" name="type">
    <ASelect v-model:value="model.type" :options="typeOpts" default-value="default" />
  </AFormItem>
  <AFormItem label="尺寸" name="size">
    <ASelect v-model:value="model.size" :options="sizeOpts" default-value="default" />
  </AFormItem>
  <AFormItem label="步骤面板" name="children">
    <AFormItemRest>
      <div class="list">
        <div v-for="(col, i) in model.children" :key="i" class="flex items-center mb-2 gap-1">
          <AInput v-model:value="col.title" />
          <AInput v-model:value="col.desc" />
          <AButton class="flex-shrink-0" type="text" danger @click="removeStep(i)">
            <template #icon>
              <CloseOutlined />
            </template>
          </AButton>
        </div>
        <AButton block type="primary" ghost @click="addStep">新增列</AButton>
      </div>
    </AFormItemRest>
  </AFormItem>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { WPropsSteps } from '@/types/fux-core'

const typeOpts = [
  { label: '默认', value: 'default' },
  { label: '导航型', value: 'navigation' },
  { label: '圆点型', value: 'dot' }
]

const sizeOpts = [
  { label: '默认', value: 'middle' },
  { label: '小', value: 'small' }
]

const { attrs } = defineProps<{
  attrs: WPropsSteps
}>()

const emit = defineEmits(['update:attrs'])

const model = computed({
  get: () => attrs,
  set: (val) => {
    emit('update:attrs', val)
  }
})

const addStep = () => {
  model.value.children.push({
    title: '新步骤',
    widgets: []
  })
}

const removeStep = (idx: number) => {
  model.value.children.splice(idx, 1)
}
</script>
