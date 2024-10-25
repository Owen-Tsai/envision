<template>
  <ATooltip placement="right" :arrow="false" :title="title">
    <AButton :type="isPrimary ? 'primary' : 'default'" :icon="h(icon)" @click="onClick" />
  </ATooltip>
</template>

<script setup lang="ts">
import { h, type FunctionalComponent } from 'vue'

const { title, icon } = defineProps<{
  title: string
  icon: FunctionalComponent
  isPrimary?: boolean
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

const onClick = () => {
  emit('click')
}
</script>
