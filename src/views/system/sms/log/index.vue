<template>
  <div class="view">
    <ACard v-if="permission.has('system:sms-log:query')" class="mb-4">
      <AForm ref="filterFormRef" :model="queryParams" class="dense-filter-form">
        <ARow :gutter="[24, 16]">
          <ACol :span="24" :lg="8">
            <AFormItem label="手机号" name="mobile">
              <AInput v-model:value="queryParams.mobile" placeholder="请输入接收手机号" />
            </AFormItem>
          </ACol>
          <ACol :span="24" :lg="8">
            <AFormItem label="模板编码" name="templateCode">
              <AInput v-model:value="queryParams.templateCode" placeholder="请输入短信模板编码" />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :span="24" :lg="8">
            <AFormItem label="短信渠道" name="channelId">
              <ASelect
                v-model:value="queryParams.channelId"
                :options="channelList"
                :field-names="{ label: 'signature', value: 'id' }"
                placeholder="请选择短信渠道"
              />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :span="24" :lg="8">
            <AFormItem label="发送状态" name="sendStatus">
              <ASelect
                v-model:value="queryParams.sendStatus"
                :options="systemSmsSendStatus"
                placeholder="请选择发送状态"
              />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :span="24" :lg="8">
            <AFormItem label="发送时间" name="sendTime">
              <ARangePicker v-model:value="queryParams.sendTime" value-format="YYYY-MM-DD" />
            </AFormItem>
          </ACol>

          <ACol :span="24" :lg="8">
            <AFlex justify="end" align="center" :gap="16">
              <AButton html-type="reset" @click="onFilterReset">重置</AButton>
              <AButton html-type="submit" type="primary" @click="onFilter">查询</AButton>
              <ATypographyLink @click="toggle()">
                {{ filterExpanded ? '收起' : '展开' }}
                <DownOutlined :class="{ 'rotate-180': filterExpanded }" />
              </ATypographyLink>
            </AFlex>
          </ACol>
        </ARow>
      </AForm>
    </ACard>

    <ACard title="短信渠道">
      <template #extra>
        <AFlex :gap="8">
          <ATooltip v-if="permission.has('system:sms-log:export')" title="导出">
            <AButton type="text" :loading="pending">
              <template #icon>
                <ExportOutlined />
              </template>
            </AButton>
          </ATooltip>
          <ATooltip title="重新载入">
            <AButton type="text" :loading="pending" @click="execute">
              <template #icon>
                <ReloadOutlined />
              </template>
            </AButton>
          </ATooltip>
        </AFlex>
      </template>

      <ATable
        :columns="columns"
        :data-source="data?.list"
        :loading="pending"
        :pagination="pagination"
        :scroll="{ x: 1200 }"
        :sticky="{ offsetHeader: 90 }"
        @change="onChange"
      >
        <template #bodyCell="scope: TableScope<LogVO>">
          <template v-if="scope?.column.key === 'templateType'">
            <EDictTag :dict-object="systemSmsTemplateType" :value="scope.text" />
          </template>
          <template v-if="scope?.column.key === 'sendStatus'">
            <EDictTag :dict-object="systemSmsSendStatus" :value="scope.text" />
          </template>
          <template v-if="scope?.column.key === 'receiveStatus'">
            <EDictTag :dict-object="systemSmsReceiveStatus" :value="scope.text" />
          </template>
          <template v-if="scope?.column.key === 'channelCode'">
            <div>
              {{ channelList.find((e) => e.id === scope.record.channelId)?.signature }}
            </div>
            <div>
              <EDictTag :dict-object="systemSmsChannelCode" :value="scope.text" />
            </div>
          </template>
          <template v-if="scope?.column.key === 'sendTime'">
            {{ formatDate(scope.text) }}
          </template>
          <template v-if="scope?.column.key === 'actions'">
            <AFlex :gap="16">
              <ATypographyLink @click="showDialog(scope.record)">
                <UnorderedListOutlined />
                详情
              </ATypographyLink>
            </AFlex>
          </template>
        </template>
      </ATable>
    </ACard>

    <ADrawer v-model:open="visible" width="50%" title="日志详情">
      <DetailPanel :entry="entry!" />
    </ADrawer>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
// import { message } from 'ant-design-vue'
import {
  DownOutlined,
  ReloadOutlined,
  ExportOutlined,
  UnorderedListOutlined
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { permission } from '@/hooks/use-permission'
import useDict from '@/hooks/use-dict'
import { getSimpleChannelList, type ChannelListLiteVO } from '@/api/system/sms/channel'
import { type LogVO } from '@/api/system/sms/log'
import { useToggle } from '@vueuse/core'
import { useTable, columns } from './use-table'

const filterFormRef = ref()

const [filterExpanded, toggle] = useToggle()

const { systemSmsReceiveStatus, systemSmsSendStatus, systemSmsChannelCode, systemSmsTemplateType } =
  useDict(
    'system_sms_receive_status',
    'system_sms_send_status',
    'system_sms_channel_code',
    'system_sms_template_type'
  )

const visible = ref(false)
// current entry for editing
const entry = ref()

const channelList = ref<ChannelListLiteVO>([])

const showDialog = (record?: LogVO) => {
  entry.value = record
  visible.value = true
}

const formatDate = (date: number) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

const { data, execute, onChange, onFilter, onFilterReset, pagination, pending, queryParams } =
  useTable(filterFormRef)

getSimpleChannelList().then((res) => {
  channelList.value = res
})
</script>
