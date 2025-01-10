<template>
  <div class="view">
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
                {{
                  taskDefKey == 'All'
                    ? scope?.record.taskName
                      ? scope?.record.taskName + ' '
                      : ''
                    : ''
                }}审核中
              </a-tag>
              <a-tag color="success" v-else-if="scope.record.auditProcess === '1'">审核通过</a-tag>
              <a-tag color="error" v-else-if="scope.record.auditProcess === '2'">审核未通过</a-tag>
              <a-tag color="warning" v-else-if="scope.record.auditProcess === '3'">打回修改</a-tag>
            </template>
            <template v-if="scope?.column.key === 'submitTime'">
              {{ dayjs(scope.record.submitTime).format('YYYY-MM-DD HH:mm:ss') }}
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
import dayjs from 'dayjs'
import useDict from '@/hooks/use-dict'
import { columns, useTable } from './use-table'
import type { FormInstance } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'

const { query, params } = useRoute()
const { push } = useRouter()
const taskDefKey = query.taskDefKey
const appId = params.appId

const filterForm = ref<FormInstance>()

const [commonStatus] = useDict('common_status')

const { data, pending, execute, onChange, pagination } = useTable(filterForm)

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
      taskDefKey,
  )
}

defineOptions({ name: 'Audit' })
</script>
