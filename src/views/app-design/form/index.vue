<template>
  <FormDesigner v-model:schema="appSchema" />
</template>

<script setup lang="ts">
import { useAppDesignCtxInjection } from '../use-app-design'
import FormDesigner from '@/components/fux-core/form-designer/index.vue'

const { appSchema } = useAppDesignCtxInjection()!
</script>
