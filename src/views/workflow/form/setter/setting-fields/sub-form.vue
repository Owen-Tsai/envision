<template>
  <AFormItem label="子表单数量限制">
    <AInputNumber v-model:value="computedProps.max" class="w-full" />
  </AFormItem>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import type { WPropsSubForm } from '@/types/workflow/form'

const props = defineProps({
  opts: {
    type: Object as PropType<WPropsSubForm>,
    required: true
  }
})

const emit = defineEmits(['update:opts'])

const computedProps = computed({
  get: () => props.opts,
  set: (val) => {
    emit('update:opts', val)
  }
})
</script>
