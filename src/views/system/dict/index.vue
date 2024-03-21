<template>
  <div class="view">
    <ACard>
      <AForm
        ref="filterForm"
        :label-col="{ span: 6 }"
        class="dense-filter-form"
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

    <ACard title="字典类型" class="mt-4">
      <template #extra>
        <AFlex :gap="8">
          <AButton type="primary" :loading="pending" @click="showDialog()">
            <template #icon>
              <PlusOutlined />
            </template>
            新增
          </AButton>
          <ATooltip title="导出">
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
                <ATypographyLink @click="showDialog(scope?.record.id)">
                  <EditOutlined />
                  编辑
                </ATypographyLink>
                <ATypographyLink @click="toDataPage(scope?.record.type)">
                  <UnorderedListOutlined />
                  数据
                </ATypographyLink>
                <APopconfirm
                  title="删除字典后，使用了该字典的数据可能会存在显示问题。确定删除吗？"
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

    <FormModal v-if="visible" :id="entryId" @success="execute" @close="visible = false" />
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
  PlusOutlined,
  UnorderedListOutlined
} from '@ant-design/icons-vue'
import useDict from '@/hooks/use-dict'
import { deleteDictType } from '@/api/system/dict/type'
import FormModal from './form.vue'
import { columns, useTable } from './use-table'
import { message, type FormInstance } from 'ant-design-vue'

const filterForm = ref<FormInstance>()
const { push } = useRouter()

const [filterExpanded, toggle] = useToggle(false)

const { commonStatus } = useDict('common_status')

const { data, pending, execute, queryParams, onFilter, onChange, onFilterReset, pagination } =
  useTable(filterForm)

const entryId = ref<number>()
const visible = ref(false)

const showDialog = (id?: number) => {
  entryId.value = id
  visible.value = true
}

const toDataPage = (type: string) => {
  push(`/system/dict/data/${type}`)
}

const onDelete = (id: number) => {
  deleteDictType(id).then(() => {
    message.success('删除成功')
    execute()
  })
}

defineOptions({ name: 'SystemDict' })
</script>
