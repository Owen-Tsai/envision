<template>
  <div class="view">
    <ACard v-if="permission.has('infra:api-access-log:query')" class="mb-4">
      <AForm
        ref="filterForm"
        :label-col="{ span: 6 }"
        class="dense-form"
        :class="{ expanded: filterExpanded }"
        :model="queryParams"
      >
        <ARow :gutter="[0, 16]">
          <ACol :lg="8" :span="24">
            <AFormItem label="用户ID" name="userId">
              <AInput v-model:value="queryParams.userId" placeholder="请输入用户ID" allow-clear />
            </AFormItem>
          </ACol>
          <ACol :lg="8" :span="24">
            <AFormItem label="请求类型" name="requestMethod">
              <ASelect
                v-model:value="queryParams.requestMethod"
                :options="requestMethodsOptions"
                placeholder="请选择请求类型"
              />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="应用名称" name="applicationName">
              <AInput
                v-model:value="queryParams.applicationName"
                placeholder="请输入应用名称"
                allow-clear
              />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="请求地址" name="requestUrl">
              <AInput
                v-model:value="queryParams.requestUrl"
                placeholder="请输入请求地址"
                allow-clear
              />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="响应码" name="resultCode">
              <AInput
                v-model:value="queryParams.resultCode"
                placeholder="请输入响应状态码"
                allow-clear
              />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="请求时间" name="beginTime">
              <ARangePicker v-model:value="queryParams.beginTime" value-format="YYYY-MM-DD" />
            </AFormItem>
          </ACol>
          <ACol :lg="{ span: 8, offset: filterExpanded ? 16 : 0 }" :span="24">
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

    <ACard title="访问日志">
      <template #extra>
        <AFlex :gap="8">
          <ATooltip title="重新载入">
            <AButton type="text" :loading="pending" @click="execute">
              <template #icon>
                <ReloadOutlined />
              </template>
            </AButton>
          </ATooltip>
          <ATooltip v-if="permission.has('infra:api-access-log:export')" title="导出">
            <AButton type="text" :loading="pending" @click="onExport">
              <template #icon>
                <ExportOutlined />
              </template>
            </AButton>
          </ATooltip>
        </AFlex>
      </template>

      <div class="overflow-x-auto">
        <ATable
          :columns="columns"
          :data-source="data?.list"
          :loading="pending"
          :pagination="pagination"
          @change="onChange"
        >
          <template #bodyCell="scope: TableScope<AccessLogVO>">
            <template v-if="scope?.column.key === 'userType'">
              <EDictTag :dict-object="userType" :value="scope?.text" />
            </template>
            <template v-if="scope?.column.key === 'requestUrl'">
              {{ scope.record.requestMethod }} {{ scope.record.requestUrl }}
            </template>
            <template v-if="scope?.column.key === 'beginTime'">
              {{ dayjs(scope.record.beginTime).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
            <template v-if="scope?.column.title === '操作'">
              <ATypographyLink @click="onCheckDetail(scope.record)">
                <UnorderedListOutlined />
                详情
              </ATypographyLink>
            </template>
          </template>
        </ATable>
      </div>
    </ACard>

    <ADrawer v-model:open="visible" width="50%" title="日志详情">
      <DetailPanel :entry="entry!" />
    </ADrawer>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
import { useToggle } from '@vueuse/core'
import {
  DownOutlined,
  ReloadOutlined,
  ExportOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons-vue'
import useDict from '@/hooks/use-dict'
import { permission } from '@/hooks/use-permission'
import { columns, useTable } from './use-table'
import DetailPanel from './detail.vue'
import type { FormInstance } from 'ant-design-vue'
import type { AccessLogVO } from '@/api/infra/api-log/access-log'
import useActions from './use-actions'

const requestMethodsOptions = [
  { value: 'GET' },
  { value: 'POST' },
  { value: 'PUT' },
  { value: 'DELETE' },
]

const filterForm = ref<FormInstance>()

const [filterExpanded, toggle] = useToggle(false)

const [userType] = useDict('user_type')

const { data, pending, execute, queryParams, onFilter, onFilterReset, onChange, pagination } =
  useTable(filterForm)

const { entry, visible, onCheckDetail, onExport } = useActions()

defineOptions({ name: 'InfraApiAccessLog' })
</script>
