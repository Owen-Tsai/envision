<template>
  <div class="view">
    <ACard v-if="permission.has('system:dept:query')" class="mb-4">
      <AForm ref="filterFormRef" :model="queryParams" class="dense-filter-form">
        <ARow :gutter="24">
          <ACol :span="24" :lg="8">
            <AFormItem label="短信签名" name="signature">
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
              <AButton @click="onFilterReset">重置</AButton>
              <AButton type="primary" @click="onFilter">查询</AButton>
            </AFlex>
          </ACol>
        </ARow>
      </AForm>
    </ACard>

    <ACard title="短信渠道">
      <template #extra>
        <AFlex :gap="8">
          <AButton
            v-if="permission.has('system:dept:create')"
            type="primary"
            :loading="pending"
            @click="showDialog()"
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
            <EDictTag :dict-object="commonStatus" :value="scope.record.status!" />
          </template>
          <template v-if="scope?.column.key === 'apiKey'">
            <ATypographyText ellipsis :content="scope?.record.apiKey" />
          </template>
          <template v-if="scope?.column.key === 'createTime'">
            {{ formatDate(scope.record.createTime!) }}
          </template>
          <template v-if="scope?.column.key === 'actions'">
            <AFlex :gap="16">
              <ATypographyLink
                v-if="permission.has('system:dept:update')"
                @click="showDialog(scope?.record.id)"
              >
                <EditOutlined />
                修改
              </ATypographyLink>
              <APopconfirm
                v-if="permission.has('system:dept:delete')"
                title="删除部门后，该部门的用户所属部门将变为空。此操作不可撤销，确定要删除吗？"
                trigger="click"
                :overlay-style="{ maxWidth: '280px' }"
                @confirm="onDelete(scope?.record.id!)"
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

    <FormModal v-if="visible" :id="entryId" @success="execute" @close="visible = false" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { ReloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { permission } from '@/hooks/use-permission'
import useDict from '@/hooks/use-dict'
import { deleteChannel, type ChannelVO } from '@/api/system/sms/channel'
import { useTable, columns } from './use-table'
import FormModal from './form.vue'

const filterFormRef = ref()

const { commonStatus, systemSmsChannelCode } = useDict('common_status', 'system_sms_channel_code')

const visible = ref(false)
// current entry for editing
const entryId = ref<number | undefined>()

const showDialog = (id?: number) => {
  entryId.value = id
  visible.value = true
}

const onDelete = (id: number) => {
  deleteChannel(id).then(() => {
    message.success('删除成功')
    execute()
  })
}

const formatDate = (date: number) => {
  return dayjs(date).format('YYYY-MM-DD')
}

const { data, execute, onChange, onFilter, onFilterReset, pagination, pending, queryParams } =
  useTable(filterFormRef)
</script>
