<template>
  <div class="h-full">
    <EScrollbar wrapper-class="h-full" class="h-full">
      <div class="canvas-wrapper p-4">
        <AForm
          :colon="schema.form.colon"
          :label-align="schema.form.labelAlign"
          :label-col="labelCol"
          label-wrap
          :wrapper-col="wrapperCol"
          :layout="schema.form.layout"
          :disabled="schema.form.disabled"
          scroll-to-first-error
          class="dense-form"
        >
          <Draggable
            :list="widgets"
            group="efk"
            :animation="200"
            item-key="uid"
            ghost-class="ghost"
            id="canvas"
          >
            <template #item="{ element }: { element: Widget; index: number }">
              <div v-if="element.type === 'grid'" class="widget-wrapper">
                <ARow
                  :align="element.props.align"
                  :gutter="element.props.gutter"
                  :justify="element.props.justify"
                  :wrap="element.props.wrap"
                >
                  <ACol v-for="(col, i) in element.children" :key="i" :span="col.span">
                    <div class="draggable-area">
                      <NestedCanvas :list="col.widgets" />
                    </div>
                  </ACol>
                </ARow>
              </div>
              <div v-else-if="element.type === 'tabs'" class="widget-wrapper">
                <ATabs
                  :centered="element.props.centered"
                  :type="element.props.type"
                  :size="element.props.size"
                  :destroy-inactive-tab-pane="element.props.destroyInactivePanes"
                >
                  <ATabPane v-for="(pane, i) in element.children" :key="i" :tab="pane.title">
                    <div class="draggable-area">
                      <NestedCanvas :list="pane.widgets" />
                    </div>
                  </ATabPane>
                </ATabs>
              </div>
              <div v-else-if="element.type === 'steps'" class="widget-wrapper">
                <ASteps
                  v-model:current="activeStep"
                  :size="element.props.size"
                  :type="element.props.type === 'dot' ? undefined : element.props.type"
                  :progress-dot="element.props.type === 'dot'"
                  :items="constructStepItems(element.children)"
                />
                <div v-for="(step, i) in element.children" :key="i" class="pt-4">
                  <div v-if="i === activeStep" class="steps-container">
                    <div class="draggable-area">
                      <NestedCanvas :list="step.widgets" />
                    </div>
                  </div>
                </div>
              </div>
              <SlotWidget v-else :config="element" />
            </template>
          </Draggable>
        </AForm>
      </div>

      <pre>{{ selectedWidget }}</pre>
    </EScrollbar>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, inject } from 'vue'
import { tryParse } from '@/utils/envision'
import Draggable from 'vuedraggable'
import SlotWidget from './widget.vue'
import NestedCanvas from './nested-canvas.vue'
import type { StepsProps } from 'ant-design-vue'
import { injectionKey, type Widget, type FormCreatorCtx, type WPropsStep } from '@/types/workflow'

const { schema, selectedWidget } = inject<FormCreatorCtx>(injectionKey)!

const widgets = ref(schema.form.widgets)
const activeStep = ref(0)

const labelCol = computed(() => {
  const width = schema.form.labelWidth
  return width ? { style: { width } } : tryParse(schema.form.labelCol)
})

const wrapperCol = computed(() => {
  return tryParse(schema.form.wrapperCol)
})

const constructStepItems = (steps: WPropsStep[]): StepsProps['items'] => {
  return steps.map((e) => ({
    title: e.title,
    description: e.desc
  }))
}
</script>

<style lang="scss" scoped>
@use '@/styles/mixins.scss' as *;
$margin: 1rem;

#canvas {
  @apply h-auto relative p-4;
  background-color: var(--colorBgContainer);
  min-height: calc(100vh - $header-height - $margin * 2);
}
</style>
