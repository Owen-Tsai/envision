<template>
  <div class="view">
    <ARow :gutter="24">
      <ACol :span="24" :lg="5">
        <ACard :body-style="{ padding: '16px' }" class="dept-card">
          <AInput v-model:value="searchText" class="mb-4" placeholder="输入关键字过滤部门">
            <template #suffix>
              <SearchOutlined />
            </template>
          </AInput>
          <ATree
            v-if="!deptTreeLoading"
            v-model:selected-keys="selectedKeys"
            :tree-data="filteredTreeData"
            :field-names="{ key: 'id', title: 'name' }"
            default-expand-all
            @select="(key, { node }) => onTreeNodeSelect(node)"
          />
          <AFlex v-else vertical :gap="16" class="w-full">
            <ASkeletonButton v-for="i in 5" :key="i" block active />
          </AFlex>
        </ACard>
      </ACol>
      <ACol :span="24" :lg="19">
        <AFlex vertical class="h-full">
          <ACard v-if="permission.has('system:user:query')" class="mb-4">
            <AForm
              ref="filterForm"
              :model="queryParams"
              :label-col="{ style: { width: '64px' } }"
              class="dense-form"
              :class="{ expanded: filterExpanded }"
            >
              <ARow :gutter="[8, 16]">
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
                  <AFormItem label="用户名称" name="nickname">
                    <AInput
                      v-model:value="queryParams.nickname"
                      placeholder="请输入用户名称"
                      allow-clear
                    />
                  </AFormItem>
                </ACol>
                <ACol v-show="filterExpanded" :lg="8" :span="24">
                  <AFormItem label="手机号码" name="mobile">
                    <AInput
                      v-model:value="queryParams.mobile"
                      placeholder="请输入手机号码"
                      allow-clear
                    />
                  </AFormItem>
                </ACol>
                <ACol v-show="filterExpanded" :lg="8" :span="24">
                  <AFormItem label="注册时间" name="createTime">
                    <ARangePicker
                      v-model:value="queryParams.createTime"
                      value-format="YYYY-MM-DD"
                    />
                  </AFormItem>
                </ACol>
                <ACol v-show="filterExpanded" :lg="8" :span="24">
                  <AFormItem label="状态" name="status">
                    <ASelect
                      v-model:value="queryParams.status"
                      :options="commonStatus"
                      placeholder="请输入用户状态"
                    />
                  </AFormItem>
                </ACol>
                <ACol :lg="{ span: 8 }" :span="24">
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

          <ACard :title="`${currentDeptName}用户列表`" class="flex-1">
            <template #extra>
              <AFlex :gap="8">
                <AButton
                  v-if="permission.has('system:user:create')"
                  type="primary"
                  :loading="pending"
                  @click="onEdit()"
                >
                  <template #icon>
                    <PlusOutlined />
                  </template>
                  新增
                </AButton>
                <ATooltip v-if="permission.has('system:user:export')" title="导出">
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
            <ATable
              :columns="columns"
              :data-source="data?.list"
              :loading="pending"
              :pagination="pagination"
              :scroll="{ x: 1100 }"
              @change="onChange"
            >
              <template #bodyCell="scope: TableScope<UserVO>">
                <template v-if="scope?.column.key === 'status'">
                  <ASwitch
                    v-model:checked="scope.record.status"
                    :checked-value="0"
                    :un-checked-value="1"
                    checked-children="启用"
                    un-checked-children="停用"
                    @change="(v) => onSetStatus(scope.record, v as number)"
                  />
                </template>
                <template v-if="scope?.column.key === 'createTime'">
                  {{ dayjs(scope.record.createTime).format('YYYY-MM-DD') }}
                </template>
                <template v-if="scope?.column.key === 'actions'">
                  <AFlex :gap="16">
                    <ATypographyLink
                      v-if="permission.has('system:user:update')"
                      @click="onEdit(scope.record)"
                    >
                      <EditOutlined />
                      编辑
                    </ATypographyLink>
                    <ADropdown
                      v-if="
                        permission.hasOne(
                          'system:user:update',
                          'system:user:update-password',
                          'system:user:delete',
                          'system:permission:assign-user-role',
                        )
                      "
                    >
                      <ATypographyLink>
                        <DownOutlined />
                        更多
                      </ATypographyLink>
                      <template #overlay>
                        <AMenu>
                          <AMenuItem
                            :disabled="!permission.has('system:user:update-password')"
                            @click="onSetPassword(scope.record)"
                          >
                            重置密码
                          </AMenuItem>
                          <AMenuItem
                            :disabled="!permission.has('system:permission:assign-user-role')"
                            @click="onSetRole(scope.record)"
                          >
                            设置角色
                          </AMenuItem>
                          <AMenuDivider />
                          <AMenuItem
                            :disabled="!permission.has('system:user:delete')"
                            danger
                            @click="onDelete(scope.record)"
                          >
                            删除用户
                          </AMenuItem>
                        </AMenu>
                      </template>
                    </ADropdown>
                  </AFlex>
                </template>
              </template>
            </ATable>
          </ACard>
        </AFlex>
      </ACol>
    </ARow>

    <!-- add/edit user -->
    <FormModal v-model:open="visible.edit" :record="entry" @success="execute" />
    <!-- change password -->
    <PasswordFormModal v-model:open="visible.passwordReset" :record="entry!" @success="execute" />
    <!-- assign roles -->
    <RoleFormModal v-model:open="visible.roleConfig" :record="entry!" @success="execute" />
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import useDict from '@/hooks/use-dict'
import { permission } from '@/hooks/use-permission'
import FormModal from './form.vue'
import PasswordFormModal from './password-form.vue'
import RoleFormModal from './roles-form.vue'
import useDeptTree from './use-dept-tree'
import { columns, useUserTable } from './use-user-table'
import useActions from './use-actions'
import type { UserVO } from '@/api/system/user'
import type { FormInstance } from 'ant-design-vue'

// layout specific
const layout = import.meta.env.VITE_APP_LAYOUT
const style = ref<{ minHeight: string; top: string }>({
  minHeight: 'calc(100vh - 130px)',
  top: '110px',
})

if (layout === 'split') {
  style.value.minHeight = 'calc(100vh - 68px)'
  style.value.top = '52px'
}

const filterForm = useTemplateRef<FormInstance>('filterForm')

const [filterExpanded, toggle] = useToggle(false)

const [commonStatus] = useDict('common_status')

const { data, execute, pending, queryParams, pagination, onChange, onFilter, onFilterReset } =
  useUserTable(filterForm)

const {
  currentDeptName,
  deptTreeLoading,
  filteredTreeData,
  searchText,
  selectedKeys,
  onTreeNodeSelect,
} = useDeptTree(queryParams, execute)

const { entry, visible, onDelete, onEdit, onSetPassword, onSetRole, onSetStatus } =
  useActions(execute)

defineOptions({ name: 'SystemUser' })
</script>

<style lang="scss" scoped>
.dept-card {
  @apply sticky;
  top: v-bind('style.top');
  min-height: v-bind('style.minHeight');
}
</style>
