<template>
  <ARate
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
import { computed, type PropType } from 'vue'
import { StarFilled } from '@ant-design/icons-vue'
import { tryParse } from '@/utils/envision'
import AddonRenderer from '../addon-renderer.vue'
import type { WidgetConfigMap } from '@/types/workflow'

const props = defineProps({
  config: {
    type: Object as PropType<WidgetConfigMap['rate']>,
    required: true
  }
})

const tooltips = computed(() => tryParse(props.config.props.tooltips))
</script>
