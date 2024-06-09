<template>
  <div class="view">
    <ACard v-if="permission.has('infra:code-gen:query')" class="mb-4">
      <AForm
        ref="filterForm"
        :label-col="{ span: 6 }"
        class="dense-form"
        :class="{ expanded: filterExpanded }"
        :model="queryParams"
      >
        <ARow :gutter="[0, 16]">
          <ACol :lg="8" :span="24">
            <AFormItem label="表名称" name="tableName">
              <AInput
                v-model:value="queryParams.tableName"
                placeholder="请输入表名称"
                allow-clear
              />
            </AFormItem>
          </ACol>
          <ACol :lg="8" :span="24">
            <AFormItem label="表描述" name="tableComment">
              <AInput
                v-model:value="queryParams.tableComment"
                placeholder="请输入表描述"
                allow-clear
              />
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

    <ACard title="代码生成配置">
      <template #extra>
        <AFlex :gap="8">
          <AButton
            v-if="permission.has('infra:code-gen:create')"
            type="primary"
            :loading="pending"
            @click="onImport()"
          >
            <template #icon>
              <PlusOutlined />
            </template>
            导入
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

      <div class="overflow-x-auto">
        <ATable
          :columns="columns"
          :data-source="data?.list"
          :loading="pending"
          :pagination="pagination"
          @change="onChange"
        >
          <template #bodyCell="scope: TableScope<ConfigVO>">
            <template v-if="scope?.column.key === 'dataSourceConfigId'">
              {{ dataSources.find((e) => e.id === scope.text)?.name }}
            </template>
            <template v-if="scope?.column.key === 'createTime'">
              {{ dayjs(scope.record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
            <template v-if="scope?.column.key === 'updateTime'">
              {{ dayjs(scope.record.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
            <template v-if="scope?.column.key === 'actions'">
              <AFlex :gap="16">
                <ATypographyLink
                  v-if="permission.has('infra:code-gen:update')"
                  @click="onEdit(scope.record)"
                >
                  <EditOutlined />
                  编辑
                </ATypographyLink>
                <ADropdown
                  v-if="permission.hasOne('infra:code-gen:preview', 'infra:code-gen:download')"
                >
                  <ATypographyLink>
                    <DownOutlined />
                    更多
                  </ATypographyLink>
                  <template #overlay>
                    <AMenu>
                      <AMenuItem
                        :disabled="!permission.has('infra:code-gen:preview')"
                        @click="onPreview(scope.record)"
                      >
                        预览生成的代码
                      </AMenuItem>
                      <AMenuItem
                        :disabled="!permission.has('infra:code-gen:download')"
                        @click="onDownload(scope.record)"
                      >
                        生成并下载代码
                      </AMenuItem>
                      <AMenuItem @click="onSync(scope.record)">同步表结构</AMenuItem>
                    </AMenu>
                  </template>
                </ADropdown>
                <APopconfirm
                  v-if="permission.has('infra:code-gen:delete')"
                  title="该操作无法撤销，确定删除吗？"
                  :overlay-style="{ width: '260px' }"
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
      </div>
    </ACard>

    <!-- import form modal -->
    <FormModal
      v-if="visible.import"
      :data-sources="dataSources"
      @close="visible.import = false"
      @success="execute"
    />

    <!-- preview modal -->
    <PreviewModal v-if="visible.preview" :id="entry!.id!" @close="visible.preview = false" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
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
import { permission } from '@/hooks/use-permission'
import { type ConfigVO } from '@/api/infra/code-gen'
import { getDataSourceList, type DataSourceVO } from '@/api/infra/data-source'
import FormModal from './form.vue'
import PreviewModal from './preview.vue'
import { columns, useTable } from './use-table'
import useActions from './use-actions'
import { message, type FormInstance } from 'ant-design-vue'

const filterForm = ref<FormInstance>()
const dataSources = ref<DataSourceVO[]>([])

const [filterExpanded, toggle] = useToggle(false)

const { data, pending, execute, queryParams, onFilter, onChange, onFilterReset, pagination } =
  useTable(filterForm)

const { entry, visible, onDelete, onDownload, onEdit, onImport, onPreview, onSync } =
  useActions(execute)

getDataSourceList().then((res) => {
  dataSources.value = res
})

defineOptions({ name: 'InfraCodeGen' })
</script>
