<template>
  <ASteps
    :current="config.props.state?.current"
    :size="config.props.size"
    :type="config.props.type === 'dot' ? undefined : config.props.type"
    :progress-dot="config.props.type === 'dot'"
    :items="constructSteps(config.props.children)"
  />
  <div v-for="(step, i) in config.props.children" :key="i">
    <div v-if="i === config.props.state?.current" class="steps-container pt-4">
      <template v-if="ctx?.prod">
        <WidgetRenderer
          v-for="widget in step.widgets"
          :key="widget.uid"
          :config="widget"
          :fields="fields"
        />
      </template>
      <template v-if="!ctx">
        <div class="draggable-area" :class="{ 'empty-slot': step.widgets.length <= 0 }">
          <Nested :widgets="step.widgets" />
        </div>
      </template>
    </div>
  </div>
  <AFlex
    v-if="config.props.state.showActions"
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
import { kebabCase } from 'lodash-es'
import request from '@/utils/request'
import Nested from '../../form-designer/canvas/nested.vue'
import WidgetRenderer from '../index.vue'
import constructSteps from '../../_utils/construct-steps'
import type { WidgetMap } from '@/types/fux-core/form'

const { config, fields } = defineProps<{
  config: WidgetMap['steps']
  fields?: any[]
}>()

const emit = defineEmits(['update:config'])

const model = computed({
  get: () => config,
  set: (val) => {
    emit('update:config', val)
  },
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
