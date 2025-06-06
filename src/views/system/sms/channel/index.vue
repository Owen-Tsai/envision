<template>
  <div class="view">
    <ACard v-if="permission.has('system:sms-channel:query')" class="mb-4">
      <AForm ref="filterFormRef" :model="queryParams" class="dense-form">
        <ARow :gutter="24">
          <ACol :span="24" :lg="8">
            <AFormItem label="渠道名称" name="signature">
              <AInput v-model:value="queryParams.signature" placeholder="请输入部门名称" />
            </AFormItem>
          </ACol>
          <ACol :span="24" :lg="8">
            <AFormItem label="启用状态" name="status">
              <ASelect
                v-model:value="queryParams.status"
                :options="commonStatus"
                placeholder="请选择启用状态"
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

    <ACard title="短信渠道">
      <template #extra>
        <AFlex :gap="8">
          <AButton
            v-if="permission.has('system:sms-channel:create')"
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
        :columns="columns"
        :data-source="data?.list"
        :loading="pending"
        :pagination="pagination"
        @change="onChange"
      >
        <template #bodyCell="scope: TableScope<ChannelVO>">
          <template v-if="scope?.column.key === 'code'">
            {{ systemSmsChannelCode.find((e) => e.value === scope.text)?.label }}
          </template>
          <template v-if="scope?.column.key === 'status'">
            <DictTag :dict-object="commonStatus" :value="scope.record.status!" />
          </template>
          <template v-if="scope?.column.key === 'createTime'">
            {{ dayjs(scope.record.createTime!).format('YYYY-MM-DD') }}
          </template>
          <template v-if="scope?.column.key === 'actions'">
            <AFlex :gap="16">
              <ATypographyLink
                v-if="permission.has('system:sms-channel:update')"
                @click="onEdit(scope.record)"
              >
                <EditOutlined />
                修改
              </ATypographyLink>
              <APopconfirm
                v-if="permission.has('system:sms-channel:delete')"
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

    <FormModal v-if="visible" :record="entry" @success="execute" @close="visible = false" />
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { permission } from '@/hooks/use-permission'
import useDict from '@/hooks/use-dict'
import { type ChannelVO } from '@/api/system/sms/channel'
import { useTable, columns } from './use-table'
import useActions from './use-actions'
import FormModal from './form.vue'

const filterFormRef = ref()

const [commonStatus, systemSmsChannelCode] = useDict('common_status', 'system_sms_channel_code')

const { data, execute, onChange, onFilter, onFilterReset, pagination, pending, queryParams } =
  useTable(filterFormRef)

const { entry, visible, onDelete, onEdit } = useActions(execute)
</script>
