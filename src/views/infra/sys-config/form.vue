<template>
  <AModal
    v-model:open="open"
    :title="isAdd ? '新增参数配置' : '编辑参数配置'"
    destroy-on-close
    :confirm-loading="loading"
    :after-close="resetFields"
    @ok="submit"
  >
    <ASpin :spinning="loading">
      <AForm
        ref="formRef"
        :label-col="{ style: { width: '100px' } }"
        :model="formData"
        :rules="rules"
        class="mt-4"
      >
        <AFormItem label="参数分类" name="type">
          <AInput v-model:value="formData.type" placeholder="请输入参数类别" />
        </AFormItem>
        <AFormItem label="参数名称" name="name">
          <AInput v-model:value="formData.name" placeholder="请输入参数名称" />
        </AFormItem>
        <AFormItem label="参数键名" name="key">
          <AInput v-model:value="formData.key" placeholder="请输入参数键名" />
        </AFormItem>
        <AFormItem label="参数键值" name="value">
          <AInput v-model:value="formData.value" placeholder="请输入参数键值" />
        </AFormItem>
        <AFormItem label="是否可见" name="visible">
          <ARadioGroup v-model:value="formData.visible" :options="infraBooleanString" />
        </AFormItem>
        <AFormItem label="备注" name="remark">
          <ATextarea v-model:value="formData.remark" placeholder="请输入备注信息" />
        </AFormItem>
      </AForm>
    </ASpin>
  </AModal>
</template>

<script lang="ts" setup>
import { ref, computed, type PropType } from 'vue'
import useDict from '@/hooks/use-dict'
import { addConfig, updateConfig, getDetail, type SysConfigVO } from '@/api/infra/sys-config'
import { message, type FormInstance, type FormProps } from 'ant-design-vue'

const rules: FormProps['rules'] = {
  type: [{ required: true, message: '请填写参数类别' }],
  name: [{ required: true, message: '请填写参数名称' }],
  key: [{ required: true, message: '请填写参数键名' }],
  value: [{ required: true, message: '请填写参数键值' }],
  visible: [{ required: true, message: '请选择参数可见性' }]
}

const props = defineProps({
  record: {
    type: Object as PropType<SysConfigVO>
  }
})

const emit = defineEmits(['success', 'close'])

const { infraBooleanString } = useDict('infra_boolean_string')

const formRef = ref<FormInstance>()
const loading = ref(false)
const open = ref(true)
const formData = ref<SysConfigVO>({})

const isAdd = computed(() => props.record === undefined)

const submit = async () => {
  try {
    loading.value = true
    await formRef.value?.validate()

    if (isAdd.value) {
      await addConfig(formData.value)
      message.success('创建成功')
    } else {
      await updateConfig(formData.value)
      message.success('保存成功')
    }

    emit('success')
  } catch (e) {
    //
  } finally {
    loading.value = false
  }
}

const resetFields = () => {
  formRef.value?.resetFields()
  emit('close')
}

if (props.record?.id) {
  loading.value = true
  getDetail(props.record.id).then((res) => {
    formData.value = res
    loading.value = false
  })
}
</script>
