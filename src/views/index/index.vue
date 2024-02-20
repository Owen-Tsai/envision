<template>
  <div class="view">
    <UserProfile />
    <ARow :gutter="[16, 16]" class="mt-6">
      <ACol :span="24" :lg="{ span: 17 }">
        <ChartCard />
        <TodosCard class="mt-4" />
      </ACol>
      <ACol :span="24" :lg="{ span: 7 }">
        <QuickActions />
        <NoticeCard class="mt-4" />
        <HelperSection class="mt-4" />
      </ACol>
    </ARow>
  </div>
</template>

<script lang="ts" setup>
import UserProfile from './user-profile.vue'
import QuickActions from './actions.vue'
import ChartCard from './chart.vue'
import NoticeCard from './notifications.vue'
import TodosCard from './todos.vue'
import HelperSection from './helper.vue'
</script>
