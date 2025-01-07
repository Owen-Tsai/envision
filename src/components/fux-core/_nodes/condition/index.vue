<template>
  <div class="node-wrapper px-10 pt-8">
    <div class="node condition-node">
      <div class="header">
        <div class="flex items-center gap-1">
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
        <div>
          <CloseOutlined class="close-icon" @click="onRemoveNode" />
        </div>
      </div>

      <div class="body font-mono" @click="selectedNode = config">
        {{ computedProps.props.condition || '请设置条件' }}
      </div>
    </div>

    <NodeButton @click="onAddNode" />
  </div>
</template>

<script setup lang="ts">
import NodeButton from '../node-button.vue'
import { useWorkflowCtxInjection } from '../../_hooks'
import type { NodeConfigMap } from '@/types/fux-core/flow'

const props = defineProps({
  config: {
    type: Object as PropType<NodeConfigMap['condition']>,
    required: true,
  },
})

const { selectedNode } = useWorkflowCtxInjection()
const emit = defineEmits(['update:config', 'add-node', 'delete'])

const computedProps = computed({
  get: () => props.config,
  set: (val) => {
    emit('update:config', val)
  },
})

const inputEl = ref<HTMLInputElement>()

const state = reactive({
  nodeNameEditing: false,
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

const onAddNode = (type: keyof NodeConfigMap) => {
  emit('add-node', type)
}

const onRemoveNode = () => {
  emit('delete')
}
</script>

<style lang="scss" scoped></style>
