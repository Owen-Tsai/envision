<template>
  <ATimeline>
    <ATimelineItem
      v-for="(item, i) in auditStatusList"
      :key="i"
      :color="item.status === 'finish' ? 'green' : item.status === 'error' ? 'red' : 'blue'"
    >
      <div v-if="item.description === null">{{ item.title }}</div>
      <div v-else-if="item.status === 'error'">{{ `${item.title} ${item.description}` }}</div>
      <div>{{ item.subTitle }}</div>
    </ATimelineItem>
  </ATimeline>
</template>

<script setup lang="ts">
import useRequest from '@/hooks/use-request'
import { getAuditStatusList } from '@/api/business/audit'

const { query } = useRoute()

const processId = query.processInstanceId as string

const { data: auditStatusList, pending: listPending } = useRequest(
  () => getAuditStatusList(processId),
  {
    immediate: true,
  },
)
</script>
