<template>
  <div class="wrapper h-full overflow-auto">
    <div class="relative">
      <div class="actions">
        <AFlex :gap="8" align="center" justify="space-between">
          <div class="flex gap-2 items-center">
            <AButton :icon="h(MinusOutlined)" size="small" />
            <span>{{ zoomPercentage }}%</span>
            <AButton :icon="h(PlusOutlined)" size="small" />
          </div>
          <div class="flex gap-2">
            <ATooltip title="查看 Schema">
              <AButton :icon="h(CodeOutlined)" @click="visible.schema = true" />
            </ATooltip>
            <AButton type="primary" @click="saveDesignSchema">保存应用</AButton>
          </div>
        </AFlex>
      </div>

      <FlowCanvas class="h-full" :schema="schema" />
      <SettingPanel v-model:open="visible.setting" />
      <AModal title="流程 Schema" v-model:open="visible.schema">
        <pre>{{ schema }}</pre>
      </AModal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h, ref, reactive, computed, provide, watch, type PropType } from 'vue'
import { MinusOutlined, PlusOutlined, CodeOutlined } from '@ant-design/icons-vue'
import {
  flowCtxInjectionKey,
  type FlowCreatorCtx,
  type Node,
  type FlowSchema
} from '@/types/workflow/flow'
import FlowCanvas from './canvas/index.vue'
import SettingPanel from './setter/index.vue'

const props = defineProps({
  schema: {
    type: Object as PropType<FlowSchema>,
    required: true
  }
})
const emit = defineEmits(['update:schema', 'finished'])

const computedSchema = computed({
  get: () => props.schema,
  set: (val) => {
    emit('update:schema', val)
  }
})

const zoomPercentage = ref(100)
const visible = reactive({
  setting: false,
  schema: false
})

const selectedNode = ref<Node>()

const saveDesignSchema = () => {
  emit('finished')
}

watch(
  () => selectedNode.value,
  (val) => {
    if (val) {
      visible.setting = true
    }
  }
)

provide<FlowCreatorCtx>(flowCtxInjectionKey, {
  schema: computedSchema.value,
  selectedNode
})
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
  }
}
</style>
