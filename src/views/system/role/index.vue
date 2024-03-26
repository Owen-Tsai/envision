<template>
  <div class="view">
    <ACard v-if="permission.has('system:role:query')">
      <AForm
        ref="filterForm"
        :label-col="{ span: 6 }"
        class="dense-filter-form"
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

    <ACard title="角色列表" class="mt-4">
      <template #extra>
        <AFlex :gap="8">
          <AButton
            v-if="permission.has('system:role:create')"
            type="primary"
            :loading="pending"
            @click="showRoleConfigDialog()"
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
          <template #bodyCell="scope">
            <template v-if="scope!.column.dataIndex === 'status'">
              <EDictTag :dict-object="commonStatus" :value="scope?.text" />
            </template>
            <template v-if="scope?.column.dataIndex === 'createTime'">
              {{ dayjs(scope.record.createTime).format('YYYY-MM-DD') }}
            </template>
            <template v-if="scope!.column.title === '操作'">
              <AFlex :gap="16">
                <ATypographyLink
                  v-if="permission.has('system:role:update')"
                  @click="showRoleConfigDialog(scope?.record.id)"
                >
                  <EditOutlined />
                  编辑
                </ATypographyLink>
                <ADropdown
                  v-if="
                    permission.hasOne(
                      'system:permission:assign-role-menu',
                      'system:permission:assign-role-data-scope'
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
                        @click="showPermissionConfigDialog(scope!.record, 'menu')"
                      >
                        菜单权限
                      </AMenuItem>
                      <AMenuItem
                        :disabled="!permission.has('system:permission:assign-role-data-scope')"
                        @click="showPermissionConfigDialog(scope!.record, 'data')"
                      >
                        数据权限
                      </AMenuItem>
                    </AMenu>
                  </template>
                </ADropdown>
                <APopconfirm
                  v-if="permission.has('system:role:delete')"
                  title="删除角色后，也将一并解除拥有该角色的用户（如有）的相应权限。确定删除吗？"
                  :overlay-style="{ width: '260px' }"
                  @confirm="onDelete(scope?.record.id)"
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
    <FormModal
      v-if="roleModalVisible"
      :id="entry.id"
      @success="execute"
      @close="roleModalVisible = false"
    />
    <!-- 编辑角色的菜单权限 -->
    <PermissionFormModal v-if="permModalVisible.menuModal" :row="entry" :mode="mode" />
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
  PlusOutlined
} from '@ant-design/icons-vue'
import useDict from '@/hooks/use-dict'
import { permission } from '@/hooks/use-permission'
import { deleteRole, type RoleVO } from '@/api/system/role'
import FormModal from './form.vue'
import PermissionFormModal from './permission-form.vue'
import { columns, useTable } from './use-table'
import { usePermissionConfig, useRoleConfig } from './use-role-actions'
import { message, type FormInstance } from 'ant-design-vue'

const filterForm = ref<FormInstance>()

const [filterExpanded, toggle] = useToggle(false)

const { commonStatus } = useDict('common_status')

const { data, pending, execute, queryParams, onFilter, onFilterReset, onChange, pagination } =
  useTable(filterForm)

const entry = ref<RoleVO>({})

const { modalVisible: roleModalVisible, showDialog: showRoleConfigDialog } = useRoleConfig(entry)

const {
  visible: permModalVisible,
  showDialog: showPermissionConfigDialog,
  mode
} = usePermissionConfig(entry)

const onDelete = (id: number) => {
  deleteRole(id).then(() => {
    message.success('删除成功')
    execute()
  })
}

defineOptions({ name: 'SystemRole' })
</script>
