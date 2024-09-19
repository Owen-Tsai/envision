<template>
  <AFormItem label="样式外观" name="type">
    <ASelect v-model:value="computedProps.type" :options="typeOpts" default-value="line" />
  </AFormItem>
  <AFormItem label="尺寸" name="size">
    <ASelect v-model:value="computedProps.size" :options="sizeOpts" default-value="middle" />
  </AFormItem>
  <AFormItem label="标签页面板" name="children">
    <AFormItemRest>
      <div class="list">
        <div
          v-for="(col, i) in computedProps.children"
          :key="i"
          class="flex items-center mb-2 gap-1"
        >
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
  <AFormItem label="标签页居中" name="centered" class="setter-boolean-field">
    <ASwitch v-model:checked="computedProps.centered" />
  </AFormItem>
  <AFormItem label="切换时销毁DOM" name="destroyInactivePanes" class="setter-boolean-field">
    <ASwitch v-model:checked="computedProps.destroyInactivePanes" />
  </AFormItem>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue'
import { CloseOutlined } from '@ant-design/icons-vue'
import type { WPropsTabs } from '@/types/workflow/form'

const typeOpts = [
  { label: '线性', value: 'line' },
  { label: '卡片型', value: 'card' }
]

const sizeOpts = [
  { label: '默认', value: 'middle' },
  { label: '小', value: 'small' },
  { label: '大', value: 'large' }
]

const props = defineProps({
  opts: {
    type: Object as PropType<WPropsTabs>,
    required: true
  }
})

const emit = defineEmits(['update:opts'])

const computedProps = computed({
  get: () => props.opts,
  set: (val) => {
    emit('update:opts', val)
  }
})

const addPane = () => {
  computedProps.value.children.push({
    title: '新标签页',
    widgets: []
  })
}

const removePane = (idx: number) => {
  computedProps.value.children.splice(idx, 1)
}
</script>
