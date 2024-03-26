<template>
  <div class="view">
    <ACard v-if="permission.has('system:login-log:query')" class="mb-4">
      <AForm
        ref="filterForm"
        :label-col="{ span: 6 }"
        class="dense-filter-form"
        :class="{ expanded: filterExpanded }"
        :model="queryParams"
      >
        <ARow :gutter="[0, 16]">
          <ACol :lg="8" :span="24">
            <AFormItem label="系统模块" name="module">
              <AInput v-model:value="queryParams.module" placeholder="请输入系统模块" allow-clear />
            </AFormItem>
          </ACol>
          <ACol :lg="8" :span="24">
            <AFormItem label="操作人员" name="userNickname">
              <AInput
                v-model:value="queryParams.userNickname"
                placeholder="请输入操作人员"
                allow-clear
              />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="操作类型" name="type">
              <ASelect
                v-model:value="queryParams.type"
                :options="systemOperateType"
                placeholder="请选择操作类型"
              />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="操作状态" name="type">
              <ASelect v-model:value="queryParams._success">
                <ASelectOption value="success">成功</ASelectOption>
                <ASelectOption value="fail">失败</ASelectOption>
              </ASelect>
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="开始时间">
              <ARangePicker v-model:value="queryParams.startTime" value-format="YYYY-MM-DD" />
            </AFormItem>
          </ACol>
          <ACol :lg="{ span: 8, offset: filterExpanded ? 8 : 0 }" :span="24">
            <AFlex justify="end" align="center" :gap="16">
              <AButton @click="onFilterReset">重置</AButton>
              <AButton type="primary" @click="onFilter">查询</AButton>
              <ATypographyLink @click="toggle()">
                {{ filterExpanded ? '收起' : '展开' }}
                <DownOutlined :class="{ 'rotate-180': filterExpanded }" />
              </ATypographyLink>
            </AFlex>
          </ACol>
        </ARow>
      </AForm>
    </ACard>

    <ACard title="登录日志">
      <template #extra>
        <AFlex :gap="8">
          <ATooltip v-if="permission.has('system:login-log:export')" title="导出">
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

      <div class="overflow-x-auto">
        <ATable
          :columns="columns"
          :data-source="data?.list"
          :loading="pending"
          :pagination="pagination"
          @change="onChange"
        >
          <template #bodyCell="scope">
            <template v-if="scope!.column.dataIndex === 'type'">
              <EDictTag :dict-object="systemOperateType" :value="scope?.text" />
            </template>
            <template v-if="scope!.column.dataIndex === 'resultCode'">
              <ATag v-if="scope?.text === 0" color="success">成功</ATag>
              <ATag v-else color="error">{{ scope?.text }}</ATag>
            </template>
            <template v-if="scope?.column.dataIndex === 'startTime'">
              {{ dayjs(scope.text).format('YYYY-MM-DD') }}
            </template>
            <template v-if="scope?.column.dataIndex === 'duration'">{{ scope.text }} ms</template>
            <template v-if="scope!.column.title === '操作'">
              <ATypographyLink @click="openDetail(scope!.record)">
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
  ExportOutlined,
  ReloadOutlined,
  UnorderedListOutlined
} from '@ant-design/icons-vue'
import useDict from '@/hooks/use-dict'
import { permission } from '@/hooks/use-permission'
import { columns, useTable } from './use-table'
import DetailPanel from './detail.vue'
import type { FormInstance } from 'ant-design-vue'
import type { OperateLogVO } from '@/api/system/operate-log'

const filterForm = ref<FormInstance>()

const [filterExpanded, toggle] = useToggle(false)

const { systemOperateType } = useDict('system_operate_type')

const { data, pending, execute, queryParams, onFilter, onChange, onFilterReset, pagination } =
  useTable(filterForm)

const entry = ref<OperateLogVO>()
const visible = ref(false)

const openDetail = (row: OperateLogVO) => {
  entry.value = row
  visible.value = true
}

defineOptions({ name: 'SystemOperateLog' })
</script>
