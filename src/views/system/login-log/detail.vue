<template>
  <div>
    <ADescriptions bordered :column="2" size="middle" :label-style="{ width: '120px' }">
      <ADescriptionsItem label="日志主键">{{ entry.id }}</ADescriptionsItem>
      <ADescriptionsItem label="操作类型">
        {{ systemLoginType.find((e) => e.value === entry.logType)?.label }}
      </ADescriptionsItem>
      <ADescriptionsItem label="用户编号">{{ entry.userId }}</ADescriptionsItem>
      <ADescriptionsItem label="用户账号">{{ entry.username }}</ADescriptionsItem>
      <ADescriptionsItem label="登录地址" :span="2">{{ entry.userIp }}</ADescriptionsItem>
      <ADescriptionsItem label="登录设备" :span="2">{{ entry.userAgent }}</ADescriptionsItem>
      <ADescriptionsItem label="登录结果">{{ entry.result }}</ADescriptionsItem>
      <ADescriptionsItem label="登录时间">
        {{ dayjs(entry.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </ADescriptionsItem>
    </ADescriptions>
  </div>
</template>

<script lang="ts" setup>
import { type PropType } from 'vue'
import dayjs from 'dayjs'
import useDict from '@/hooks/use-dict'
import type { LoginLogVO } from '@/api/system/login-log'

defineProps({
  entry: {
    type: Object as PropType<LoginLogVO>,
    required: true
  }
})

const { systemLoginType } = useDict('system_login_type')
</script>
