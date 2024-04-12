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
              class="dense-filter-form"
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

          <ACard :title="`${currentDeptName}用户列表`" class="flex-1">
            <template #extra>
              <AFlex :gap="8">
                <AButton
                  v-if="permission.has('system:user:create')"
                  type="primary"
                  :loading="pending"
                  @click="showUserModal()"
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
              @change="onChange"
            >
              <template #bodyCell="scope">
                <template v-if="scope?.column.key === 'status'">
                  <ASwitch
                    v-model:checked="scope.record.status"
                    :checked-value="0"
                    :un-checked-value="1"
                    checked-children="启用"
                    un-checked-children="停用"
                    @change="(v) => onStatusChange(scope.record.id, v as number)"
                  />
                </template>
                <template v-if="scope?.column.key === 'createTime'">
                  {{ formatDate(scope.record.createTime) }}
                </template>
                <template v-if="scope?.column.key === 'actions'">
                  <AFlex :gap="16">
                    <ATypographyLink
                      v-if="permission.has('system:user:update')"
                      @click="showUserModal(scope.record.id)"
                    >
                      <EditOutlined />
                      编辑
                    </ATypographyLink>
                    <ADropdown
                      v-if="permission.hasOne('system:user:update', 'system:user:update-password')"
                    >
                      <ATypographyLink>
                        <DownOutlined />
                        更多
                      </ATypographyLink>
                      <template #overlay>
                        <AMenu>
                          <AMenuItem
                            :disabled="!permission.has('system:user:update')"
                            @click="showPwdForm(scope.record.id, scope.record.nickname)"
                          >
                            重置密码
                          </AMenuItem>
                          <AMenuItem
                            :disabled="!permission.has('system:user:update')"
                            @click="showRoleModal(scope.record.id, scope.record.nickname)"
                          >
                            设置角色
                          </AMenuItem>
                          <AMenuDivider />
                          <AMenuItem
                            :disabled="permission.has('system:user:update-password')"
                            danger
                            @click="onDelete(scope.record.id)"
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
    <FormModal
      v-if="userModalVisible"
      :id="entryId"
      @success="execute"
      @close="userModalVisible = false"
    />
    <!-- change password -->
    <PasswordFormModal
      v-if="pwdModalVisible"
      :id="entryId!"
      :nickname="entryName!"
      @success="execute"
      @close="pwdModalVisible = false"
    />
    <!-- assign roles -->
    <RoleFormModal
      v-if="roleModalVisible"
      :id="entryId!"
      :nickname="entryName!"
      @success="execute"
      @close="roleModalVisible = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  SearchOutlined,
  EditOutlined,
  DownOutlined,
  PlusOutlined,
  ExportOutlined,
  ReloadOutlined
} from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import dayjs from 'dayjs'
import { updateUserStatus, deleteUser } from '@/api/system/user'
import useDict from '@/hooks/use-dict'
import { useToggle } from '@vueuse/core'
import { permission } from '@/hooks/use-permission'
import FormModal from './form.vue'
import PasswordFormModal from './password-form.vue'
import RoleFormModal from './roles-form.vue'
import useDeptTree from './use-dept-tree'
import { columns, useUserTable } from './use-user-table'
import { useAddOrUpdate, usePasswordReset, useRoleConfig } from './use-user-actions'
import type { Tree } from '@/utils/tree'

const filterForm = ref()

const [filterExpanded, toggle] = useToggle(false)

const { commonStatus } = useDict('common_status')

const entryId = ref<number | undefined>()
const entryName = ref<string | undefined>()

const { currentDeptName, deptTreeLoading, filteredTreeData, searchText, selectedKeys } =
  useDeptTree()

const { data, execute, pending, queryParams, pagination, onChange, onFilter, onFilterReset } =
  useUserTable(filterForm)

// for create/update user
const { modalVisible: userModalVisible, showModal: showUserModal } = useAddOrUpdate(entryId)
// for password reset
const { modalVisible: pwdModalVisible, showModal: showPwdForm } = usePasswordReset(
  entryId,
  entryName
)

// for config user roles
const { modalVisible: roleModalVisible, showModal: showRoleModal } = useRoleConfig(
  entryId,
  entryName
)

const onStatusChange = async (id: number, status: number) => {
  try {
    await updateUserStatus(id, status)
    message.success('操作成功')
  } finally {
    execute()
  }
}

const onDelete = (id: number) => {
  Modal.confirm({
    title: '删除用户',
    content: '此操作不可撤销，确定要删除该用户吗？',
    onOk() {
      deleteUser(id).then(() => {
        execute()
      })
    }
  })
}

let oldSelectedKey: number | string | undefined = undefined

const onTreeNodeSelect = (node: Tree) => {
  const hasSelected = node.key === oldSelectedKey
  if (!hasSelected) {
    oldSelectedKey = node.key
  } else {
    oldSelectedKey = undefined
  }
  currentDeptName.value = hasSelected ? '全部' : node.name
  queryParams.value.deptId = hasSelected ? undefined : node.key.toString()
  execute()
}

const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD')
}

defineOptions({ name: 'SystemUser' })
</script>

<style lang="scss" scoped>
.dept-card {
  @apply sticky;
  top: 110px;
  min-height: calc(100vh - 130px);
}
</style>
