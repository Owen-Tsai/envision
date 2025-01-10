<template>
  <div>
    <ADescriptions bordered :column="2" size="middle" :label-style="{ width: '120px' }">
      <ADescriptionsItem label="日志主键">{{ entry.id }}</ADescriptionsItem>
      <ADescriptionsItem label="发送方名称">{{ entry.templateNickname }}</ADescriptionsItem>
      <ADescriptionsItem label="接收方ID">{{ entry.userId }}</ADescriptionsItem>
      <ADescriptionsItem label="用户类型">
        <DictTag :dict-object="systemUserType" :value="entry.userType!" />
      </ADescriptionsItem>
      <ADescriptionsItem label="站内信模板">
        {{ entry.templateId }}
        <ADivider type="vertical" />
        {{ entry.templateCode }}
      </ADescriptionsItem>
      <ADescriptionsItem label="模板类型">
        <DictTag :dict-object="systemNotifyTemplateType" :value="entry.templateType!" />
      </ADescriptionsItem>
      <ADescriptionsItem label="站内信内容" :span="2">
        {{ entry.templateContent }}
      </ADescriptionsItem>
      <ADescriptionsItem label="站内信参数" :span="2">
        <pre>{{ entry.templateParams }}</pre>
      </ADescriptionsItem>
      <ADescriptionsItem label="发送时间" :span="2">
        {{ dayjs(entry.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </ADescriptionsItem>
      <ADescriptionsItem label="阅读状态">
        <DictTag :dict-object="infraBooleanString" :value="entry.readStatus!.toString()" />
      </ADescriptionsItem>
      <ADescriptionsItem label="阅读时间">
        {{ dayjs(entry.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </ADescriptionsItem>
    </ADescriptions>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import useDict from '@/hooks/use-dict'
import type { LogVO } from '@/api/system/message/log'

defineProps({
  entry: {
    type: Object as PropType<LogVO>,
    required: true,
  },
})

const [infraBooleanString, systemUserType, systemNotifyTemplateType] = useDict(
  'infra_boolean_string',
  'system_user_type',
  'system_notify_template_type',
)
</script>
