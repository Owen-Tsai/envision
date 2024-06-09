<template>
  <div class="view">
    <ACard v-if="permission.has('system:dict:query')" class="mb-4">
      <AForm
        ref="filterForm"
        :label-col="{ span: 6 }"
        class="dense-form"
        :class="{ expanded: filterExpanded }"
        :model="queryParams"
      >
        <ARow :gutter="[0, 16]">
          <ACol :lg="8" :span="24">
            <AFormItem label="字典名称" name="name">
              <AInput v-model:value="queryParams.name" placeholder="请输入字典名称" allow-clear />
            </AFormItem>
          </ACol>
          <ACol :lg="8" :span="24">
            <AFormItem label="字典类型" name="type">
              <AInput v-model:value="queryParams.type" placeholder="请输入字典类型" allow-clear />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="字典状态" name="status">
              <ASelect
                v-model:value="queryParams.status"
                :options="commonStatus"
                placeholder="请选择字典状态"
              />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="创建时间">
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

    <ACard title="字典类型">
      <template #extra>
        <AFlex :gap="8">
          <AButton
            v-if="permission.has('system:dict:create')"
            type="primary"
            :loading="pending"
            @click="onEdit()"
          >
            <template #icon>
              <PlusOutlined />
            </template>
            新增
          </AButton>
          <ATooltip v-if="permission.has('system:dict:export')" title="导出">
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
          <template #bodyCell="scope: TableScope<DictTypeVO>">
            <template v-if="scope?.column.key === 'status'">
              <EDictTag :dict-object="commonStatus" :value="scope?.text" />
            </template>
            <template v-if="scope?.column.key === 'createTime'">
              {{ dayjs(scope.text).format('YYYY-MM-DD') }}
            </template>
            <template v-if="scope?.column.title === '操作'">
              <AFlex :gap="16">
                <ATypographyLink
                  v-if="permission.has('system:dict:update')"
                  @click="onEdit(scope!.record)"
                >
                  <EditOutlined />
                  编辑
                </ATypographyLink>
                <ATypographyLink @click="onShowData(scope!.record)">
                  <UnorderedListOutlined />
                  数据
                </ATypographyLink>
                <APopconfirm
                  v-if="permission.has('system:dict:delete')"
                  title="该操作无法撤销，确定要删除吗？"
                  :overlay-style="{ width: '240px' }"
                  @confirm="onDelete(scope!.record)"
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

    <FormModal v-if="visible" :record="entry" @success="execute" @close="visible = false" />
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
  PlusOutlined,
  UnorderedListOutlined
} from '@ant-design/icons-vue'
import useDict from '@/hooks/use-dict'
import { permission } from '@/hooks/use-permission'
import FormModal from './form.vue'
import { columns, useTable } from './use-table'
import useActions from './use-actions'
import type { FormInstance } from 'ant-design-vue'
import type { DictTypeVO } from '@/api/system/dict/type'

const filterForm = ref<FormInstance>()

const [filterExpanded, toggle] = useToggle(false)

const [commonStatus] = useDict('common_status')

const { data, pending, execute, queryParams, onFilter, onChange, onFilterReset, pagination } =
  useTable(filterForm)

const { entry, visible, onDelete, onEdit, onShowData } = useActions(execute)

defineOptions({ name: 'SystemDictType' })
</script>
