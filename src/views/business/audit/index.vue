<template>
  <div class="view">
    <!--    <ACard class="mb-4">-->
    <AForm
      ref="filterForm"
      :label-col="{ span: 6 }"
      class="dense-form"
      :class="{ expanded: filterExpanded }"
      :model="queryParams"
    >
      <!--        <ARow :gutter="[0, 16]">-->
      <!--          <ACol :lg="8" :span="24">-->
      <!--            <AFormItem label="" name="applytype">-->
      <!--              <AInput v-model:value="queryParams.applytype" placeholder="请输入申报补贴类型" allow-clear />-->
      <!--            </AFormItem>-->
      <!--          </ACol>-->
      <!--          <ACol :lg="8" :span="24">-->
      <!--            <AFormItem label="分类认定认定类型" name="cognizancestandard">-->
      <!--              <AInput v-model:value="queryParams.cognizancestandard" placeholder="请输入分类认定认定类型" allow-clear />-->
      <!--            </AFormItem>-->
      <!--          </ACol>-->
      <!--          <ACol v-show="filterExpanded" :lg="8" :span="24">-->
      <!--            <AFormItem label="资金发放状态" name="status">-->
      <!--              <ASelect-->
      <!--                  v-model:value="queryParams.issuestate"-->
      <!--                  :options="commonStatus"-->
      <!--                  placeholder="请选择资金发放状态"-->
      <!--              />-->
      <!--            </AFormItem>-->
      <!--          </ACol>-->
      <!--          <ACol v-show="filterExpanded" :lg="8" :span="24">-->
      <!--            <AFormItem label="创建时间" name="createTime">-->
      <!--              <ARangePicker v-model:value="queryParams.createTime" value-format="YYYY-MM-DD" />-->
      <!--            </AFormItem>-->
      <!--          </ACol>-->
      <!--          <ACol :lg="{ span: 8, offset: filterExpanded ? 8 : 0 }" :span="24">-->
      <!--            <AFlex justify="end" align="center" :gap="16">-->
      <!--              <AButton html-type="reset" @click="onFilterReset">重置</AButton>-->
      <!--              <AButton html-type="submit" type="primary" @click="onFilter">查询</AButton>-->
      <!--              <ATypographyLink @click="toggle()">-->
      <!--                {{ filterExpanded ? '收起' : '展开' }}-->
      <!--                <DownOutlined :class="{ 'rotate-180': filterExpanded }" />-->
      <!--              </ATypographyLink>-->
      <!--            </AFlex>-->
      <!--          </ACol>-->
      <!--        </ARow>-->
    </AForm>
    <!--    </ACard>-->

    <ACard :title="taskDefKey == 'All' ? '信息库' : '申报列表'">
      <template #extra>
        <AFlex :gap="8">
          <!--          <ATooltip title="导出">-->
          <!--            <AButton type="text" :loading="pending">-->
          <!--              <template #icon>-->
          <!--                <ExportOutlined />-->
          <!--              </template>-->
          <!--            </AButton>-->
          <!--          </ATooltip>-->
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
            <template v-if="scope!.column.key === 'status'">
              <EDictTag :dict-object="commonStatus" :value="scope?.text" />
            </template>
            <template v-if="scope?.column.key === 'auditProcess'">
              <a-tag color="processing" v-if="scope.record.auditProcess === '0'">
                {{ taskDefKey == 'All' ? scope?.record.currentStepName : '' }}审核中
              </a-tag>
              <a-tag color="success" v-else-if="scope.record.auditProcess === '1'">审核通过</a-tag>
              <a-tag color="error" v-else-if="scope.record.auditProcess === '2'">审核未通过</a-tag>
              <a-tag color="warning" v-else-if="scope.record.auditProcess === '3'">打回修改</a-tag>
            </template>
            <template v-if="scope?.column.key === 'startTime'">
              {{ dayjs(scope.record.startTime).format('YYYY-MM-DD') }}
            </template>
            <template v-if="scope?.column.title === '操作'">
              <AFlex :gap="16" v-if="taskDefKey != 'All'">
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

<script lang="ts" setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
import { useToggle } from '@vueuse/core'
import { ReloadOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons-vue'
import useDict from '@/hooks/use-dict'
import { columns, useTable } from './use-table'
import type { FormInstance } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
const route = useRoute()
const { push } = useRouter()

const filterForm = ref<FormInstance>()

const [filterExpanded, toggle] = useToggle(false)

const [commonStatus] = useDict('common_status')

const { data, pending, execute, queryParams, onFilter, onFilterReset, onChange, pagination } =
  useTable(filterForm)

const taskDefKey = route.query.taskDefKey
// console.log('taskDefKey: ' + taskDefKey)
// route.query.appId
const appId = route.params.appId
// console.log('appId: ' + appId)

const onAudit = (record: any) => {
  push(
    '/business/life/audit/form?appId=' +
      appId +
      '&applyId=' +
      record.comApplyId +
      '&taskId=' +
      record.taskId +
      '&processInstanceId=' +
      record.processInstanceId +
      '&taskDefKey=' +
      taskDefKey
  )
}

defineOptions({ name: 'Audit' })
</script>
