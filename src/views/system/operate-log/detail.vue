<template>
  <div>
    <ADescriptions bordered :column="2" size="middle" :label-style="{ width: '120px' }">
      <ADescriptionsItem label="日志主键">{{ entry.id }}</ADescriptionsItem>
      <ADescriptionsItem label="链路追踪">{{ entry.traceId }}</ADescriptionsItem>
      <ADescriptionsItem label="操作人编号">{{ entry.userId }}</ADescriptionsItem>
      <ADescriptionsItem label="操作人名称">{{ entry.userNickname }}</ADescriptionsItem>
      <ADescriptionsItem label="操作人IP" :span="2">{{ entry.userIp }}</ADescriptionsItem>
      <ADescriptionsItem label="操作人UA" :span="2">{{ entry.userAgent }}</ADescriptionsItem>
      <ADescriptionsItem label="操作模块" :span="2">{{ entry.module }}</ADescriptionsItem>
      <ADescriptionsItem label="操作内容" :span="2">{{ entry.name }}</ADescriptionsItem>
      <ADescriptionsItem label="请求目标" :span="2" :content-style="{ fontFamily: 'monospace' }">
        {{ `${entry.requestMethod} ${entry.requestUrl}` }}
      </ADescriptionsItem>
      <ADescriptionsItem label="Java 方法" :span="2" :content-style="{ fontFamily: 'monospace' }">
        {{ entry.javaMethod }}
      </ADescriptionsItem>
      <ADescriptionsItem
        label="Java 方法参数"
        :span="2"
        :content-style="{ fontFamily: 'monospace' }"
      >
        {{ entry.javaMethodArgs }}
      </ADescriptionsItem>
      <ADescriptionsItem label="操作时间">
        {{ dayjs(entry.startTime).format('YYYY-MM-DD HH:mm:ss') }}
      </ADescriptionsItem>
      <ADescriptionsItem label="执行用时">{{ entry.duration }} ms</ADescriptionsItem>
      <ADescriptionsItem label="执行结果" :span="2">
        {{ `【${entry.resultCode}】${entry.resultMsg}` }}
      </ADescriptionsItem>
      <ADescriptionsItem label="返回数据" :span="2" :content-style="{ fontFamily: 'monospace' }">
        {{ entry.resultData }}
      </ADescriptionsItem>
    </ADescriptions>
  </div>
</template>

<script lang="ts" setup>
import { type PropType } from 'vue'
import dayjs from 'dayjs'
import type { OperateLogVO } from '@/api/system/operate-log'

defineProps({
  entry: {
    type: Object as PropType<OperateLogVO>,
    required: true,
  },
})
</script>
