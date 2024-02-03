<template>
  <div class="px-8 py-4">
    <UserProfile />
    <ARow :gutter="16" class="mt-6">
      <ACol :span="17">
        <ChartCard />
      </ACol>
      <ACol :span="7">
        <QuickActions />
      </ACol>
    </ARow>
  </div>
</template>

<script lang="ts" setup>
import UserProfile from './user-profile.vue'
import QuickActions from './actions.vue'
import ChartCard from './chart.vue'
</script>
