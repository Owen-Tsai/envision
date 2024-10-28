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
      <div class="body" @click="selectedNode = config">
        <div class="flex items-center justify-between w-full">
          <span class="w-10/12">
            <ATypographyText :content="actors" ellipsis />
          </span>
          <RightOutlined />
        </div>
      </div>
    </div>
    <!-- btn -->
    <NodeButton @click="onAddNode" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, nextTick } from 'vue'
import NodeButton from '../node-button.vue'
import { useWorkflowCtxInjection } from '../../_hooks'
import type { NodeConfigMap } from '@/types/fux-core/flow'
import { NodeTaskStrategy } from '../../_utils/const'

const { config } = defineProps<{
  config: NodeConfigMap['audit']
}>()

const { selectedNode } = useWorkflowCtxInjection()
const emit = defineEmits(['update:config', 'add-node', 'delete'])

const computedProps = computed({
  get: () => config,
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
  if (!value && strategy !== NodeTaskStrategy.ORG) {
    return dft
  }

  // 角色
  if (strategy === 10) {
    if (value!.length > 1) {
      return `${text} 等 ${value!.length} 个角色`
    } else if (value!.length === 1) {
      return `角色 ${text}`
    } else {
      return dft
    }
  }

  if (strategy === NodeTaskStrategy.ORG) {
    return text
  }

  return ''
})

const onAddNode = (type: keyof NodeConfigMap) => {
  emit('add-node', type)
}

const onRemoveNode = () => {
  emit('delete')
}
</script>
