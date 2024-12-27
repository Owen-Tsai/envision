<template>
  <div class="wrapper h-full overflow-auto">
    <div class="relative">
      <div class="actions">
        <AFlex :gap="8" align="center" justify="space-between">
          <div class="flex gap-2 items-center">
            <AButton :icon="h(MinusOutlined)" size="small" @click="zoomOut" />
            <span>{{ zoomPercentage }}%</span>
            <AButton :icon="h(PlusOutlined)" size="small" @click="zoomIn" />
          </div>
        </AFlex>
      </div>

      <div class="h-full w-full">
        <FlowCanvas
          class="transform-origin-tl"
          :style="{ transform: `scale(${zoomPercentage / 100})` }"
        />
      </div>
      <SettingPanel v-model:open="visible.setting" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { useWorkflowCtxProvider } from '../_hooks'
import FlowCanvas from './canvas/index.vue'
import SettingPanel from './setter/index.vue'
import useZoom from './use-zoom'
import type { FlowSchema } from '@/types/fux-core/flow'

const { schema } = defineProps<{
  schema: FlowSchema
}>()

const emit = defineEmits(['update:schema'])

const computedSchema = computed({
  get: () => schema,
  set: (val) => {
    emit('update:schema', val)
  },
})

const visible = reactive({
  setting: false,
  schema: false,
})

const { zoomIn, zoomOut, zoomPercentage } = useZoom()

const { selectedNode } = useWorkflowCtxProvider(computedSchema)

watch(
  () => selectedNode.value,
  (val) => {
    if (val) {
      visible.setting = true
    }
  },
)
</script>

<style lang="scss" scoped>
@use '@/styles/var.scss' as *;

.wrapper {
  position: relative;
  padding-bottom: 80px;

  .actions {
    position: fixed;
    width: calc(100% - 48px);
    top: 80px;
    left: 24px;
    z-index: 99;
  }
}
</style>
