<template>
  <div class="view">
    <ACard v-if="permission.has('infra:file:query')" class="mb-4">
      <AForm
        ref="filterForm"
        :label-col="{ span: 6 }"
        class="dense-form"
        :class="{ expanded: filterExpanded }"
        :model="queryParams"
      >
        <ARow :gutter="[0, 16]">
          <ACol :lg="8" :span="24">
            <AFormItem label="文件路径" name="path">
              <AInput v-model:value="queryParams.path" placeholder="请输入文件路径" allow-clear />
            </AFormItem>
          </ACol>
          <ACol :lg="8" :span="24">
            <AFormItem label="文件类型" name="type">
              <AInput v-model:value="queryParams.type" placeholder="请输入文件类型" allow-clear />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="创建时间">
              <ARangePicker
                v-model:value="queryParams.createTime"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </AFormItem>
          </ACol>
          <ACol :lg="{ span: 8, offset: filterExpanded ? 16 : 0 }" :span="24">
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

    <ACard title="文件列表">
      <template #extra>
        <AFlex :gap="8">
          <ATooltip v-if="permission.has('infra:file-config:export')" title="导出">
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
          <template #bodyCell="scope: TableScope<FileVO>">
            <template v-if="scope?.column.key === 'storage'">
              <EDictTag :dict-object="infraFileStorage" :value="scope.text" />
            </template>
            <template v-if="scope?.column.key === 'preview'">
              <AImage
                v-if="scope.record.type?.includes('image')"
                :src="scope.record.url"
                :width="120"
              />
              <span v-else>不支持预览</span>
            </template>
            <template v-if="scope?.column.key === 'createTime'">
              {{ dayjs(scope.text).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
            <template v-if="scope?.column.title === '操作'">
              <AFlex :gap="16">
                <APopconfirm
                  v-if="permission.has('infra:file:delete')"
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
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
import { useToggle } from '@vueuse/core'
import { DownOutlined, ReloadOutlined, ExportOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import useDict from '@/hooks/use-dict'
import { permission } from '@/hooks/use-permission'
import { columns, useTable } from './use-table'
import useActions from './use-actions'
import type { FormInstance } from 'ant-design-vue'
import type { FileVO } from '@/api/infra/file/list'

const filterForm = ref<FormInstance>()

const [filterExpanded, toggle] = useToggle(false)

const [infraFileStorage] = useDict('infra_file_storage')

const { data, pending, execute, queryParams, onFilter, onChange, onFilterReset, pagination } =
  useTable(filterForm)

const { onDelete } = useActions(execute)

defineOptions({ name: 'InfraFile' })
</script>
