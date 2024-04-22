<template>
  <div class="view">
    <ACard v-if="permission.has('system:notice:query')" class="mb-4">
      <AForm
        ref="filterForm"
        :label-col="{ span: 6 }"
        class="dense-filter-form"
        :class="{ expanded: filterExpanded }"
        :model="queryParams"
      >
        <ARow :gutter="[0, 16]">
          <ACol :lg="8" :span="24">
            <AFormItem label="公告标题" name="title">
              <AInput v-model:value="queryParams.title" placeholder="请输入公告标题" allow-clear />
            </AFormItem>
          </ACol>
          <ACol :lg="8" :span="24">
            <AFormItem label="公告类型" name="type">
              <ASelect
                v-model:value="queryParams.type"
                :options="systemNoticeType"
                placeholder="请选择公告类型"
              />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="公告状态" name="status">
              <ASelect
                v-model:value="queryParams.status"
                :options="commonStatus"
                placeholder="请选择公告状态"
              />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="创建时间" name="createTime">
              <ARangePicker v-model:value="queryParams.createTime" value-format="YYYY-MM-DD" />
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

    <ACard title="通知公告">
      <template #extra>
        <AFlex :gap="8">
          <AButton
            v-if="permission.has('system:notice:create')"
            type="primary"
            :loading="pending"
            @click="onEdit()"
          >
            <template #icon>
              <PlusOutlined />
            </template>
            新增
          </AButton>
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
          <template #bodyCell="scope: TableScope<NotificationVO>">
            <template v-if="scope!.column.key === 'status'">
              <EDictTag :dict-object="commonStatus" :value="scope?.text" />
            </template>
            <template v-if="scope!.column.key === 'type'">
              <EDictTag :dict-object="systemNoticeType" :value="scope?.text" />
            </template>
            <template v-if="scope?.column.key === 'createTime'">
              {{ dayjs(scope.record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
            <template v-if="scope?.column.title === '操作'">
              <AFlex :gap="16">
                <ATypographyLink
                  v-if="permission.has('system:notice:update')"
                  @click="onEdit(scope.record)"
                >
                  <EditOutlined />
                  编辑
                </ATypographyLink>
                <APopconfirm
                  v-if="permission.has('system:notice:delete')"
                  title="此操作不可恢复，确定删除吗？"
                  :overlay-style="{ width: '260px' }"
                  @confirm="onDelete(scope.record)"
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

    <FormModal v-if="visible" :record="entry" @success="execute" @close="visible = false" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
import { useToggle } from '@vueuse/core'
import {
  DownOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined
} from '@ant-design/icons-vue'
import useDict from '@/hooks/use-dict'
import { permission } from '@/hooks/use-permission'
import FormModal from './form.vue'
import { columns, useTable } from './use-table'
import useActions from './use-actions'
import type { FormInstance } from 'ant-design-vue'
import type { NotificationVO } from '@/api/system/notification'

const filterForm = ref<FormInstance>()

const [filterExpanded, toggle] = useToggle(false)

const { commonStatus, systemNoticeType } = useDict('common_status', 'system_notice_type')

const { data, pending, execute, queryParams, onFilter, onFilterReset, onChange, pagination } =
  useTable(filterForm)

const { entry, visible, onDelete, onEdit } = useActions(execute)

defineOptions({ name: 'SystemNotice' })
</script>
