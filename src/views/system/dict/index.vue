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
            <AFormItem label="字典名称" name="dictName">
              <AInput
                v-model:value="queryParams.dictName"
                placeholder="请输入字典名称"
                allow-clear
              />
            </AFormItem>
          </ACol>
          <ACol :lg="8" :span="24">
            <AFormItem label="字典类型" name="dictType">
              <AInput
                v-model:value="queryParams.dictType"
                placeholder="请输入字典类型"
                allow-clear
              />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="字典状态" name="status">
              <ASelect
                v-model:value="queryParams.status"
                :options="dictDataToOptions(dictDisable)"
                placeholder="请选择字典状态"
              />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="创建时间">
              <ARangePicker v-model:value="dateRange" format="YYYY-MM-DD" />
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
          :data-source="data?.rows"
          :loading="pending"
          :pagination="pagination"
          @change="onChange"
        >
          <template #bodyCell="scope">
            <template v-if="scope!.column.dataIndex === 'status'">
              <EDictTag :dict-object="dictDisable" :value="scope?.text" />
            </template>
            <template v-if="scope!.column.title === '操作'">
              <AFlex :gap="16">
                <ATypographyLink @click="showDialog((scope?.record as ListItemVO).dictId)">
                  <EditOutlined /> 编辑
                </ATypographyLink>
                <ATypographyLink> <DeleteOutlined /> 删除 </ATypographyLink>
              </AFlex>
            </template>
          </template>
        </ATable>
      </div>
    </ACard>

    <ModalForm ref="modalForm" :id="entryId" v-model:value="formData" v-model:open="visible" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useToggle } from '@vueuse/core'
import {
  DownOutlined,
  ReloadOutlined,
  ExportOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined
} from '@ant-design/icons-vue'
import useDict from '@/hooks/use-dict'
import ModalForm from './form.vue'
import { dictDataToOptions } from '@/utils/envision'
import { columns, useTable } from './use-table'
import type { FormInstance } from 'ant-design-vue'
import type { ListItemVO, TypeDTO } from '@/api/system/dict/type'

const filterForm = ref<FormInstance>()

const [filterExpanded, toggle] = useToggle(false)

const { sys_normal_disable: dictDisable } = useDict('sys_normal_disable')

const {
  data,
  pending,
  execute,
  queryParams,
  dateRange,
  onFilter,
  onChange,
  onFilterReset,
  pagination
} = useTable(filterForm)

const entryId = ref<number>()
const visible = ref(false)
const formData = ref<TypeDTO>({
  dictName: '',
  dictType: '',
  status: '0',
  remark: ''
})

const showDialog = (id?: number) => {
  entryId.value = id
  visible.value = true
}
</script>
