<template>
  <div>
    <AForm :model="computedProps">
      <AFormItem label="表达式" name="condition">
        <AInput v-model:value="computedProps.condition" placeholder="请输入表达式" />
      </AFormItem>
    </AForm>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import type { NPropsCondition } from '@/types/workflow/flow'

const props = defineProps({
  config: {
    type: Object as PropType<NPropsCondition>,
    required: true
  }
})

const emit = defineEmits(['update:config'])

const computedProps = computed({
  get: () => props.config,
  set: (val) => {
    emit('update:config', val)
  }
})
</script>
