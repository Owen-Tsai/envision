<template>
  <ATabs
    :active-key="config.props.stepsMode && ctx ? config.props.state?.current : undefined"
    :type="config.props.type"
    :centered="config.props.centered"
    :size="config.props.size"
    :destroy-inactive-tab-pane="config.props.destroyInactivePanes"
  >
    <ATabPane v-for="(pane, i) in config.props.children" :key="i" :tab="pane.title">
      <template v-if="ctx?.prod">
        <WidgetRenderer
          v-for="widget in pane.widgets"
          :key="widget.uid"
          :config="widget"
          :fields="fields"
        />
      </template>
      <template v-if="!ctx">
        <div class="draggable-area" :class="{ 'empty-slot': pane.widgets.length <= 0 }">
          <Nested :widgets="pane.widgets" />
        </div>
      </template>
    </ATabPane>
  </ATabs>
  <AFlex
    v-if="config.props.stepsMode && config.props.state.showActions"
    :gap="16"
    align="center"
    justify="center"
    class="mt-4"
  >
    <AButton :disabled="config.props.state.current <= 0 || !ctx" @click="toPrevStep">
      上一步
    </AButton>
    <AButton type="primary" :disabled="!ctx" @click="saveStep">保存并继续</AButton>
  </AFlex>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRendererInjection, useFormDataInjection } from '../../_hooks'
import request from '@/utils/request'
import Nested from '../../form-designer/canvas/nested.vue'
import WidgetRenderer from '../index.vue'
import { kebabCase } from 'lodash-es'
import type { WidgetMap } from '@/types/fux-core/form'

const { config } = defineProps<{
  config: WidgetMap['tabs']
  fields: any[]
}>()

const emit = defineEmits(['update:config'])

const model = computed({
  get: () => config,
  set: (val) => {
    emit('update:config', val)
  }
})

const ctx = useRendererInjection()
const formData = useFormDataInjection()

const toPrevStep = () => {
  if (model.value.props.state.current <= 0) return
  model.value.props.state.current--
}

const saveStep = async () => {
  const { tables } = ctx!.appSchema.value.info
  const step = model.value.props.state.current
  // 获取当前步骤的提交接口
  const api = `/application/${kebabCase(tables[step].name)}/create`

  await request.post({ url: api, data: formData[step] })

  if (step < model.value.props.children.length - 1) {
    model.value.props.state.current++
  }
}
</script>
