<template>
  <div class="view">
    <ACard title="演示表单">
      <FormRenderer :schema="schema as Schema" />
    </ACard>
  </div>
</template>

<script setup lang="ts">
import FormRenderer from '@/components/form-renderer/index.vue'
import schema from './schema.json'
import type { Schema } from '@/types/workflow'
</script>
