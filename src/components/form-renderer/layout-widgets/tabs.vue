<template>
  <div>
    <ATabs
      v-if="widget.props.stepsMode"
      :active-key="current"
      :centered="widget.props.centered"
      :type="widget.props.type"
      :size="widget.props.size"
      :destroy-inactive-tab-pane="widget.props.destroyInactivePanes"
    >
      <ATabPane v-for="(pane, i) in widget.props.children" :key="i" :tab="pane.title">
        <AForm>
          <WidgetRenderer
            v-for="child in pane.widgets"
            :key="child.uid"
            :widget="child"
            :parent-form-config="parentFormConfig"
          />
        </AForm>
      </ATabPane>
    </ATabs>
    <ATabs
      v-else
      :centered="widget.props.centered"
      :type="widget.props.type"
      :size="widget.props.size"
      :destroy-inactive-tab-pane="widget.props.destroyInactivePanes"
    >
      <ATabPane v-for="(pane, i) in widget.props.children" :key="i" :tab="pane.title">
        <AForm>
          <WidgetRenderer
            v-for="child in pane.widgets"
            :key="child.uid"
            :widget="child"
            :parent-form-config="parentFormConfig"
          />
        </AForm>
      </ATabPane>
    </ATabs>
    <AFlex v-if="widget.props.stepsMode" justify="end" :gap="16">
      <AButton :disabled="current === 0">上一步</AButton>
      <AButton type="primary">
        {{ current === widget.props.children.length - 1 ? '提交' : '保存并继续' }}
      </AButton>
    </AFlex>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, type PropType } from 'vue'
import WidgetRenderer from '../widget-renderer.vue'
import {
  parentFieldKey,
  type WidgetConfigMap,
  type ParentFormPropType
} from '@/types/workflow/form'

defineProps({
  widget: {
    type: Object as PropType<WidgetConfigMap['tabs']>,
    required: true
  }
})

// todo: add configs for stepMode, which disables manual switching
const current = ref(0)

const parentFormConfig = inject<ParentFormPropType | undefined>(parentFieldKey, undefined)

const onSave = () => {
  // 1. extend formData injection into formRendererContext, add schema to it
  //    so that we can access schema from widget
  // 2. read schema.info, figure out which API point should we submit to
  // 3. bind AForm :model to formData[i]
  // 4. submit formData[i] to designated API point
  // 5. current.value += 1
}
</script>
