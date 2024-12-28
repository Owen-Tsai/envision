<template>
  <div>
    <ADescriptions bordered :column="2" size="middle" :label-style="{ width: '120px' }">
      <ADescriptionsItem label="日志主键">{{ entry.id }}</ADescriptionsItem>
      <ADescriptionsItem label="应用名">{{ entry.applicationName }}</ADescriptionsItem>
      <ADescriptionsItem label="用户信息">
        ID: {{ entry.userId }}
        <ADivider type="vertical" />
        <EDictTag :dict-object="userType" :value="entry.userType!" />
      </ADescriptionsItem>
      <ADescriptionsItem label="用户IP">{{ entry.userIp }}</ADescriptionsItem>
      <ADescriptionsItem label="用户设备" :span="2">{{ entry.userAgent }}</ADescriptionsItem>
      <ADescriptionsItem label="请求地址" :span="2">
        {{ entry.requestMethod }}
        {{ entry.requestUrl }}
      </ADescriptionsItem>
      <ADescriptionsItem label="请求参数" :span="2">
        <pre>{{ entry.requestParams }}</pre>
      </ADescriptionsItem>
      <ADescriptionsItem label="请求时间">
        {{ dayjs(entry.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </ADescriptionsItem>
      <ADescriptionsItem label="执行时长">{{ entry.duration }}ms</ADescriptionsItem>
      <ADescriptionsItem label="执行结果">
        {{ entry.resultCode === 0 ? '正常' : '错误' }}
      </ADescriptionsItem>
    </ADescriptions>
  </div>
</template>

<script lang="ts" setup>
import { type PropType } from 'vue'
import dayjs from 'dayjs'
import useDict from '@/hooks/use-dict'
import type { AccessLogVO } from '@/api/infra/api-log/access-log'

defineProps({
  entry: {
    type: Object as PropType<AccessLogVO>,
    required: true,
  },
})

const [userType] = useDict('user_type')
</script>
