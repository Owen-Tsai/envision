<template>
  <ATimeline>
    <ATimelineItem v-for="(item, i) in list" :key="i" :color="item.nodeColor">
      <!--      <div v-if="item.countersign">-->
      <!--        <div>-->
      <!--          <div>会签审核：</div>-->
      <!--          <div v-for="(countersignItem, j) in item.operationList" :key="j">-->
      <!--            <div>{{ countersignItem.operator + countersignItem.operationResult }}</div>-->
      <!--            <div>审核意见：{{ countersignItem.operationRemark }}</div>-->
      <!--            <div>{{ countersignItem.operationTime }}</div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div v-else>-->
      <div>{{ item.operator + item.operationResult }}</div>
      <div v-if="item.operationResultCode !== 0 && item.operationRemark != ''">
        审核意见：{{ item.operationRemark }}
      </div>
      <div v-if="!item.inProcess">{{ item.operationTime }}</div>
      <!--      </div>-->
    </ATimelineItem>
  </ATimeline>
</template>

<script setup lang="ts">
import useRequest from '@/hooks/use-request'
import { getAuditTimeLineData } from '@/api/business/audit'

const { query } = useRoute()

const processId = query.processInstanceId as string

const { data: list, pending: listPending } = useRequest(() => getAuditTimeLineData(processId), {
  immediate: true,
})
</script>
