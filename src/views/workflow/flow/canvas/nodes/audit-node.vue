<!-- process node: audit node & cc node -->
<template>
  <div class="node-wrapper">
    <div :class="['node', `${computedProps.type}-node`]">
      <div class="header">
        <div class="flex items-center gap-1">
          <AuditOutlined />
          <div class="input-wrapper">
            <AInput
              v-if="state.nodeNameEditing"
              v-model:value="computedProps.name"
              ref="inputEl"
              class="node-name-input"
              size="small"
              @blur="exitNameEditing"
              @press-enter="exitNameEditing"
            />
            <span v-else class="node-name" @click="enterNameEditing">{{ computedProps.name }}</span>
          </div>
        </div>
        <CloseOutlined class="close-icon" @click="onRemoveNode" />
      </div>
      <div class="body" @click="selectNode(config)">
        <div class="flex items-center justify-between w-full">
          <span class="w-10/12">
            <ATypographyText :content="actors" ellipsis />
          </span>
          <RightOutlined />
        </div>
      </div>
    </div>
    <!-- btn -->
    <AddButton @add-node="onAddNode" />
  </div>
</template>

<script setup lang="ts">
import { h, ref, computed, reactive, nextTick, type PropType } from 'vue'
import { CloseOutlined, RightOutlined, AuditOutlined } from '@ant-design/icons-vue'
import AddButton from './add-button.vue'
import { useNode } from '../../use-nodes'
import type { NodeConfigMap, ProcessNodeType } from '@/types/workflow/flow'

const props = defineProps({
  config: {
    type: Object as PropType<NodeConfigMap['audit']>,
    required: true
  }
})

const { selectNode } = useNode()
const emit = defineEmits(['update:config', 'addNode', 'removeNode'])

const computedProps = computed({
  get: () => props.config,
  set: (val) => {
    emit('update:config', val)
  }
})

const inputEl = ref<HTMLInputElement>()

const state = reactive({
  nodeNameEditing: false
})

const enterNameEditing = () => {
  state.nodeNameEditing = true
  nextTick(() => {
    inputEl.value?.focus()
  })
}

const exitNameEditing = () => {
  state.nodeNameEditing = false
}

const actors = computed(() => {
  const { strategy, text, value } = computedProps.value.props.actor
  const dft = '点击设置审核人'
  if (!value) {
    return dft
  }
  // 用户
  if (strategy === 30) {
    if (value.length > 1) {
      return `用户 ${text} 等 ${value.length} 人`
    } else if (value.length === 1) {
      return `用户 ${text}`
    } else {
      return dft
    }
  }

  // 角色
  if (strategy === 10) {
    if (value.length > 1) {
      return `${text} 等 ${value.length} 个角色`
    } else if (value.length === 1) {
      return `角色 ${text}`
    } else {
      return dft
    }
  }

  // 部门
  if (strategy === 20) {
    if (value.length > 1) {
      return `${text} 等 ${value.length} 个部门`
    } else if (value.length === 1) {
      return `部门 ${text} 的成员`
    } else {
      return dft
    }
  }

  return ''
})

const onAddNode = (type: ProcessNodeType) => {
  emit('addNode', type)
}

const onRemoveNode = () => {
  emit('removeNode')
}
</script>
