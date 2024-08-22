/** NestedCanvas is used inside layout widgets, i.e. Grid, Tabs and Steps */
<template>
  <Draggable
    :list="list"
    group="efk"
    :animation="200"
    handle=".drag-handle"
    ghost-class="ghost"
    item-key="uid"
    :swap-threshold="0.1"
    class="h-full"
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

        <div class="drag-handle">
          <FullscreenOutlined :rotate="45" />
        </div>
        <div class="field-name">
          {{ element.props.field.name || element.uid }}
        </div>
        <div class="actions">
          <ATooltip title="复制">
            <div class="action" @click.stop="duplicateWidget(element, siblings)">
              <CopyFilled />
            </div>
          </ATooltip>
          <ATooltip title="删除">
            <div class="action" @click.stop="deleteWidget(element.uid, siblings)">
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

        <div class="drag-handle">
          <FullscreenOutlined :rotate="45" />
        </div>
        <div class="field-name">
          {{ element.props.field.name || element.uid }}
        </div>
        <div class="actions">
          <ATooltip title="复制">
            <div class="action" @click.stop="duplicateWidget(element, siblings)">
              <CopyFilled />
            </div>
          </ATooltip>
          <ATooltip title="删除">
            <div class="action" @click.stop="deleteWidget(element.uid, siblings)">
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

        <div class="drag-handle">
          <FullscreenOutlined :rotate="45" />
        </div>
        <div class="field-name">
          {{ element.props.field.name || element.uid }}
        </div>
        <div class="actions">
          <ATooltip title="复制">
            <div class="action" @click.stop="duplicateWidget(element, siblings)">
              <CopyFilled />
            </div>
          </ATooltip>
          <ATooltip title="删除">
            <div class="action" @click.stop="deleteWidget(element.uid, siblings)">
              <DeleteFilled />
            </div>
          </ATooltip>
        </div>
      </div>
      <SlotWidget v-else :config="element" :siblings="siblings" />
    </template>
  </Draggable>
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue'
import { FullscreenOutlined, DeleteFilled, CopyFilled } from '@ant-design/icons-vue'
import { useWidget, constructStepItems } from '../use-widgets'
import Draggable from 'vuedraggable'
import SlotWidget from './widget.vue'
import type { Widget } from '@/types/workflow'

defineOptions({
  name: 'NestedCanvas'
})

const { deleteWidget, duplicateWidget, selectWidget, selectedWidget } = useWidget()

const props = defineProps({
  list: {
    type: Array as PropType<Widget[]>,
    required: true
  },
  siblings: {
    type: Array as PropType<Widget[]>
  }
})
</script>
