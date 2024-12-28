<template>
  <img :src="logo" alt="FusionX Logo" />
</template>

<script setup lang="ts">
import useAppStore from '@/stores/app'
import logoSimple from '~img/logo-simple.svg'
import logoSimpleD from '~img/logo-simple-d.svg'
import logofull from '~img/logo-full.svg'
import logofullD from '~img/logo-full-d.svg'

const { type = 'simple' } = defineProps<{
  type?: 'full' | 'simple'
}>()

const { theme } = storeToRefs(useAppStore())

const logo = computed(() => {
  return theme.value === 'dark'
    ? type === 'full'
      ? logofullD
      : logoSimpleD
    : type === 'full'
      ? logofull
      : logoSimple
})
</script>
