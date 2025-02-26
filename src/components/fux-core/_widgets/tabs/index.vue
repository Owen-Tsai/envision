<template>
  <ATabs
    v-model:active-key="model.props.state.current"
    :type="config.props.type"
    :centered="config.props.centered"
    :size="config.props.size"
  >
    <ATabPane v-for="(pane, i) in config.props.children" :key="i" :tab="pane.title">
      <template v-if="ctx && ctx.mode && ctx.mode !== 'dev'">
        <WidgetRenderer
          v-for="widget in pane.widgets"
          :key="widget.uid"
          :config="widget"
          :fields="fields"
          :mode="mode"
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
import { useRendererInjection } from '../../_hooks'
import request from '@/utils/request'
import Nested from '../../form-designer/canvas/nested.vue'
import WidgetRenderer from '../index.vue'
import { kebabCase } from 'lodash-es'
import type { WidgetMap } from '@/types/fux-core/form'
import type { FuxRendererMode } from '@/types/fux-core/form/context'

const { config, fields, mode } = defineProps<{
  config: WidgetMap['tabs']
  fields?: any[]
  mode?: FuxRendererMode
}>()

const emit = defineEmits(['update:config'])

const model = computed({
  get: () => config,
  set: (val) => {
    emit('update:config', val)
  },
})

const ctx = useRendererInjection()

const toPrevStep = () => {
  if (model.value.props.state.current <= 0) return
  model.value.props.state.current--
}

const saveStep = async () => {
  const { tables } = ctx!.appSchema.value.info
  const step = model.value.props.state.current
  // 获取当前步骤的提交接口
  const api = `/application/${kebabCase(tables[step].name)}/create`

  await request.post({ url: api, data: ctx!.formData[step] })

  if (step < model.value.props.children.length - 1) {
    model.value.props.state.current++
  }
}
</script>
