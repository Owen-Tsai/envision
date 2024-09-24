<template>
  <AModal
    v-model:open="computedOpen"
    wrap-class-name="fullscreen-modal"
    width="100%"
    title="表单预览"
    destroy-on-close
  >
    <div class="modal-content-wrapper">
      <FormRenderer v-if="schema" :schema="schema" show-form-data />
    </div>
  </AModal>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import FormRenderer from '@/components/form-renderer/index.vue'
import type { Schema } from '@/types/workflow'

const props = defineProps({
  open: {
    type: Boolean,
    required: true
  },
  schema: {
    type: Object as PropType<Schema>
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
