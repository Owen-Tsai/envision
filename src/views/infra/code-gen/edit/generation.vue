<template>
  <ASpin :spinning="loading">
    <AForm
      ref="formRef"
      :model="formData"
      :rules="rules"
      :label-col="{ style: { width: '100px' } }"
    >
      <ARow :gutter="24">
        <ACol :lg="12">
          <AFormItem label="生成模板" name="templateType">
            <ASelect v-model:value="formData.templateType" :options="infraCodegenTemplateType" />
          </AFormItem>
        </ACol>
        <ACol :lg="12">
          <AFormItem label="前端类型" name="frontType">
            <ASelect v-model:value="formData.frontType" :options="infraCodegenFrontType" />
          </AFormItem>
        </ACol>
        <ACol :lg="12">
          <AFormItem label="生成场景" name="scene">
            <ASelect v-model:value="formData.scene" :options="infraCodegenScene" />
          </AFormItem>
        </ACol>
        <ACol :lg="12">
          <AFormItem label="上级菜单" name="parentMenuId">
            <ATreeSelect
              v-model:value="formData.parentMenuId"
              show-search
              allow-clear
              :dropdown-style="{ maxHeight: '300px', overflow: 'auto' }"
              tree-default-expand-all
              :field-names="{ label: 'name', value: 'id' }"
              :tree-data="treeData"
              placeholder="请选择上级菜单"
            />
          </AFormItem>
        </ACol>
        <ACol :lg="12">
          <AFormItem label="模块名称" name="moduleName">
            <AInput v-model:value="formData.moduleName" placeholder="请输入模块名称" />
          </AFormItem>
        </ACol>
        <ACol :lg="12">
          <AFormItem label="业务名称" name="businessName">
            <AInput v-model:value="formData.businessName" placeholder="请输入业务名称" />
          </AFormItem>
        </ACol>
        <ACol :lg="12">
          <AFormItem label="类名称" name="className">
            <AInput v-model:value="formData.className" placeholder="请输入类名称" />
          </AFormItem>
        </ACol>
        <ACol :lg="12">
          <AFormItem label="类描述" name="classComment">
            <AInput v-model:value="formData.classComment" placeholder="请输入类描述" />
          </AFormItem>
        </ACol>

        <!-- extra generation info based on template type -->
        <!-- tree table -->
        <template v-if="formData.templateType === templateTypeEnums.tree">
          <ADivider>数表设置</ADivider>
          <ACol :lg="12">
            <AFormItem label="上级ID字段" name="treeParentColumnId">
              <ASelect v-model:value="formData.treeParentColumnId" placeholder="请选择上级ID字段">
                <ASelectOption v-for="item in columns" :key="item.id">
                  {{ item.javaField }}: {{ item.columnComment }}
                </ASelectOption>
              </ASelect>
            </AFormItem>
          </ACol>
          <ACol :lg="12">
            <AFormItem label="显示名称字段" name="treeNameColumnId">
              <ASelect v-model:value="formData.treeNameColumnId" placeholder="请选择显示名称字段">
                <ASelectOption v-for="item in columns" :key="item.id">
                  {{ item.javaField }}: {{ item.columnComment }}
                </ASelectOption>
              </ASelect>
            </AFormItem>
          </ACol>
        </template>

        <!-- child table -->
        <template v-if="formData.templateType === templateTypeEnums.child">
          <ADivider>子表设置</ADivider>
          <ACol :lg="9">
            <AFormItem label="关联的主表" name="masterTableId">
              <ASelect v-model:value="formData.masterTableId" placeholder="请选择所关联的主表">
                <ASelectOption v-for="item in codeGenConfigList" :key="item.id">
                  {{ item.tableName }}: {{ item.tableComment }}
                </ASelectOption>
              </ASelect>
            </AFormItem>
          </ACol>
          <ACol :lg="9">
            <AFormItem label="子表关联字段" name="subJoinColumnId">
              <ASelect v-model:value="formData.subJoinColumnId" placeholder="请选择子表关联的字段">
                <ASelectOption v-for="item in columns" :key="item.id">
                  {{ item.javaField }}: {{ item.columnComment }}
                </ASelectOption>
              </ASelect>
            </AFormItem>
          </ACol>
          <ACol :lg="6">
            <AFormItem label="关联方式" name="subJoinMany">
              <ARadioGroup v-model:value="formData.subJoinMany">
                <ARadio :value="true">一对多</ARadio>
                <ARadio :value="false">一对一</ARadio>
              </ARadioGroup>
            </AFormItem>
          </ACol>
        </template>
      </ARow>
    </AForm>
  </ASpin>
</template>

<script lang="ts" setup>
import { ref, computed, type PropType } from 'vue'
import { type FormProps, type FormInstance } from 'ant-design-vue'
import useDict from '@/hooks/use-dict'
import { getMenuTree, type MenuVO } from '@/api/system/menu'
import { getPlainCodeGenConfigList, type ConfigDetailVO, type ConfigVO } from '@/api/infra/code-gen'

const props = defineProps({
  model: {
    type: Object as PropType<ConfigDetailVO['table']>
  },
  columns: {
    type: Array as PropType<ConfigDetailVO['columns']>
  }
})

const emit = defineEmits(['update:model'])

const templateTypeEnums: Readonly<Record<string, number>> = {
  single: 1,
  tree: 2,
  masterStandard: 10,
  masterERP: 11,
  masterNested: 12,
  child: 15
}

const { infraCodegenFrontType, infraCodegenScene, infraCodegenTemplateType } = useDict(
  'infra_codegen_front_type',
  'infra_codegen_scene',
  'infra_codegen_template_type'
)

const loading = ref(true)
const formRef = ref<FormInstance>()
const treeData = ref<MenuVO[]>()
const codeGenConfigList = ref<ConfigVO[]>()

const formData = computed({
  get: () => props.model || {},
  set: (val) => {
    emit('update:model', val)
  }
})

const rules: FormProps['rules'] = {
  templateType: [{ required: true, message: '请选择生成模板的类型' }],
  frontType: [{ required: true, message: '请选择生成模板的前端类型' }],
  scene: [{ required: true, message: '请选择生成模板的使用场景' }],
  moduleName: [{ required: true, message: '请输入模块名称' }],
  businessName: [{ required: true, message: '请输入业务名称' }],
  className: [{ required: true, message: '请输入类名称' }],
  classComment: [{ required: true, message: '请输入类描述' }]
}

getMenuTree().then((res) => {
  treeData.value = res
  getPlainCodeGenConfigList(formData.value.dataSourceConfigId || 0).then((res) => {
    codeGenConfigList.value = res
    loading.value = false
  })
})

defineExpose({
  formRef
})
</script>
