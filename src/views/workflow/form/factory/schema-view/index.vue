<template>
  <AModal v-model:open="computedOpen" title="Schema" width="1000px">
    <div v-html="content" />
    <template #footer>
      <AButton type="primary" @click="computedOpen = false">关闭</AButton>
    </template>
  </AModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  open: {
    type: Boolean,
    required: true
  },
  content: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:open'])

const computedOpen = computed({
  get: () => props.open,
  set: (val) => {
    emit('update:open', val)
  }
})
</script>
