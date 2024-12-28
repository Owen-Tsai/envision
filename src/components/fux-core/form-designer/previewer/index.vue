<template>
  <AModal
    v-model:open="isOpen"
    wrap-class-name="modal-fullscreen"
    title="表单预览"
    width="100%"
    destroy-on-close
  >
    <FormRdenderer :schema="appSchema" show-data v-model:state="state" mode="preview" />
    <template #footer>
      <AButton type="primary" @click="isOpen = false">关闭</AButton>
    </template>
  </AModal>
</template>

<script setup lang="ts">
import { useDesignerInjection } from '@/components/fux-core/_hooks'
import FormRdenderer from '../../form-renderer/index.vue'

const { open } = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', open: boolean): void
}>()

const { appSchema } = useDesignerInjection()!
const state = ref<Record<string, any>>({})

const isOpen = computed({
  get() {
    return open
  },
  set(val) {
    emit('update:open', val)
  },
})
</script>
