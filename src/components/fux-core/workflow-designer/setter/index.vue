<template>
  <ADrawer
    width="35%"
    :title="title"
    v-model:open="computedOpen"
    @after-open-change="onAnimationChange"
  >
    <AuditSetting v-if="selectedNode?.type === 'audit'" :attrs="selectedNode.props" />
    <ConditionSetting v-if="selectedNode?.type === 'condition'" :attrs="selectedNode.props" />
    <div class="debug-container">
      <div v-html="highlighted" />
    </div>
  </ADrawer>
</template>

<script setup lang="ts">
import { useWorkflowCtxInjection } from '../../_hooks'
import useHighlighter from '@/hooks/use-highlighter'
import AuditSetting from '../../_nodes/audit/settings.vue'
import ConditionSetting from '../../_nodes/condition/settings.vue'

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

const highlighted = computed(() =>
  useHighlighter(JSON.stringify(selectedNode.value, null, 2), 'json'),
)

const onAnimationChange = (open: boolean) => {
  if (!open) {
    selectedNode.value = undefined
  }
}
</script>
