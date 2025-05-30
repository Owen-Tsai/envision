<template>
  <div class="view">
    <ACard v-if="permission.has('system:application:query')" class="mb-4">
      <AForm
        ref="filterForm"
        :label-col="{ span: 6 }"
        class="dense-form"
        :class="{ expanded: filterExpanded }"
        :model="queryParams"
      >
        <ARow :gutter="[0, 16]">
          <ACol :lg="8" :span="24">
            <AFormItem label="应用名称" name="name">
              <AInput v-model:value="queryParams.name" placeholder="请输入应用名称" allow-clear />
            </AFormItem>
          </ACol>
          <ACol :lg="8" :span="24">
            <AFormItem label="应用类别" name="type">
              <ASelect
                v-model:value="queryParams.type"
                :options="typeOpts"
                placeholder="请选择应用类别"
                allow-clear
              ></ASelect>
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="上架状态" name="status">
              <ASelect
                v-model:value="queryParams.published"
                :options="statusOpts"
                placeholder="请选择应用上架状态"
                allow-clear
              />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="创建时间">
              <ARangePicker v-model:value="queryParams.createTime" value-format="YYYY-MM-DD" />
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

    <ACard title="应用管理">
      <template #extra>
        <AFlex :gap="8">
          <AButton
            v-if="permission.has('system:application:create')"
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
          <template #bodyCell="scope: TableScope<ApplicationVO>">
            <template v-if="scope?.column.key === 'type'">
              <DictTag :dict-object="typeOpts" :value="scope.record.type!" />
            </template>
            <template v-if="scope?.column.key === 'published'">
              <ASwitch
                v-model:checked="scope.record.published"
                checked-children="已上架"
                un-checked-children="未上架"
                @change="(v) => onSetPublished(scope.record, v as boolean)"
              />
            </template>
            <template v-if="scope?.column.key === 'createTime'">
              {{ dayjs(scope.text).format('YYYY-MM-DD') }}
            </template>
            <template v-if="scope?.column.title === '操作'">
              <AFlex :gap="16">
                <ATypographyLink
                  v-if="permission.has('system:application:update')"
                  @click="onEdit(scope!.record)"
                >
                  <EditOutlined />
                  编辑
                </ATypographyLink>
                <ADropdown>
                  <ATypographyLink>
                    <DownOutlined />
                    更多
                  </ATypographyLink>
                  <template #overlay>
                    <AMenu>
                      <AMenuItem @click="toDesignPage(scope.record)">设计</AMenuItem>
                      <AMenuItem
                        @click="onAIAuditConfig"
                        :disabled="scope.record.id !== 'cB9QkrWFd99pLyu6'"
                        >AI 预审设置</AMenuItem
                      >
                      <AMenuDivider v-if="permission.has('system:application:delete')" />
                      <AMenuItem
                        danger
                        :disabled="!permission.has('system:application:delete')"
                        @click="onDelete(scope.record)"
                      >
                        删除
                      </AMenuItem>
                    </AMenu>
                  </template>
                </ADropdown>
              </AFlex>
            </template>
          </template>
        </ATable>
      </div>
    </ACard>

    <FormModal
      v-if="visible.editForm"
      :record="entry"
      @success="execute"
      @close="visible.editForm = false"
    />
    <AuditConfigModal v-model:open="visible.auditConfigForm" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import { useToggle } from '@vueuse/core'
import { DownOutlined, ReloadOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons-vue'
import useDict from '@/hooks/use-dict'
import { permission } from '@/hooks/use-permission'
import { useTable, columns } from './use-table'
import useActions from './use-action'
import FormModal from './form.vue'
import AuditConfigModal from '../ai-audit/config.vue'
import type { FormInstance } from 'ant-design-vue'
import type { ApplicationVO } from '@/api/application'

const filterForm = ref<FormInstance>()

const [filterExpanded, toggle] = useToggle(false)
const [statusOpts, typeOpts] = useDict('system_application_status', 'system_application_type')

console.log(typeOpts, statusOpts)

const { data, pending, execute, queryParams, onFilter, onChange, onFilterReset, pagination } =
  useTable(filterForm)

const { entry, visible, onDelete, onEdit, onSetPublished, toDesignPage, onAIAuditConfig } =
  useActions(execute)

defineOptions({ name: 'SystemService' })
</script>
