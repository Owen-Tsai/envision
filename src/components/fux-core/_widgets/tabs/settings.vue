<template>
  <AFormItem label="样式外观" name="type">
    <ASelect v-model:value="model.type" :options="typeOpts" default-value="line" />
  </AFormItem>
  <AFormItem label="尺寸" name="size">
    <ASelect v-model:value="model.size" :options="sizeOpts" default-value="middle" />
  </AFormItem>
  <AFormItem label="标签页面板" name="children">
    <AFormItemRest>
      <div class="list">
        <div v-for="(col, i) in model.children" :key="i" class="flex items-center mb-2 gap-1">
          <AInput v-model:value="col.title" />
          <AButton class="flex-shrink-0" type="text" danger @click="removePane(i)">
            <template #icon>
              <CloseOutlined />
            </template>
          </AButton>
        </div>
        <AButton block type="primary" ghost @click="addPane">新增列</AButton>
      </div>
    </AFormItemRest>
  </AFormItem>
  <AFormItem label="标签页居中" name="centered" class="boolean-field">
    <ASwitch v-model:checked="model.centered" />
  </AFormItem>
  <AFormItem label="切换时销毁DOM" name="destroyInactivePanes" class="boolean-field">
    <ASwitch v-model:checked="model.destroyInactivePanes" />
  </AFormItem>
  <AFormItem label="步骤模式" name="stepsMode" class="boolean-field">
    <ASwitch v-model:checked="model.stepsMode" />
  </AFormItem>
  <AFormItem
    v-if="model.stepsMode"
    label="显示操作按钮"
    name="state.showActions"
    class="boolean-field"
  >
    <ASwitch v-model:checked="model.state.showActions" />
  </AFormItem>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { CloseOutlined } from '@ant-design/icons-vue'
import type { WPropsTabs } from '@/types/fux-core/form'

const typeOpts = [
  { label: '线性', value: 'line' },
  { label: '卡片型', value: 'card' },
]

const sizeOpts = [
  { label: '默认', value: 'middle' },
  { label: '小', value: 'small' },
  { label: '大', value: 'large' },
]

const { attrs } = defineProps<{
  attrs: WPropsTabs
}>()

const emit = defineEmits(['update:attrs'])

const model = computed({
  get: () => attrs,
  set: (val) => {
    emit('update:attrs', val)
  },
})

const addPane = () => {
  model.value.children.push({
    title: '新标签页',
    widgets: [],
  })
}

const removePane = (idx: number) => {
  model.value.children.splice(idx, 1)
}
</script>
