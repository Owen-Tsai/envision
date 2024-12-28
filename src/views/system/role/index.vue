<template>
  <div class="view">
    <ACard v-if="permission.has('system:role:query')" class="mb-4">
      <AForm
        ref="filterForm"
        :label-col="{ span: 6 }"
        class="dense-form"
        :class="{ expanded: filterExpanded }"
        :model="queryParams"
      >
        <ARow :gutter="[0, 16]">
          <ACol :lg="8" :span="24">
            <AFormItem label="角色名称" name="name">
              <AInput v-model:value="queryParams.name" placeholder="请输入角色名称" allow-clear />
            </AFormItem>
          </ACol>
          <ACol :lg="8" :span="24">
            <AFormItem label="角色标识" name="code">
              <AInput v-model:value="queryParams.code" placeholder="请输入角色标识" allow-clear />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="角色状态" name="status">
              <ASelect
                v-model:value="queryParams.status"
                :options="commonStatus"
                placeholder="请选择角色状态"
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

    <ACard title="角色列表">
      <template #extra>
        <AFlex :gap="8">
          <AButton
            v-if="permission.has('system:role:create')"
            type="primary"
            :loading="pending"
            @click="onEdit()"
          >
            <template #icon>
              <PlusOutlined />
            </template>
            新增
          </AButton>
          <ATooltip v-if="permission.has('system:role:export')" title="导出">
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
          <template #bodyCell="scope: TableScope<RoleVO>">
            <template v-if="scope!.column.key === 'status'">
              <EDictTag :dict-object="commonStatus" :value="scope?.text" />
            </template>
            <template v-if="scope?.column.key === 'createTime'">
              {{ dayjs(scope.record.createTime).format('YYYY-MM-DD') }}
            </template>
            <template v-if="scope?.column.title === '操作'">
              <AFlex :gap="16">
                <ATypographyLink
                  v-if="permission.has('system:role:update')"
                  @click="onEdit(scope.record)"
                >
                  <EditOutlined />
                  编辑
                </ATypographyLink>
                <ADropdown
                  v-if="
                    permission.hasOne(
                      'system:permission:assign-role-menu',
                      'system:permission:assign-role-data-scope',
                    )
                  "
                >
                  <ATypographyLink>
                    <DownOutlined />
                    权限配置
                  </ATypographyLink>
                  <template #overlay>
                    <AMenu>
                      <AMenuItem
                        :disabled="!permission.has('system:permission:assign-role-menu')"
                        @click="onSetPermission(scope.record, 'menu')"
                      >
                        菜单权限
                      </AMenuItem>
                      <AMenuItem
                        :disabled="!permission.has('system:permission:assign-role-data-scope')"
                        @click="onSetPermission(scope.record, 'data')"
                      >
                        数据权限
                      </AMenuItem>
                    </AMenu>
                  </template>
                </ADropdown>
                <APopconfirm
                  v-if="permission.has('system:role:delete')"
                  title="此操作不可撤销，确定要删除吗？"
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

    <!-- 编辑角色 -->
    <FormModal v-model:open="visible.edit" :record="entry" @success="execute" />
    <!-- 编辑角色的菜单权限 -->
    <PermissionFormModal
      v-model:open="visible.permissionConfig"
      :record="entry!"
      :mode="permissionType"
      @success="execute"
    />
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import useDict from '@/hooks/use-dict'
import { permission } from '@/hooks/use-permission'
import FormModal from './form.vue'
import PermissionFormModal from './permission-form.vue'
import { columns, useTable } from './use-table'
import useActions from './use-actions'
import type { FormInstance } from 'ant-design-vue'
import type { RoleVO } from '@/api/system/role'

const filterForm = ref<FormInstance>()

const [filterExpanded, toggle] = useToggle(false)

const [commonStatus] = useDict('common_status')

const { data, pending, execute, queryParams, onFilter, onFilterReset, onChange, pagination } =
  useTable(filterForm)

const { entry, visible, permissionType, onDelete, onEdit, onSetPermission } = useActions(execute)

defineOptions({ name: 'SystemRole' })
</script>
