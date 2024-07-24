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
            handle=".drag-handle"
            id="canvas"
          >
            <template #item="{ element }: { element: Widget; index: number }">
              <div
                v-if="element.type === 'grid'"
                class="widget-wrapper"
                :class="{ selected: selectedWidget?.uid === element.uid }"
                @click.self="selectWidget(element)"
              >
                <ARow
                  :align="element.props.align"
                  :gutter="element.props.gutter"
                  :justify="element.props.justify"
                  :wrap="element.props.wrap"
                >
                  <ACol v-for="(col, i) in element.props.children" :key="i" :span="col.span">
                    <div class="draggable-area" :class="{ 'empty-slot': col.widgets.length <= 0 }">
                      <NestedCanvas :list="col.widgets" :siblings="col.widgets" />
                    </div>
                  </ACol>
                </ARow>

                <div class="field-name">
                  {{ element.props.field.name || element.uid }}
                </div>
                <div class="drag-handle">
                  <FullscreenOutlined :rotate="45" />
                </div>
                <div class="actions">
                  <ATooltip title="复制">
                    <div class="action" @click.stop="duplicateWidget(element)">
                      <CopyFilled />
                    </div>
                  </ATooltip>
                  <ATooltip title="删除">
                    <div class="action" @click.stop="deleteWidget(element.uid)">
                      <DeleteFilled />
                    </div>
                  </ATooltip>
                </div>
              </div>
              <div
                v-else-if="element.type === 'tabs'"
                class="widget-wrapper"
                :class="{ selected: selectedWidget?.uid === element.uid }"
                @click.self="selectWidget(element)"
              >
                <ATabs
                  :centered="element.props.centered"
                  :type="element.props.type"
                  :size="element.props.size"
                  :destroy-inactive-tab-pane="element.props.destroyInactivePanes"
                >
                  <ATabPane v-for="(pane, i) in element.props.children" :key="i" :tab="pane.title">
                    <div class="draggable-area" :class="{ 'empty-slot': pane.widgets.length <= 0 }">
                      <NestedCanvas :list="pane.widgets" :siblings="pane.widgets" />
                    </div>
                  </ATabPane>
                </ATabs>

                <div class="field-name">
                  {{ element.props.field.name || element.uid }}
                </div>
                <div class="drag-handle">
                  <FullscreenOutlined :rotate="45" />
                </div>
                <div class="actions">
                  <ATooltip title="复制">
                    <div class="action" @click.stop="duplicateWidget(element)">
                      <CopyFilled />
                    </div>
                  </ATooltip>
                  <ATooltip title="删除">
                    <div class="action" @click.stop="deleteWidget(element.uid)">
                      <DeleteFilled />
                    </div>
                  </ATooltip>
                </div>
              </div>
              <div
                v-else-if="element.type === 'steps'"
                class="widget-wrapper"
                :class="{ selected: selectedWidget?.uid === element.uid }"
                @click.self="selectWidget(element)"
              >
                <ASteps
                  :current="element.props.current"
                  :size="element.props.size"
                  :type="element.props.type === 'dot' ? undefined : element.props.type"
                  :progress-dot="element.props.type === 'dot'"
                  :items="constructStepItems(element.props.children)"
                />
                <div v-for="(step, i) in element.props.children" :key="i">
                  <div v-if="i === element.props.current" class="steps-container pt-4">
                    <div class="draggable-area" :class="{ 'empty-slot': step.widgets.length <= 0 }">
                      <NestedCanvas :list="step.widgets" :siblings="step.widgets" />
                    </div>
                  </div>
                </div>

                <div class="field-name">
                  {{ element.props.field.name || element.uid }}
                </div>
                <div class="drag-handle">
                  <FullscreenOutlined :rotate="45" />
                </div>
                <div class="actions">
                  <ATooltip title="复制">
                    <div class="action" @click.stop="duplicateWidget(element)">
                      <CopyFilled />
                    </div>
                  </ATooltip>
                  <ATooltip title="删除">
                    <div class="action" @click.stop="deleteWidget(element.uid)">
                      <DeleteFilled />
                    </div>
                  </ATooltip>
                </div>
              </div>
              <SlotWidget v-else :config="element" />
            </template>
          </Draggable>
        </AForm>
      </div>
    </EScrollbar>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, inject, type PropType } from 'vue'
import { tryParse } from '@/utils/envision'
import { FullscreenOutlined, DeleteFilled, CopyFilled } from '@ant-design/icons-vue'
import { useWidget } from '../use-widgets'
import Draggable from 'vuedraggable'
import SlotWidget from './widget.vue'
import NestedCanvas from './nested-canvas.vue'
import type { StepsProps } from 'ant-design-vue'
import { injectionKey, type Widget, type FormCreatorCtx, type WPropsStep } from '@/types/workflow'

const { schema, selectedWidget } = inject<FormCreatorCtx>(injectionKey)!
const { deleteWidget, duplicateWidget, selectWidget } = useWidget()

const widgets = ref(schema.form.widgets)

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
