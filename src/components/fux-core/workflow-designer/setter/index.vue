<template>
  <ADrawer
    width="30%"
    :title="title"
    v-model:open="computedOpen"
    @after-open-change="onAnimationChange"
  >
    <AuditSetting v-if="selectedNode?.type === 'audit'" :attrs="selectedNode.props" />
    <div class="debug-container">
      <pre>{{ selectedNode }}</pre>
    </div>
  </ADrawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWorkflowCtxInjection } from '../../_hooks'
import AuditSetting from '../../_nodes/audit/settings.vue'

const { open } = defineProps<{
  open: boolean
}>()

const emit = defineEmits(['update:open'])

const { selectedNode } = useWorkflowCtxInjection()

const computedOpen = computed({
  get: () => open,
  set: (val) => {
    emit('update:open', val)
  },
})

const title = computed(() => {
  if (selectedNode.value?.type === 'audit') {
    return '审批节点'
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
  background-color: var(--color-bg-layout);
  padding: 16px;
}
</style>
