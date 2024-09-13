<template>
  <ARate
    v-model:value="model"
    :allow-clear="config.props.allowClear"
    :allow-half="config.props.allowHalf"
    :count="config.props.count"
    :disabled="config.props.disabled"
    :tooltips="tooltips"
  >
    <template #character>
      <AddonRenderer
        v-if="config.props.character"
        :addon-type="config.props.characterType"
        :addon-value="config.props.character"
      />
      <StarFilled v-else />
    </template>
  </ARate>
</template>

<script lang="ts" setup>
import { computed, inject, type PropType } from 'vue'
import { StarFilled } from '@ant-design/icons-vue'
import { tryParse } from '@/utils/fusion'
import AddonRenderer from '../addon-renderer.vue'
import useModel from '../use-model'
import { parentFieldKey, type WidgetConfigMap, type ParentFormPropType } from '@/types/workflow'

const parentFormConfig = inject<ParentFormPropType | undefined>(parentFieldKey, undefined)

const props = defineProps({
  config: {
    type: Object as PropType<WidgetConfigMap['rate']>,
    required: true
  }
})

const { model } = useModel(props.config.props.field.name || props.config.uid, parentFormConfig)

const tooltips = computed(() => tryParse(props.config.props.tooltips))
</script>
