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
            <AFormItem label="处理器名称" name="handlerName">
              <AInput
                v-model:value="queryParams.handlerName"
                placeholder="请输入处理器名称"
                allow-clear
              />
            </AFormItem>
          </ACol>
          <ACol :lg="8" :span="24">
            <AFormItem label="开始执行时间" name="beginTime">
              <ADatePicker v-model:value="queryParams.beginTime" value-format="YYYY-MM-DD" />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="结束执行时间" name="endTime">
              <ADatePicker v-model:value="queryParams.endTime" value-format="YYYY-MM-DD" />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="任务状态" name="status">
              <ASelect
                v-model:value="queryParams.status"
                :options="infraJobLogStatus"
                placeholder="请选择任务状态"
              />
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

    <ACard title="定时任务日志">
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
            <AButton type="text" :loading="pending">
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
          <template #bodyCell="scope: TableScope<JobLogVO>">
            <template v-if="scope?.column.key === 'status'">
              <EDictTag :dict-object="infraJobLogStatus" :value="scope?.text" />
            </template>
            <template v-if="scope?.column.key === 'beginTime'">
              {{ dayjs(scope.record.beginTime).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
            <template v-if="scope?.column.key === 'duration'">{{ scope.text }}ms</template>
            <template v-if="scope?.column.title === '操作'">
              <ATypographyLink @click="openDetail(scope.record)">
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
  UnorderedListOutlined
} from '@ant-design/icons-vue'
import useDict from '@/hooks/use-dict'
import { permission } from '@/hooks/use-permission'
import { columns, useTable } from './use-table'
import DetailPanel from './detail.vue'
import type { FormInstance } from 'ant-design-vue'
import type { JobLogVO } from '@/api/infra/job/log'

const filterForm = ref<FormInstance>()

const [filterExpanded, toggle] = useToggle(false)

const [infraJobLogStatus] = useDict('infra_job_log_status')

const { data, pending, execute, queryParams, onFilter, onFilterReset, onChange, pagination } =
  useTable(filterForm)

const visible = ref(false)
const entry = ref<JobLogVO>()

const openDetail = (row: JobLogVO) => {
  entry.value = row
  visible.value = true
}

defineOptions({ name: 'InfraApiAccessLog' })
</script>
