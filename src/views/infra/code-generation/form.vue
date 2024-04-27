<template>
  <AModal
    v-model:open="open"
    title="导入数据表"
    :after-close="onClose"
    destroy-on-close
    @ok="submit"
  >
    <!-- filter form -->
    <AForm :modle="queryParams">
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
            <AInput v-model.value="queryParams.name" placeholder="请输入表名称" />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="表描述">
            <AInput v-model.value="queryParams.comment" placeholder="请输入表描述" />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <ASpace>
            <AButton>重置</AButton>
            <AButton type="primary">搜索</AButton>
          </ASpace>
        </ACol>
      </ARow>
    </AForm>
  </AModal>
</template>

<script lang="ts" setup>
import { ref, type PropType } from 'vue'
import { message, type FormInstance, type TreeSelectProps, type FormProps } from 'ant-design-vue'
import { type TableQueryParams } from '@/api/infra/code-generation'
import { getDataSourceList, type DataSourceVO } from '@/api/infra/data-source'
import { filterOption } from '@/utils/envision'
import useDict from '@/hooks/use-dict'
import type { SimpleUserVO } from '@/api/system/user'

const loading = ref(false)

const props = defineProps({
  value: {
    type: Array as PropType<number[]>,
    required: true
  }
})

const dataSources = ref<DataSourceVO[]>([])

const emit = defineEmits(['success', 'close'])

const queryParams = ref<TableQueryParams>({})
const formRef = ref<FormInstance>()

const open = ref(true)

const onClose = () => {
  formRef.value?.resetFields()
  emit('close')
}

const submit = async () => {
  try {
    loading.value = true
    await formRef.value?.validate()
    if (props.record !== undefined) {
      // edit
      await updateDept(formData.value)
      message.success('保存成功')
    } else {
      // add
      await createDept(formData.value)
      message.success('创建成功')
    }

    open.value = false
    emit('success')
  } catch (e) {
    // do nothing at the moment
    // until we have a unified error handling precedure
  } finally {
    loading.value = false
  }
}

// load detail
if (props.record?.id) {
  loading.value = true
  getDeptDetail(props.record.id).then((data) => {
    if (data.parentId === 0) {
      data.parentId = undefined
    }
    formData.value = data
    loading.value = false
  })
}
</script>
