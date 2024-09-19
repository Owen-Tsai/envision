<template>
  <ASteps
    :current="current"
    :size="widget.props.size"
    :type="widget.props.type === 'dot' ? undefined : widget.props.type"
    :progress-dot="widget.props.type === 'dot'"
    :items="constructStepItems(widget.props.children)"
  />
  <div v-for="(step, i) in widget.props.children" :key="i">
    <div v-if="i === current" class="steps-container pt-4">
      <WidgetRenderer
        v-for="child in step.widgets"
        :key="child.uid"
        :widget="child"
        :parent-form-config="parentFormConfig"
      />
    </div>
  </div>
  <AFlex justify="end" align="center">
    <AButton @click="current--" :disabled="current === 0">上一步</AButton>
    <AButton
      @click="saveAndContinue"
      :disabled="current === widget.props.children.length - 1"
      type="primary"
    >
      保存并继续
    </AButton>
  </AFlex>
</template>

<script setup lang="ts">
import { ref, inject, type PropType } from 'vue'
import WidgetRenderer from '../widget-renderer.vue'
import { constructStepItems } from '@/utils/workflow'
import {
  parentFieldKey,
  type WidgetConfigMap,
  type ParentFormPropType
} from '@/types/workflow/form'

defineProps({
  widget: {
    type: Object as PropType<WidgetConfigMap['steps']>,
    required: true
  }
})

const parentFormConfig = inject<ParentFormPropType | undefined>(parentFieldKey, undefined)

const current = ref(0)

const saveAndContinue = () => {
  current.value++
}
</script>
