<template>
  <div>
    <ADescriptions bordered :column="2" size="middle" :label-style="{ width: '120px' }">
      <ADescriptionsItem label="日志主键">{{ entry.id }}</ADescriptionsItem>
      <ADescriptionsItem label="短信渠道">
        {{ channelList.find((e) => e.id === entry.channelId) }}
      </ADescriptionsItem>
      <ADescriptionsItem label="短信模板">
        {{ entry.templateId }}
        <ADivider type="vertical" />
        {{ entry.templateCode }}
        <ADivider type="vertical" />
        <EDictTag :dict-object="systemSmsTemplateType" :value="entry.templateType!" />
      </ADescriptionsItem>
      <ADescriptionsItem label="API 模板编号">{{ entry.apiTemplateId }}</ADescriptionsItem>
      <ADescriptionsItem label="手机号">{{ entry.mobile }}</ADescriptionsItem>
      <ADescriptionsItem label="发送时间">
        {{ dayjs(entry.sendTime).format('YYYY-MM-DD HH:mm:ss') }}
      </ADescriptionsItem>
      <ADescriptionsItem label="短信内容" :span="2">{{ entry.templateContent }}</ADescriptionsItem>
      <ADescriptionsItem label="短信参数" :span="2">
        <pre>{{ entry.templateParams }}</pre>
      </ADescriptionsItem>
      <ADescriptionsItem label="发送状态">
        <EDictTag :dict-object="systemSmsSendStatus" :value="entry.sendStatus!" />
      </ADescriptionsItem>
      <ADescriptionsItem label="接收状态">
        <EDictTag :dict-object="systemSmsReceiveStatus" :value="entry.receiveStatus!" />
      </ADescriptionsItem>
      <ADescriptionsItem label="API 平台发送结果" :span="2">
        {{ entry.apiSendCode }}
        <ADivider type="vertical" />
        {{ entry.apiSendMsg }}
      </ADescriptionsItem>
      <ADescriptionsItem label="API 平台短信编号" :span="2">
        {{ entry.apiSerialNo }}
      </ADescriptionsItem>
    </ADescriptions>
  </div>
</template>

<script lang="ts" setup>
import { type PropType } from 'vue'
import dayjs from 'dayjs'
import useDict from '@/hooks/use-dict'
import type { LogVO } from '@/api/system/sms/log'
import type { ChannelListLiteVO } from '@/api/system/sms/channel'

defineProps({
  entry: {
    type: Object as PropType<LogVO>,
    required: true
  },
  channelList: {
    type: Array as PropType<ChannelListLiteVO>,
    required: true
  }
})

const [systemSmsReceiveStatus, systemSmsSendStatus, systemSmsTemplateType] = useDict(
  'system_sms_receive_status',
  'system_sms_send_status',
  'system_sms_channel_code',
  'system_sms_template_type'
)
</script>
