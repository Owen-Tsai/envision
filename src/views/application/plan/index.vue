<template>
  <div class="view">
    <ACard v-if="permission.has('system:apply-plan:query')" class="mb-4">
      <AForm
        ref="filterForm"
        :label-col="{ span: 6 }"
        class="dense-form"
        :class="{ expanded: filterExpanded }"
        :model="queryParams"
      >
        <ARow :gutter="[0, 16]">
          <ACol :lg="8" :span="24">
            <AFormItem label="计划名称" name="item">
              <AInput v-model:value="queryParams.item" placeholder="请输入计划名称" allow-clear />
            </AFormItem>
          </ACol>
          <ACol :lg="8" :span="24">
            <AFormItem label="所属应用" name="appId">
              <ASelect
                v-model:value="queryParams.appId"
                :options="appOpts"
                allow-clear
                :field-names="{ label: 'name', value: 'id' }"
              />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <!-- <AFormItem label="开始时间" name="startTime">
              <ADatePicker v-model:value="queryParams.startTime" value-format="YYYY-MM-DD" />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="截止时间" name="endTime">
              <ADatePicker v-model:value="queryParams.endTime" value-format="YYYY-MM-DD" />
            </AFormItem> -->
            <AFormItem label="起止时间" name="startTime">
              <ARangePicker v-model:value="queryParams.startTime" value-format="YYYY-MM-DD" />
            </AFormItem>
          </ACol>
          <ACol :lg="{ span: 8, offset: filterExpanded ? 8 : 0 }" :span="24">
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

    <ACard title="申报计划">
      <template #extra>
        <AFlex :gap="8">
          <AButton
            v-if="permission.has('system:apply-plan:create')"
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
          <template #bodyCell="scope: TableScope<PlanVO>">
            <template v-if="scope?.column.key === 'appId'">{{ scope.record.appName }}</template>
            <template v-if="scope?.column.key === 'startTime'">
              {{ dayjs(scope.text).format('YYYY-MM-DD HH:mm') }}
            </template>
            <template v-if="scope?.column.key === 'endTime'">
              {{ dayjs(scope.text).format('YYYY-MM-DD HH:mm') }}
            </template>
            <template v-if="scope?.column.title === '操作'">
              <AFlex :gap="16">
                <ATypographyLink
                  v-if="permission.has('system:apply-plan:update')"
                  @click="onEdit(scope!.record)"
                >
                  <EditOutlined />
                  编辑
                </ATypographyLink>
                <ATypographyLink @click="toDesignPage(scope!.record)">
                  <CodeOutlined />
                  设计应用
                </ATypographyLink>
                <APopconfirm
                  v-if="permission.has('system:apply-plan:delete')"
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

    <FormModal v-if="visible" :record="entry" @success="execute" @close="visible = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import { useToggle } from '@vueuse/core'
import useRequest from '@/hooks/use-request'
import {
  DownOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CodeOutlined
} from '@ant-design/icons-vue'
import { permission } from '@/hooks/use-permission'
import { useTable, columns } from './use-table'
import useActions from './use-action'
import FormModal from './form.vue'
import type { FormInstance } from 'ant-design-vue'
import type { PlanVO } from '@/api/application/plan'
import { getApplicationSimpleList } from '@/api/application'

const filterForm = ref<FormInstance>()

const [filterExpanded, toggle] = useToggle(false)

const { data, pending, execute, queryParams, onFilter, onChange, onFilterReset, pagination } =
  useTable(filterForm)

const { entry, visible, onDelete, onEdit, toDesignPage } = useActions(execute)
const { data: appOpts } = useRequest(getApplicationSimpleList, { immediate: true })
defineOptions({ name: 'SystemService' })
</script>
