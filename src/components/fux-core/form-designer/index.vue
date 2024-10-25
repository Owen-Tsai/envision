<template>
  <div class="flex overflow-hidden h-full">
    <ALayout>
      <FactoryPanel :width="factoryPanel?.width" />
      <ALayoutContent>
        <Canvas />
      </ALayoutContent>
      <SetterPanel :width="setterPanel?.width" />
    </ALayout>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import FactoryPanel from './factory/index.vue'
import SetterPanel from './setter/index.vue'
import Canvas from './canvas/index.vue'
import { useDesignerProvider } from '../_hooks'
import type { Props } from './interface'
import type { FormSchema } from '@/types/fux-core'

const { factoryPanel, setterPanel, schema: propsSchema } = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:schema', schema: FormSchema): void
}>()

const schema = computed({
  get: () => propsSchema,
  set: (val) => emit('update:schema', val)
})

useDesignerProvider(schema)
</script>

<style lang="scss" scoped></style>
