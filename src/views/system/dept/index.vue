<template>
  <div class="view">
    <ARow :gutter="24">
      <ACol :span="24">
        <ACard v-if="permission.has('system:dept:query')" class="mb-4">
          <AForm ref="filterFormRef" :model="queryParams" class="dense-form">
            <ARow :gutter="24">
              <ACol :span="24" :lg="8">
                <AFormItem label="部门名称" name="name">
                  <AInput v-model:value="queryParams.name" placeholder="请输入部门名称" />
                </AFormItem>
              </ACol>
              <ACol :span="24" :lg="8">
                <AFormItem label="部门状态" name="status">
                  <ASelect
                    v-model:value="queryParams.status"
                    :options="commonStatus"
                    placeholder="请选择部门状态"
                  />
                </AFormItem>
              </ACol>
              <ACol :span="24" :lg="8">
                <AFlex justify="end" align="center" :gap="16">
                  <AButton html-type="reset" @click="onFilterReset">重置</AButton>
                  <AButton html-type="submit" type="primary" @click="onFilter">查询</AButton>
                </AFlex>
              </ACol>
            </ARow>
          </AForm>
        </ACard>
      </ACol>

      <ACol :span="24">
        <ACard title="部门管理" class="mt-4 flex-1">
          <template #extra>
            <AFlex :gap="8">
              <AButton
                v-if="permission.has('system:dept:create')"
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

          <ATable
            :data-source="data"
            :pagination="false"
            :columns="columns"
            row-key="id"
            :loading="pending"
            default-expand-all-rows
            :key="`data-${pending}`"
          >
            <template #bodyCell="scope: TableScope<DeptVO>">
              <template v-if="scope?.column.key === 'leaderUserId'">
                {{ userList?.find((e) => e.id === scope.record.leaderUserId)?.nickname }}
              </template>
              <template v-if="scope?.column.key === 'status'">
                <EDictTag :value="scope.text" :dict-object="commonStatus" />
              </template>
              <template v-if="scope?.column.key === 'createTime'">
                {{ dayjs(scope.record.createTime).format('YYYY-MM-DD') }}
              </template>
              <template v-if="scope?.column.key === 'actions'">
                <AFlex :gap="16">
                  <ATypographyLink
                    v-if="permission.has('system:dept:update')"
                    @click="onEdit(scope.record)"
                  >
                    <EditOutlined />
                    修改
                  </ATypographyLink>
                  <APopconfirm
                    v-if="permission.has('system:dept:delete')"
                    title="此操作不可撤销，确定要删除吗？"
                    trigger="click"
                    :overlay-style="{ maxWidth: '280px' }"
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
        </ACard>
      </ACol>
    </ARow>

    <FormModal
      v-if="visible"
      :tree-data="data"
      :user-data="userList"
      :record="entry"
      @success="execute"
      @close="visible = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ReloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import useDict from '@/hooks/use-dict'
import { useTable, columns } from './use-table'
import useActions from './use-actions'
import FormModal from './form.vue'
import { type DeptVO } from '@/api/system/dept'
import { permission } from '@/hooks/use-permission'

const filterFormRef = ref()

const [commonStatus] = useDict('common_status')

const { data, execute, pending, queryParams, userList, onFilter, onFilterReset } =
  useTable(filterFormRef)

const { entry, visible, onDelete, onEdit } = useActions(execute)

defineOptions({ name: 'SystemDept' })
</script>
