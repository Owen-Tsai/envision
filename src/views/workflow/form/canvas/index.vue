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
            :swap-threshold="0.1"
            id="canvas"
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
              <FormWidget v-else :config="element" />
            </template>
          </Draggable>
        </AForm>
      </div>
    </EScrollbar>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, inject, provide } from 'vue'
import { tryParse } from '@/utils/fusion'
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
import { injectionKey, debugKey, type Widget, type FormCreatorCtx } from '@/types/workflow/form'

provide<boolean>(debugKey, true)

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
