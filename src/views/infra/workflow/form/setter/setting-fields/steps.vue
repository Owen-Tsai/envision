<template>
  <AFormItem label="样式外观" name="type">
    <ASelect v-model:value="computedProps.type" :options="typeOpts" default-value="default" />
  </AFormItem>
  <AFormItem label="尺寸" name="size">
    <ASelect v-model:value="computedProps.size" :options="sizeOpts" default-value="default" />
  </AFormItem>
  <AFormItem label="步骤面板" name="children">
    <AFormItemRest>
      <div class="list">
        <div
          v-for="(col, i) in computedProps.children"
          :key="i"
          class="flex items-center mb-2 gap-1"
        >
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
  <AFormItem label="操作">
    <div class="flex items-center gap-2">
      <AButton block :disabled="computedProps.current <= 0" @click="computedProps.current -= 1">
        上一步
      </AButton>
      <AButton
        block
        :disabled="computedProps.current >= computedProps.children.length - 1"
        @click="computedProps.current += 1"
      >
        下一步
      </AButton>
    </div>
  </AFormItem>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue'
import { CloseOutlined } from '@ant-design/icons-vue'
import type { WPropsSteps } from '@/types/workflow'

const typeOpts = [
  { label: '默认', value: 'default' },
  { label: '导航型', value: 'navigation' },
  { label: '圆点型', value: 'dot' }
]

const sizeOpts = [
  { label: '默认', value: 'middle' },
  { label: '小', value: 'small' }
]

const props = defineProps({
  opts: {
    type: Object as PropType<WPropsSteps>,
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

const addStep = () => {
  computedProps.value.children.push({
    title: '新步骤',
    widgets: []
  })
}

const removeStep = (idx: number) => {
  computedProps.value.children.splice(idx, 1)
}
</script>
