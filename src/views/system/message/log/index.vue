<template>
  <div class="view">
    <ACard v-if="permission.has('system:message-log:query')" class="mb-4">
      <AForm ref="filterFormRef" :model="queryParams" class="dense-form">
        <ARow :gutter="[24, 16]">
          <ACol :span="24" :lg="8">
            <AFormItem label="用户ID" name="userId">
              <AInput v-model:value="queryParams.userId" placeholder="请输入接收用户的 ID" />
            </AFormItem>
          </ACol>
          <ACol :span="24" :lg="8">
            <AFormItem label="用户类型" name="userType">
              <ASelect
                v-model:value="queryParams.userType"
                :options="systemUserType"
                placeholder="请选择接收用户的类型"
              />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :span="24" :lg="8">
            <AFormItem label="模板编码" name="templateCode">
              <AInput v-model:value="queryParams.templateCode" placeholder="请输入站内信模板编码" />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :span="24" :lg="8">
            <AFormItem label="模板类型" name="templateType">
              <ASelect
                v-model:value="queryParams.templateType"
                :options="systemNotifyTemplateType"
                placeholder="请选择站内信模板类型"
              />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :span="24" :lg="8">
            <AFormItem label="发送时间" name="createTime">
              <ARangePicker
                show-time
                v-model:value="queryParams.createTime"
                value-format="YYYY-MM-DD"
              />
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
          <ATooltip v-if="permission.has('system:message-log:export')" title="导出">
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
            <EDictTag :dict-object="systemNotifyTemplateType" :value="scope.text" />
          </template>
          <template v-if="scope?.column.key === 'readStatus'">
            <EDictTag :dict-object="infraBooleanString" :value="scope.text" />
          </template>
          <template v-if="scope?.column.key === 'userType'">
            <EDictTag :dict-object="systemUserType" :value="scope.text" />
          </template>
          <template v-if="scope?.column.key === 'createTime'">
            {{ formatDate(scope.text) }}
          </template>
          <template v-if="scope?.column.key === 'readTime'">
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
import {
  DownOutlined,
  ReloadOutlined,
  ExportOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { permission } from '@/hooks/use-permission'
import useDict from '@/hooks/use-dict'
import { type LogVO } from '@/api/system/sms/log'
import { useToggle } from '@vueuse/core'
import { useTable, columns } from './use-table'
import DetailPanel from './detail.vue'

const filterFormRef = ref()

const [filterExpanded, toggle] = useToggle()

const { infraBooleanString, systemUserType, systemNotifyTemplateType } = useDict(
  'infra_boolean_string',
  'system_user_type',
  'system_notify_template_type',
)

const visible = ref(false)
// current entry for editing
const entry = ref()

const showDialog = (record?: LogVO) => {
  entry.value = record
  visible.value = true
}

const formatDate = (date: number) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

const { data, execute, onChange, onFilter, onFilterReset, pagination, pending, queryParams } =
  useTable(filterFormRef)

defineOptions({ name: 'SystemMessageLog' })
</script>
