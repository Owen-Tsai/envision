<template>
  <div class="view">
    <ARow :gutter="24">
      <ACol :span="24">
        <ACard v-if="permission.has('system:post:query')">
          <AForm ref="filterFormRef" :model="queryParams" class="dense-form">
            <ARow :gutter="24">
              <ACol :span="24" :lg="8">
                <AFormItem label="岗位名称" name="name">
                  <AInput v-model:value="queryParams.name" placeholde r="请输入岗位名称" />
                </AFormItem>
              </ACol>
              <ACol :span="24" :lg="8">
                <AFormItem label="岗位编码" name="code">
                  <AInput v-model:value="queryParams.code" placeholder="请输入岗位编码" />
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
        <ACard title="岗位管理" class="mt-4 flex-1">
          <template #extra>
            <AFlex :gap="8">
              <AButton
                v-if="permission.has('system:post:create')"
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
            :data-source="data?.list"
            :pagination="pagination"
            :columns="columns"
            row-key="id"
            :loading="pending"
            defaultExpandAllRows
            :key="`data-${pending}`"
            @change="onChange"
          >
            <template #bodyCell="scope: TableScope<PostVO>">
              <template v-if="scope?.column.key === 'status'">
                <EDictTag :value="scope.record.status!" :dict-object="commonStatus" />
              </template>
              <template v-if="scope?.column.key === 'createTime'">
                {{ dayjs(scope.record.createTime).format('YYYY-MM-DD') }}
              </template>
              <template v-if="scope?.column.key === 'actions'">
                <AFlex :gap="16">
                  <ATypographyLink
                    v-if="permission.has('system:post:update')"
                    @click="onEdit(scope.record)"
                  >
                    <EditOutlined />
                    修改
                  </ATypographyLink>
                  <APopconfirm
                    v-if="permission.has('system:post:delete')"
                    title="删除岗位后，处于该岗位的用户所属岗位将变为空。此操作不可撤销，确定要删除吗？"
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

    <FormModal v-if="visible" :record="entry" @success="execute" @close="visible = false" />
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import useDict from '@/hooks/use-dict'
import { permission } from '@/hooks/use-permission'
import { useTable, columns } from './use-table'
import useActions from './use-actions'
import FormModal from './form.vue'
import type { PostVO } from '@/api/system/post'

const filterFormRef = ref()

const [commonStatus] = useDict('common_status')

const { data, execute, pending, queryParams, onFilter, onFilterReset, pagination, onChange } =
  useTable(filterFormRef)

const { entry, visible, onDelete, onEdit } = useActions(execute)

defineOptions({ name: 'SystemPost' })
</script>
