<template>
  <div class="view">
    <ACard v-if="permission.has('system:operate-log:query')" class="mb-4">
      <AForm
        ref="filterForm"
        :label-col="{ span: 6 }"
        class="dense-filter-form"
        :class="{ expanded: filterExpanded }"
        :model="queryParams"
      >
        <ARow :gutter="[0, 16]">
          <ACol :lg="8" :span="24">
            <AFormItem label="用户账号" name="username">
              <AInput
                v-model:value="queryParams.username"
                placeholder="请输入用户账号"
                allow-clear
              />
            </AFormItem>
          </ACol>
          <ACol :lg="8" :span="24">
            <AFormItem label="登录地址" name="userIp">
              <AInput v-model:value="queryParams.userIp" placeholder="请输入登录地址" allow-clear />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="登陆日期">
              <ARangePicker v-model:value="queryParams.createTime" value-format="YYYY-MM-DD" />
            </AFormItem>
          </ACol>
          <ACol :lg="{ span: 8, offset: filterExpanded ? 16 : 0 }" :span="24">
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
          <ATooltip v-if="permission.has('system:operate-log:export')" title="导出">
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
            <template v-if="scope!.column.dataIndex === 'logType'">
              {{ systemLoginType.find((e) => e.value === scope!.text)?.label }}
            </template>
            <template v-if="scope!.column.dataIndex === 'result'">
              <ATag v-if="scope?.text === 0" color="success">成功</ATag>
              <ATag v-else color="error">失败</ATag>
            </template>
            <template v-if="scope?.column.dataIndex === 'createTime'">
              {{ dayjs(scope.text).format('YYYY-MM-DD HH:mm:ss') }}
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
import type { LoginLogVO } from '@/api/system/login-log'

const filterForm = ref<FormInstance>()

const [filterExpanded, toggle] = useToggle(false)

const { systemLoginType } = useDict('system_login_type')

const { data, pending, execute, queryParams, onFilter, onChange, onFilterReset, pagination } =
  useTable(filterForm)

const entry = ref<LoginLogVO>()
const visible = ref(false)

const openDetail = (row: LoginLogVO) => {
  entry.value = row
  visible.value = true
}

defineOptions({ name: 'SystemLoginLog' })
</script>
