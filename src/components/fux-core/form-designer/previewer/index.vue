<template>
  <AModal
    v-model:open="isOpen"
    wrap-class-name="modal-fullscreen"
    title="表单预览"
    width="100%"
    destroy-on-close
  >
    <FormRdenderer :schema="schema" show-data />
    <template #footer>
      <AButton type="primary" @click="isOpen = false">关闭</AButton>
    </template>
  </AModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDesignerInjection } from '@/components/fux-core/_hooks'
import FormRdenderer from '../../form-renderer/index.vue'

const { open } = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', open: boolean): void
}>()

const { schema } = useDesignerInjection()

const isOpen = computed({
  get() {
    return open
  },
  set(val) {
    emit('update:open', val)
  }
})
</script>
