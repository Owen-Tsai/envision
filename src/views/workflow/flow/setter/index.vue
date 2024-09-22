<template>
  <ADrawer
    width="30%"
    :title="title"
    v-model:open="computedOpen"
    @after-open-change="onAnimationChange"
  >
    <AuditSetting v-if="selectedNode?.type === 'audit'" :config="selectedNode.props" />
    <ConditionSetting v-if="selectedNode?.type === 'condition'" :config="selectedNode.props" />
    <div class="debug-container">
      <pre>{{ selectedNode }}</pre>
    </div>
  </ADrawer>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import { useNode } from '../use-nodes'
import AuditSetting from './nodes/audit-setting.vue'
import ConditionSetting from './nodes/condition-setting.vue'

const props = defineProps({
  open: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:open'])
const { selectedNode } = useNode()

const computedOpen = computed({
  get: () => props.open,
  set: (val) => {
    emit('update:open', val)
  }
})

const title = computed(() => {
  if (selectedNode.value?.type === 'audit') {
    return '审批节点'
  }
  if (selectedNode.value?.type === 'condition') {
    return '条件分支'
  }

  return ''
})

const onAnimationChange = (open: boolean) => {
  if (!open) {
    selectedNode.value = undefined
  }
}
</script>

<style lang="scss" scoped>
.debug-container {
  background-color: var(--colorBgLayout);
  padding: 16px;
}
</style>
