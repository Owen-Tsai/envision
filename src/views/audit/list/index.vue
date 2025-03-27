<template>
  <div class="view">
    <div class="flex justify-between items-center mb-4">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <div v-if="appInfo?.iconBe">
            <img class="h-12 w-12 mr-4 rounded" :src="appInfo?.iconBe" />
          </div>
          <div>
            <h1>{{ appInfo?.name }}</h1>
            <div class="flex items-center text-muted gap-10">
              <div>审核环节：{{ appInfo?.linkName }}</div>
              <div>
                截止时间：{{
                  appInfo?.daily ? '常态化' : dayjs(appInfo?.endTime).format('YYYY-MM-DD')
                }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <AStatistic title="待审核" :value="45" />
      </div>
    </div>

    <ACard class="mb-4">
      <AForm ref="filterForm" :label-col="{ span: 6 }" class="dense-form" :model="queryParams">
        <ARow :gutter="[0, 16]">
          <ACol :lg="8" :span="24">
            <AFormItem label="申报人" name="startUser">
              <AInput
                v-model:value="queryParams.startUser"
                placeholder="请输入申报人姓名"
                allow-clear
              />
            </AFormItem>
          </ACol>
          <ACol :lg="8" :span="24">
            <AFormItem label="提交时间">
              <ARangePicker v-model:value="queryParams.createTime" value-format="YYYY-MM-DD" />
            </AFormItem>
          </ACol>
          <ACol :lg="8" :span="24">
            <AFlex justify="end" align="center" :gap="16">
              <AButton html-type="reset" @click="onFilterReset">重置</AButton>
              <AButton html-type="submit" type="primary" @click="onFilter">查询</AButton>
            </AFlex>
          </ACol>
        </ARow>
      </AForm>
    </ACard>

    <ACard title="审核列表">
      <template #extra>
        <AFlex :gap="8">
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
          :data-source="data"
          :loading="pending"
          :pagination="pagination"
          @change="onChange"
        >
          <template #bodyCell="scope: TableScope<any>">
            <template v-if="scope.column.key === 'auditProcess'">
              <ATag color="processing" v-if="scope.value === '0'">
                {{
                  taskKey == 'All'
                    ? scope?.record.taskName
                      ? scope?.record.taskName + ' '
                      : ''
                    : ''
                }}审核中
              </ATag>
              <ATag color="success" v-else-if="scope.value === '1'">审核通过</ATag>
              <ATag color="error" v-else-if="scope.value === '2'">审核未通过</ATag>
              <ATag color="warning" v-else-if="scope.value === '3'">打回修改</ATag>
            </template>
            <template v-if="scope.column.key === 'submitTime'">
              {{ dayjs(scope.text).format('YYYY.MM.DD HH:mm:ss') }}
            </template>
            <template v-if="scope?.column.title === '操作'">
              <AFlex :gap="16" v-if="taskKey != 'All'">
                <ATypographyLink @click="onAudit(scope.record)">
                  <EditOutlined />
                  审核
                </ATypographyLink>
              </AFlex>
              <AFlex :gap="16" v-else>
                <ATypographyLink @click="onAudit(scope.record)">
                  <EyeOutlined />
                  查看
                </ATypographyLink>
              </AFlex>
            </template>
          </template>
        </ATable>
      </div>
    </ACard>
  </div>
</template>

<script setup lang="ts">
import useAppInfo from './use-app-info'
import dayjs from 'dayjs'
import { useTable, columns } from './use-table'
import type { FormInstance } from 'ant-design-vue'

const filterForm = useTemplateRef<FormInstance>('filterForm')

const { query, params } = useRoute()
const { push } = useRouter()
const taskKey = query.taskDefKey

const { appInfo, appInfoLoading } = useAppInfo()
const { data, pagination, onChange, pending, queryParams, onFilter, onFilterReset, execute } =
  useTable(filterForm)

const onAudit = (record: any) => {
  push(
    '/business/' +
      params.appId +
      '/audit/form?' +
      'applyId=' +
      record.comApplyId +
      '&taskId=' +
      record.taskId +
      '&processInstanceId=' +
      record.processInstanceId +
      '&taskDefKey=' +
      taskKey,
  )
}
</script>
