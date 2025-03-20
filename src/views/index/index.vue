<template>
  <div class="view">
    <ARow :gutter="[16, 16]">
      <ACol :span="24">
        <ARow :gutter="16">
          <ACol :span="16">
            <OrgCard />
          </ACol>
          <ACol :span="8">
            <StatCard />
          </ACol>
        </ARow>
      </ACol>
      <ACol :span="24" :lg="{ span: 16 }">
        <ChartCard />
        <!-- <TodosCard class="mt-4" /> -->
      </ACol>
      <ACol :span="24" :lg="{ span: 8 }">
        <QuickActions />
        <NoticeCard class="mt-4" />
        <!--        <HelperSection class="mt-4" />-->
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
import OrgCard from './org-card.vue'
import StatCard from './stat-card.vue'

defineOptions({ name: 'index' })
</script>
