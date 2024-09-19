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
      <template v-if="element.class === 'layout'">
        <div
          class="widget-wrapper"
          :class="{ selected: selectedWidget?.uid === element.uid }"
          @click.self="selectWidget(element)"
        >
          <Grid v-if="element.type === 'grid'" :element="element" />
          <Tabs v-else-if="element.type === 'tabs'" :element="element" />
          <Steps v-else-if="element.type === 'steps'" :element="element" />
          <SubForm v-else-if="element.type === 'subForm'" :element="element" />
          <DataTable v-else-if="element.type === 'dataTable'" :element="element" />
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
      </template>
      <SpecialWidget v-else-if="element.class === 'special'" :config="element" />
      <FormWidget v-else :config="element" :siblings="siblings" />
    </template>
  </Draggable>
</template>

<script setup lang="ts">
import { type PropType } from 'vue'
import { FullscreenOutlined, DeleteFilled, CopyFilled } from '@ant-design/icons-vue'
import { useWidget } from '../use-widgets'
import Draggable from 'vuedraggable'
import FormWidget from './form-widgets/index.vue'
import SpecialWidget from './special-widgets/index.vue'
import Tabs from './layout-widgets/tabs.vue'
import Steps from './layout-widgets/steps.vue'
import Grid from './layout-widgets/grid.vue'
import SubForm from './layout-widgets/sub-form.vue'
import DataTable from './layout-widgets/data-table.vue'
import type { Widget } from '@/types/workflow/form'

defineOptions({
  name: 'NestedCanvas'
})

const { deleteWidget, duplicateWidget, selectWidget, selectedWidget } = useWidget()

defineProps({
  list: {
    type: Array as PropType<Widget[]>,
    required: true
  },
  siblings: {
    type: Array as PropType<Widget[]>
  }
})
</script>
