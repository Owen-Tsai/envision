/** NestedCanvas is used inside layout widgets, i.e. Grid, Tabs and Steps */
<template>
  <Draggable :list="list" group="efk" :animation="200" item-key="uid">
    <template #item="{ element }: { element: Widget; index: number }">
      <div v-if="element.type === 'grid'">
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
      <div v-else-if="element.type === 'tabs'">
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
      <div v-else-if="element.type === 'steps'">
        <ASteps
          v-model:current="activeStep"
          :size="element.props.size"
          :type="element.props.type === 'dot' ? undefined : element.props.type"
          :progress-dot="element.props.type === 'dot'"
          :items="constructStepItems(element.children)"
        />
        <div v-for="(step, i) in element.children" :key="i">
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
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue'
import Draggable from 'vuedraggable'
import SlotWidget from './widget.vue'
import type { StepsProps } from 'ant-design-vue'
import type { Widget, WPropsStep } from '@/types/workflow'

defineOptions({
  name: 'NestedCanvas'
})

const activeStep = ref(0)

const props = defineProps({
  list: {
    type: Array as PropType<Widget[]>,
    required: true
  }
})

const constructStepItems = (steps: WPropsStep[]): StepsProps['items'] => {
  return steps.map((e) => ({
    title: e.title,
    description: e.desc
  }))
}
</script>
