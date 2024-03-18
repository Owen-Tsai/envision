<template>
  <div class="view">
    <ARow :gutter="24">
      <ACol :span="24">
        <ACard>
          <AForm ref="filterFormRef" :model="queryParams" class="dense-filter-form">
            <ARow :gutter="24">
              <ACol :span="24" :lg="8">
                <AFormItem label="部门名称" name="name">
                  <AInput v-model:value="queryParams.name" placeholder="请输入部门名称" />
                </AFormItem>
              </ACol>
              <ACol :span="24" :lg="8">
                <AFormItem label="部门状态" name="status">
                  <ASelect v-model:value="queryParams.status" placeholer="请选择菜单状态" />
                </AFormItem>
              </ACol>
              <ACol :span="24" :lg="8">
                <AFlex justify="end" align="center" :gap="16">
                  <AButton @click="onFilterReset">重置</AButton>
                  <AButton type="primary" @click="onFilter">查询</AButton>
                </AFlex>
              </ACol>
            </ARow>
          </AForm>
        </ACard>
      </ACol>

      <ACol :span="24">
        <ACard title="菜单管理" class="mt-4 flex-1">
          <template #extra>
            <AFlex :gap="8">
              <AButton type="primary" :loading="pending" @click="showDialog()">
                <template #icon>
                  <PlusOutlined />
                </template>
                新增
              </AButton>
              <ATooltip title="折叠/展开全部">
                <AButton type="text" :loading="pending">
                  <template #icon>
                    <SwapOutlined :rotate="90" />
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
            :data-source="data"
            :pagination="false"
            :columns="columns"
            row-key="id"
            :loading="pending"
            defaultExpandAllRows
            :key="`data-${pending}`"
          >
            <template #bodyCell="scope">
              <template v-if="scope?.column.key === 'leader'">
                {{ userList?.find((e) => e.id === scope.record.leaderUserId)?.nickname }}
              </template>
              <template v-if="scope?.column.key === 'createTime'">
                {{ formatDate(scope.record.createTime) }}
              </template>
              <template v-if="scope?.column.key === 'actions'">
                <AFlex :gap="16">
                  <ATypographyLink @click="showDialog(scope.record.id)">
                    <EditOutlined />
                    修改
                  </ATypographyLink>
                  <APopconfirm
                    title="删除部门后，该部门的用户所属部门将变为空。此操作不可撤销，确定要删除吗？"
                    trigger="click"
                    :overlay-style="{ maxWidth: '280px' }"
                    @confirm="onDelete(scope.record.id)"
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

    <ModalForm
      v-model:open="visible"
      v-model:value="formData"
      :tree-data="data"
      :user-data="userList"
      :id="entryId"
      @success="execute"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import {
  SwapOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { useTable, columns } from './use-table'
import ModalForm from './form.vue'
import { deleteDept, type DeptVO } from '@/api/system/dept'

const filterFormRef = ref()

const formData = ref<DeptVO>({})
const visible = ref(false)
// current entry for editing
const entryId = ref<number | undefined>()

const showDialog = (id?: number) => {
  entryId.value = id
  visible.value = true
}

const onDelete = (id: number) => {
  deleteDept(id).then(() => {
    message.success('删除成功')
    execute()
  })
}

const formatDate = (date: number) => {
  return dayjs(date).format('YYYY-MM-DD')
}

const { data, execute, pending, queryParams, userList, onFilter, onFilterReset } =
  useTable(filterFormRef)
</script>
