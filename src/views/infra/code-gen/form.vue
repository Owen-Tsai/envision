<template>
  <AModal
    v-model:open="isOpen"
    title="导入数据表"
    :width="720"
    :confirm-loading="loading"
    @ok="submit"
  >
    <!-- filter form -->
    <AForm ref="formRef" :model="queryParams">
      <ARow :gutter="16">
        <ACol :span="12">
          <AFormItem label="数据源">
            <ASelect
              v-model:value="queryParams.dataSourceConfigId"
              :field-names="{ label: 'name', value: 'id' }"
              :options="dataSources"
            />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="表名称">
            <AInput v-model:value="queryParams.name" placeholder="请输入表名称" />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="表描述">
            <AInput v-model:value="queryParams.comment" placeholder="请输入表描述" />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFlex justify="end" :gap="16">
            <AButton @click="onFilterReset()" :loading="loading">重置</AButton>
            <AButton html-type="submit" type="primary" @click="getTables()" :loading="loading">
              搜索
            </AButton>
          </AFlex>
        </ACol>
      </ARow>
    </AForm>

    <!-- table -->
    <ATable
      :columns="columns"
      :data-source="tableDefList"
      :loading="loading"
      :row-selection="selection"
      row-key="name"
      size="small"
    />
  </AModal>
</template>

<script lang="ts" setup>
import useModalOpen from '@/hooks/use-modal'
import {
  getTableDefList,
  createCodeGenConfig,
  type TableDefListVO,
  type TableQueryParams,
} from '@/api/infra/code-gen'
import type { FormInstance, TableProps } from 'ant-design-vue'
import type { DataSourceVO } from '@/api/infra/data-source'

const columns: TableProps['columns'] = [
  { dataIndex: 'name', title: '表名称' },
  { dataIndex: 'comment', title: '表描述' },
]

const props = defineProps<{
  dataSources: DataSourceVO[]
  open?: boolean
}>()

const loading = ref(false)

const selectedKeys = ref<string[]>([])

const selection: TableProps['rowSelection'] = {
  onChange(keys, rows: TableDefListVO) {
    selectedKeys.value = rows.map((e) => e.name)
  },
}

const tableDefList = ref<TableDefListVO>([])

const emit = defineEmits(['success', 'update:open'])
const formRef = ref<FormInstance>()
const isOpen = useModalOpen(props, emit, formRef)

const queryParams = ref<TableQueryParams>({})

const submit = async () => {
  try {
    loading.value = true
    await createCodeGenConfig({
      dataSourceConfigId: queryParams.value.dataSourceConfigId || 0,
      tableNames: selectedKeys.value,
    })

    isOpen.value = false
    emit('success')
  } catch (e) {
    // do nothing at the moment
    // until we have a unified error handling precedure
  } finally {
    loading.value = false
  }
}

const getTables = async () => {
  loading.value = true
  const list = await getTableDefList(queryParams.value)
  tableDefList.value = list
  loading.value = false
}

const onFilterReset = () => {
  console.log(formRef.value)
  formRef.value?.resetFields()
  getTables()
}

const onLoad = () => {
  if (props.dataSources) {
    queryParams.value.dataSourceConfigId = props.dataSources[0].id

    getTables()
  }
}

watch(() => props.dataSources, onLoad)
</script>
