<template>
  <div class="view h-full overflow-auto">
    <ACard class="min-h-full">
      <AForm class="form" :label-col="{ style: { width: '100px' } }">
        <AAlert
          v-if="appEditMode === 'update'"
          type="warning"
          show-icon
          :message="`当前Schema版本${appSchemaInfo.version}。如不需要重新生成 Schema，请直接点击页面上方步骤条中的对应步骤进行切换`"
          class="mb-4"
        />
        <AFormItem label="数据表" extra="仅可选择导入至 基础设施/代码生成 中的数据表">
          <ASelect
            v-model:value="selectedValues"
            :loading="loading"
            label-in-value
            mode="multiple"
            allow-clear
            show-arrow
            :options="tables"
            :field-names="{ label: 'tableName', value: 'id' }"
            :filter-option="filterOption"
            @change="onTableSelectChange"
          >
            <template #option="{ tableName, tableComment, dataSourceConfigId }: TableModel">
              <span>
                &lt;{{ dataSources?.find((e) => e.id === dataSourceConfigId)?.name }}&gt;
                {{ tableName }}
              </span>
              <span class="text-muted ml-2">{{ tableComment }}</span>
            </template>
          </ASelect>
        </AFormItem>
        <AFormItem label="表单分页">
          <ARadioGroup v-model:value="appSchema!.info.paginated">
            <ARadioButton :value="false">不分页</ARadioButton>
            <ARadioButton value="tabs">使用 tabs 分页</ARadioButton>
            <ARadioButton value="steps">使用 steps 分页</ARadioButton>
          </ARadioGroup>
        </AFormItem>
        <AFormItem label="表单分栏">
          <ARadioGroup v-model:value="appSchema!.info.gridColumns">
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
            <div v-for="item in tableSortList" :key="item.name" class="item">
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
          <AEmpty v-if="tableSortList.length === 0" />
        </AFormItem>
        <AFlex :gap="8" justify="end">
          <AButton
            v-if="appEditMode === 'update' && !hasModified"
            type="primary"
            @click="toNextStep"
          >
            下一步
          </AButton>
          <AButton
            v-else
            type="primary"
            :disabled="tableSortList.length <= 0"
            @click="generateInitialSchema"
          >
            生成初始 Schema
          </AButton>
        </AFlex>
      </AForm>
    </ACard>
  </div>

  <Loader v-if="generating || loading" />
</template>

<script setup lang="ts">
import { Modal } from 'ant-design-vue'
import { useAppDesignCtxInjection } from '../use-app-design'
import { useTableSelect, type TableModel } from './use-table-select'
import { useSortable } from '@vueuse/integrations/useSortable'
import Loader from '@/components/loading/index.vue'
import genFormSchemaByAppInfo from './schema-generation'

const emit = defineEmits(['finish'])

const generating = ref(false)
const hasModified = ref(false)

const dragWrapperEl = useTemplateRef('dragWrapperEl')
const { appEditMode, appSchema, appSchemaInfo } = useAppDesignCtxInjection()!
const {
  dataSources,
  loading,
  tables,
  tableSortList,
  onTableSelectChange,
  selectedValues,
  filterOption,
} = useTableSelect(appSchema)

useSortable(dragWrapperEl, tableSortList, {
  animation: 200,
})

const generateInitialSchema = async () => {
  const doGenerate = async () => {
    appSchema.value.info.tables = tableSortList.value
    generating.value = true
    appSchema.value.form = await genFormSchemaByAppInfo(appSchema.value.info)
    generating.value = false
    emit('finish')
  }
  if (appEditMode.value === 'update' && hasModified.value) {
    Modal.confirm({
      title: '重新生成初始 Schema',
      content:
        '当前应用的数据源配置已经被修改，生成初始 Schema 将覆盖应用原本的 Schema。确定要执行此操作吗？',
      onCancel() {
        return
      },
      async onOk() {
        await doGenerate()
      },
    })
  } else {
    await doGenerate()
  }
}

const toNextStep = () => {
  emit('finish')
}

watchOnce(
  () => appSchema.value.info,
  () => {
    if (!hasModified.value) {
      hasModified.value = true
    }
  },
  { deep: true },
)
</script>

<style lang="scss" scoped>
.form {
  width: 40%;
  min-width: 500px;
  margin: 0 auto;
}
.item {
  background-color: var(--color-fill-tertiary);
  padding: 8px;
  border-radius: var(--border-radius);
  margin-bottom: 8px;
}
</style>
