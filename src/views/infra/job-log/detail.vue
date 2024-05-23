<template>
  <div>
    <ADescriptions bordered :column="2" size="middle" :label-style="{ width: '120px' }">
      <ADescriptionsItem label="日志编号">{{ entry.id }}</ADescriptionsItem>
      <ADescriptionsItem label="任务ID">{{ entry.jobId }}</ADescriptionsItem>
      <ADescriptionsItem label="处理器名称" :span="2">{{ entry.handlerName }}</ADescriptionsItem>
      <ADescriptionsItem label="处理器参数" :span="2">
        <pre>
          {{ entry.handlerParam }}
        </pre>
      </ADescriptionsItem>
      <ADescriptionsItem label="执行次数">第 {{ entry.executeIndex }} 次</ADescriptionsItem>
      <ADescriptionsItem label="执行用时">{{ entry.duration }} ms</ADescriptionsItem>
      <ADescriptionsItem label="执行开始时间">
        {{ dayjs(entry.beginTime).format('YYYY-MM-DD HH:mm:ss') }}
      </ADescriptionsItem>
      <ADescriptionsItem label="执行结束时间">
        {{ dayjs(entry.endTime).format('YYYY-MM-DD HH:mm:ss') }}
      </ADescriptionsItem>
      <ADescriptionsItem label="执行状态">
        <EDictTag :dict-object="infraJobLogStatus" :value="entry.status!" />
      </ADescriptionsItem>
      <ADescriptionsItem label="执行结果">{{ entry.result }}</ADescriptionsItem>
    </ADescriptions>
  </div>
</template>

<script lang="ts" setup>
import { type PropType } from 'vue'
import dayjs from 'dayjs'
import useDict from '@/hooks/use-dict'
import type { JobLogVO } from '@/api/infra/job/log'

const { infraJobLogStatus } = useDict('infra_job_log_status')

defineProps({
  entry: {
    type: Object as PropType<JobLogVO>,
    required: true
  }
})
</script>
