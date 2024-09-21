<template>
  <ADrawer width="30%" v-model:open="computedOpen" @after-open-change="onAnimationChange">
    <pre>{{ selectedNode }}</pre>
  </ADrawer>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import { useNode } from '../use-nodes'

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

const onAnimationChange = (open: boolean) => {
  if (!open) {
    selectedNode.value = undefined
  }
}
</script>
