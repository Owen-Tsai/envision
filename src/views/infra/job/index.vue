<template>
  <div class="view">
    <ACard v-if="permission.has('infra:job:query')" class="mb-4">
      <AForm
        ref="filterForm"
        :label-col="{ span: 6 }"
        class="dense-form"
        :class="{ expanded: filterExpanded }"
        :model="queryParams"
      >
        <ARow :gutter="[0, 16]">
          <ACol :lg="8" :span="24">
            <AFormItem label="配置名称" name="name">
              <AInput v-model:value="queryParams.name" placeholder="请输入配置名称" allow-clear />
            </AFormItem>
          </ACol>
          <ACol :lg="8" :span="24">
            <AFormItem label="任务状态" name="status">
              <ASelect
                v-model:value="queryParams.status"
                :options="infraJobStatus"
                placeholder="请选择任务状态"
                allow-clear
              />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="处理器名称">
              <AInput
                v-model:value="queryParams.handlerName"
                placeholder="请输入处理器名称"
                allow-clear
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

    <ACard title="文件配置">
      <template #extra>
        <AFlex :gap="8">
          <AButton
            v-if="permission.has('infra:job:create')"
            type="primary"
            :loading="pending"
            @click="onEdit()"
          >
            <template #icon>
              <PlusOutlined />
            </template>
            新增
          </AButton>
          <ATooltip v-if="permission.has('infra:job:export')" title="导出">
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
          <template #bodyCell="scope: TableScope<JobVO>">
            <template v-if="scope?.column.key === 'status'">
              <EDictTag :dict-object="infraJobStatus" :value="scope.text" />
            </template>
            <template v-if="scope?.column.key === 'createTime'">
              {{ dayjs(scope.text).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
            <template v-if="scope?.column.title === '操作'">
              <AFlex :gap="16">
                <ATypographyLink
                  v-if="permission.has('infra:job:update')"
                  @click="onEdit(scope!.record)"
                >
                  <EditOutlined />
                  编辑
                </ATypographyLink>
                <ADropdown v-if="permission.hasOne('infra:job:update', 'infra:job:trigger')">
                  <ATypographyLink>
                    <DownOutlined />
                    更多
                  </ATypographyLink>
                  <template #overlay>
                    <AMenu>
                      <AMenuItem
                        :disabled="!permission.has('infra:job:update')"
                        @click="onStatusChange(scope.record)"
                      >
                        {{ scope.record.status === jobStatusEnums.stop ? '开启' : '暂停' }}
                      </AMenuItem>
                      <AMenuDivider />
                      <AMenuItem
                        :disabled="!permission.has('infra:job:trigger')"
                        @click="onTriggerJob(scope.record)"
                      >
                        手动执行
                      </AMenuItem>
                      <AMenuDivider />
                      <AMenuItem @click="onShowDetail(scope.record)">任务详情</AMenuItem>
                      <AMenuItem @click="onShowLog(scope.record)">调度日志</AMenuItem>
                    </AMenu>
                  </template>
                </ADropdown>
                <APopconfirm
                  v-if="permission.has('infra:job:delete')"
                  title="该操作无法撤销，确定要删除吗？"
                  :overlay-style="{ width: '240px' }"
                  @confirm="onDelete(scope!.record)"
                >
                  <ATypographyLink type="danger">
                    <DeleteOutlined />
                    删除
                  </ATypographyLink>
                </APopconfirm>
              </AFlex>
            </template>
          </template>
        </ATable>
      </div>
    </ACard>

    <FormModal
      v-if="visible.form"
      :record="entry"
      @success="execute"
      @close="visible.form = false"
    />

    <DetailModal v-if="visible.detail" :record="entry" @close="visible.detail = false" />
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
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons-vue'
import useDict from '@/hooks/use-dict'
import { permission } from '@/hooks/use-permission'
import FormModal from './form.vue'
import DetailModal from './detail.vue'
import { columns, useTable } from './use-table'
import useActions from './use-actions'
import type { FormInstance } from 'ant-design-vue'
import type { JobVO } from '@/api/infra/job'

const jobStatusEnums = {
  init: 0,
  normal: 1,
  stop: 2,
}

const filterForm = ref<FormInstance>()

const [filterExpanded, toggle] = useToggle(false)

const [infraJobStatus] = useDict('infra_job_status')

const { data, pending, execute, queryParams, onFilter, onChange, onFilterReset, pagination } =
  useTable(filterForm)

const { entry, visible, onDelete, onEdit, onShowDetail, onShowLog, onStatusChange, onTriggerJob } =
  useActions(execute)

defineOptions({ name: 'InfraJobList' })
</script>
