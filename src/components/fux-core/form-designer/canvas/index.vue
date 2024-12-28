<template>
  <div ref="wrapperEl" class="h-full">
    <Scrollbar wrapper-class="!h-full" class="h-full">
      <div class="canvas-wrapper dense">
        <AForm
          :colon="appSchema.form.colon"
          :disabled="appSchema.form.disabled"
          :label-align="appSchema.form.labelAlign"
          :label-col="labelCol"
          label-wrap
          :layout="appSchema.form.layout"
          :wrapper-col="wrapperCol"
          class="h-full"
        >
          <Draggable
            :list="widgets"
            group="fux"
            :animation="200"
            item-key="uid"
            ghost-class="ghost"
            handle=".drag-handle"
            :swap-threshold="0.1"
            id="canvas"
          >
            <template #item="{ element }: { element: Widget }">
              <WidgetWrapper :widget="element">
                <WidgetRenderer :config="element" />
              </WidgetWrapper>
            </template>
          </Draggable>
        </AForm>
      </div>
    </Scrollbar>
  </div>
</template>

<script setup lang="ts">
import Draggable from 'vuedraggable'
import { tryParse } from '@fusionx/utils'
import { useDesignerInjection } from '../../_hooks'
import WidgetRenderer from '../../_widgets/index.vue'
import WidgetWrapper from './widget-wrapper.vue'
import type { Widget } from '@/types/fux-core/form'

const { appSchema } = useDesignerInjection()!

const widgets = ref(appSchema.value.form.widgets)
const wrapperEl = ref<HTMLElement>()

const { height } = useElementBounding(wrapperEl)
const heightValue = computed(() => height.value + 'px')

const labelCol = computed(() => {
  const width = appSchema.value.form.labelWidth
  return width ? { style: { width } } : tryParse(appSchema.value.form.labelCol)
})

const wrapperCol = computed(() => {
  return tryParse(appSchema.value.form.wrapperCol)
})
</script>

<style lang="scss" scoped>
#canvas {
  background-color: var(--color-bg-container);
  height: auto;
  min-height: 100%;
  padding: 16px;
}
.canvas-wrapper {
  padding: 16px;
  height: v-bind('heightValue');
}
</style>
