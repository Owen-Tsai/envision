<template>
  <div class="p-4 h-full">
    <ATree
      :field-names="{ title: 'label', key: 'uid' }"
      :key="simpleHash(JSON.stringify(widgetTree))"
      :tree-data="widgetTree"
      default-expand-all
    >
      <template #title="{ label, name, key }">
        <ATooltip :title="key" placement="right" :arrow="false">
          <div class="node">
            <div class="label">{{ label }}</div>
            <div class="name">{{ name }}</div>
          </div>
        </ATooltip>
      </template>
    </ATree>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { schemaToTree } from '@/components/fux-core/_utils/widget'
import simpleHash from '@/components/fux-core/_utils/hash'
import { useDesignerInjection } from '@/components/fux-core/_hooks/use-context'

const { schema } = useDesignerInjection()

const widgetTree = computed(() => schemaToTree(schema!.value))
</script>

<style lang="scss" scoped>
.node {
  @apply flex-center;
  gap: 4px;
  .label {
    white-space: nowrap;
  }
  .name {
    color: var(--colorTextSecondary);
    font-style: italic;
    white-space: nowrap;
  }
}
</style>
