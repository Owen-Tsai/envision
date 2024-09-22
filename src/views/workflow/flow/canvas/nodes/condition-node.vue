<!-- This is NOT the whole branched group but only the single conditional node -->
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

      <div class="body font-mono" @click="selectNode(config)">
        {{ computedProps.props.condition || '请设置条件' }}
      </div>
    </div>

    <AddButton @add-node="onAddNode" />
  </div>
</template>

<script setup lang="ts">
import { h, ref, computed, reactive, nextTick, type PropType } from 'vue'
import { CloseOutlined } from '@ant-design/icons-vue'
import AddButton from './add-button.vue'
import { useNode } from '../../use-nodes'
import type { NodeConfigMap, ProcessNodeType } from '@/types/workflow/flow'

const props = defineProps({
  config: {
    type: Object as PropType<NodeConfigMap['condition']>,
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

const onAddNode = (type: ProcessNodeType) => {
  emit('addNode', type)
}

const onRemoveNode = () => {
  emit('removeNode')
}
</script>

<style lang="scss" scoped></style>
