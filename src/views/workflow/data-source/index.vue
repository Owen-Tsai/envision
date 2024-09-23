<template>
  <div class="view h-full overflow-auto">
    <ACard class="min-h-full">
      <AForm class="form" :label-col="{ style: { width: '100px' } }">
        <AFormItem label="数据源" name="dataSourceConfigId">
          <ASelect
            v-model:value="dataSource"
            :options="dataSourceOpts"
            :loading="dataSourcePending"
            :field-names="{ label: 'name', value: 'id' }"
            @change="execute"
          />
        </AFormItem>
        <AFormItem label="数据表" name="table">
          <ASelect
            v-model:value="value"
            :loading="pending || dataSourcePending"
            label-in-value
            mode="multiple"
            allow-clear
            show-arrow
            :options="tableOpts"
            :field-names="{ label: 'tableName', value: 'tableName' }"
            @change="(v) => updateSelectedTables(v as SelectValue[])"
          >
            <template #option="{ tableName, tableComment }: TableVO">
              <span>{{ tableName }}</span>
              <span class="text-muted ml-2">{{ tableComment }}</span>
            </template>
          </ASelect>
        </AFormItem>
        <AFormItem label="表单分页">
          <ARadioGroup v-model:value="state.paginated">
            <ARadioButton :value="false">不分页</ARadioButton>
            <ARadioButton value="tabs">使用 tabs 分页</ARadioButton>
            <ARadioButton value="steps">使用 steps 分页</ARadioButton>
          </ARadioGroup>
        </AFormItem>
        <AFormItem label="表单分栏">
          <ARadioGroup v-model:value="state.column">
            <ARadioButton :value="false">不分栏</ARadioButton>
            <ARadioButton :value="2">两栏</ARadioButton>
            <ARadioButton :value="3">三栏 + 纵向表单组件布局</ARadioButton>
          </ARadioGroup>
        </AFormItem>
        <a-alert
          message="当对某个数据表启用子表模式时，该数据表将被视为子表，可以添加多条数据。当同时启用分页模式时，子表将采用数据表格形式渲染。"
          type="info"
          show-icon
        />
        <AFormItem label="已选数据表" class="mt-4">
          <div ref="dragWrapperEl">
            <div v-for="item in state.tables" :key="item.name" class="item">
              <ARow>
                <ACol :span="10">
                  <span>{{ item.name }}</span>
                </ACol>
                <ACol :span="10">
                  <span class="text-muted">
                    {{ item.comment }}
                  </span>
                </ACol>
                <ACol :span="4">
                  <ACheckbox v-model:checked="item.subTable">子表</ACheckbox>
                </ACol>
              </ARow>
            </div>
          </div>
          <AEmpty v-if="state.tables.length === 0" />
        </AFormItem>
        <div class="text-right">
          <AButton type="primary" @click="toNextStep" :disabled="state.tables.length === 0">
            下一步
          </AButton>
        </div>
      </AForm>
    </ACard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, useTemplateRef, toRef } from 'vue'
import { useRoute } from 'vue-router'
import useWorkflowStore, { type DataSourceInfo } from '@/stores/workflow'
import { useSortable } from '@vueuse/integrations/useSortable'
import useRequest from '@/hooks/use-request'
import { getTables, type TableVO } from '@/api/system/application'
import { getDataSourceList } from '@/api/infra/data-source'

type SelectValue = {
  label: string
  value: string
  option: TableVO
  subTable?: boolean
}

const emit = defineEmits(['finished'])
const dragWrapperEl = useTemplateRef('dragWrapperEl')
const { getDataSource, saveDataSource } = useWorkflowStore()
const { params } = useRoute()

const value = ref<SelectValue[]>([])
const dataSource = ref<number>(0)

const state = reactive<DataSourceInfo>({
  tables: [],
  paginated: false,
  column: false
})

useSortable(dragWrapperEl, toRef(state, 'tables'), {
  animation: 200
})

const updateSelectedTables = (selectedTables: SelectValue[]) => {
  // Clear out any tables that are no longer selected
  state.tables = state.tables.filter((table) =>
    selectedTables.find((selectedTable) => selectedTable.value === table.name)
  )

  // Add any new tables that have been selected
  selectedTables.forEach((selectedTable) => {
    if (!state.tables.find((table) => table.name === selectedTable.value)) {
      state.tables.push({
        name: selectedTable.value,
        comment: selectedTable.option.tableComment,
        subTable: false
      })
    }
  })
}

const toNextStep = () => {
  console.log(state)
  saveDataSource(params.appId as string, state)
  emit('finished')
}

const { data: tableOpts, pending, execute } = useRequest(() => getTables(dataSource.value))

const { data: dataSourceOpts, pending: dataSourcePending } = useRequest(getDataSourceList, {
  immediate: true,
  onSuccess() {
    execute()
  }
})

// created
if (params.appId) {
  const dataSource = getDataSource(params.appId as string)
  console.log(dataSource)
  if (dataSource) {
    state.tables = dataSource.tables
    state.paginated = dataSource.paginated
    state.column = dataSource.column
    value.value = dataSource.tables.map((table) => ({
      label: table.name,
      value: table.name,
      option: {
        tableName: table.name,
        tableComment: table.comment
      }
    }))
  }
}
</script>

<style lang="scss" scoped>
.form {
  width: 40%;
  min-width: 500px;
  margin: 0 auto;
}
.item {
  background-color: var(--colorFillTertiary);
  padding: 8px;
  border-radius: var(--borderRadius);
  margin-bottom: 8px;
}
</style>
