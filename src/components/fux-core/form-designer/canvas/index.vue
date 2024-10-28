<template>
  <div ref="wrapperEl" class="h-full">
    <Scrollbar wrapper-class="!h-full" class="h-full">
      <div class="canvas-wrapper dense">
        <AForm
          :colon="schema?.colon"
          :disabled="schema?.disabled"
          :label-align="schema?.labelAlign"
          :label-col="labelCol"
          label-wrap
          :layout="schema?.layout"
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
import { computed, ref } from 'vue'
import Draggable from 'vuedraggable'
import { useElementBounding } from '@vueuse/core'
import { tryParse } from '@fusionx/utils'
import { useDesignerInjection } from '../../_hooks'
import WidgetRenderer from '../../_widgets/index.vue'
import WidgetWrapper from './widget-wrapper.vue'
import type { Widget } from '@/types/fux-core/form'

const { schema } = useDesignerInjection()

const widgets = ref(schema?.value.widgets)
const wrapperEl = ref<HTMLElement>()

const { height } = useElementBounding(wrapperEl)
const heightValue = computed(() => height.value + 'px')

const labelCol = computed(() => {
  const width = schema?.value.labelWidth
  return width ? { style: { width } } : tryParse(schema?.value.labelCol)
})

const wrapperCol = computed(() => {
  return tryParse(schema?.value.wrapperCol)
})
</script>

<style lang="scss" scoped>
#canvas {
  background-color: var(--colorBgContainer);
  height: auto;
  min-height: 100%;
  padding: 16px;
}
.canvas-wrapper {
  padding: 16px;
  height: v-bind('heightValue');
}
</style>
