<template>
  <div class="view">
    <ACard v-if="permission.has('system:sms-template:query')" class="mb-4">
      <AForm ref="filterFormRef" :model="queryParams" class="dense-filter-form">
        <ARow :gutter="[24, 16]">
          <ACol :span="24" :lg="8">
            <AFormItem label="模板名称" name="name">
              <AInput v-model:value="queryParams.name" placeholder="请输入短信模板名称" />
            </AFormItem>
          </ACol>
          <ACol :span="24" :lg="8">
            <AFormItem label="模板编码" name="code">
              <AInput v-model:value="queryParams.code" placeholder="请输入短信模板编码" />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :span="24" :lg="8">
            <AFormItem label="短信类型" name="type">
              <ASelect
                v-model:value="queryParams.type"
                :options="systemSmsTemplateType"
                placeholder="请选择短信类型"
              />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :span="24" :lg="8">
            <AFormItem label="短信渠道" name="channelId">
              <ASelect
                v-model:value="queryParams.channelId"
                :options="channelList"
                :field-names="{ label: 'signature', value: 'id' }"
                placeholder="请选择启用状态"
              />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :span="24" :lg="8">
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
              <ATypographyLink @click="toggle()">
                {{ filterExpanded ? '收起' : '展开' }}
                <DownOutlined :class="{ 'rotate-180': filterExpanded }" />
              </ATypographyLink>
            </AFlex>
          </ACol>
        </ARow>
      </AForm>
    </ACard>

    <ACard title="短信模板">
      <template #extra>
        <AFlex :gap="8">
          <AButton
            v-if="permission.has('system:sms-template:create')"
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
        :scroll="{ x: 1200 }"
        :sticky="{ offsetHeader: 90 }"
        @change="onChange"
      >
        <template #bodyCell="scope: TableScope<TemplateVO>">
          <template v-if="scope?.column.key === 'content'">
            <ATypographyText ellipsis :content="scope.text" style="width: 220px" />
          </template>
          <template v-if="scope?.column.key === 'type'">
            <EDictTag :dict-object="systemSmsTemplateType" :value="scope.text" />
          </template>
          <template v-if="scope?.column.key === 'status'">
            <EDictTag :dict-object="commonStatus" :value="scope.text" />
          </template>
          <template v-if="scope?.column.key === 'channelCode'">
            <div>
              {{ channelList.find((e) => e.id === scope.record.channelId)?.signature }}
            </div>
            <div>
              <EDictTag :dict-object="systemSmsChannelCode" :value="scope.text" />
            </div>
          </template>
          <template v-if="scope?.column.key === 'createTime'">
            {{ dayjs(scope.text).format('YYYY-MM-DD') }}
          </template>
          <template v-if="scope?.column.key === 'actions'">
            <AFlex :gap="16">
              <ATypographyLink
                v-if="permission.has('system:sms-template:update')"
                @click="onEdit(scope.record)"
              >
                <EditOutlined />
                修改
              </ATypographyLink>
              <APopconfirm
                v-if="permission.has('system:sms-template:delete')"
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

    <FormModal
      v-if="visible"
      :record="entry"
      :channel-data="channelList"
      @success="execute"
      @close="visible = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  DownOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { permission } from '@/hooks/use-permission'
import useDict from '@/hooks/use-dict'
import { getSimpleChannelList, type ChannelListLiteVO } from '@/api/system/sms/channel'
import { useToggle } from '@vueuse/core'
import { useTable, columns } from './use-table'
import FormModal from './form.vue'
import useActions from './use-actions'
import type { TemplateVO } from '@/api/system/sms/template'

const filterFormRef = ref()

const [filterExpanded, toggle] = useToggle()

const { commonStatus, systemSmsChannelCode, systemSmsTemplateType } = useDict(
  'common_status',
  'system_sms_channel_code',
  'system_sms_template_type'
)

const channelList = ref<ChannelListLiteVO>([])

const { data, execute, onChange, onFilter, onFilterReset, pagination, pending, queryParams } =
  useTable(filterFormRef)

const { entry, visible, onDelete, onEdit } = useActions(execute)

getSimpleChannelList().then((res) => {
  channelList.value = res
})
</script>
