<template>
  <div>
    <div class="flex h-full">
      <FactoryPanel :schema="schema" class="flex-shrink-0 h-full" style="width: 280px" />
      <CanvasArea :schema="schema" class="flex-1 h-full overflow-hidden" />
      <SettingPanel class="flex-shrink-0 h-full" style="width: 220px" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, provide, computed, nextTick, type PropType } from 'vue'
import FactoryPanel from './factory/index.vue'
import CanvasArea from './canvas/index.vue'
import SettingPanel from './setter/index.vue'
import { generateID } from '@/utils/fusion'
import { injectionKey, type Widget, type FormCreatorCtx } from '@/types/workflow/form'
import { type Schema } from '@/types/workflow'

const props = defineProps({
  schema: {
    type: Object as PropType<Schema>,
    required: true
  }
})

const emit = defineEmits(['update:schema'])

const computedSchema = computed({
  get: () => props.schema,
  set: (val) => {
    emit('update:schema', val)
  }
})

const selectedWidget = ref<Widget>()

const deleteWidget = (uid: string) => {
  const visit = (from?: Widget[]) => {
    const widgets = from || computedSchema.value.form.widgets
    for (let i = 0; i < widgets.length; i++) {
      const node = widgets[i]

      if ((node as any).children) {
        deleteWidget(uid)
      }

      if (node.uid === uid) {
        widgets.splice(i, 1)
        break
      }
    }
  }

  visit()

  nextTick(() => {
    if (uid === selectedWidget.value?.uid) {
      selectedWidget.value = undefined
    }
  })
}

const duplicateWidget = (config: Widget) => {
  const newConfig = {
    ...config,
    uid: generateID()
  }
  computedSchema.value.form.widgets.push(newConfig)
}

provide<FormCreatorCtx>(injectionKey, {
  schema: computedSchema.value.form,
  debug: true, // display addtional information in design view
  selectedWidget,
  deleteWidget,
  duplicateWidget
})
</script>
