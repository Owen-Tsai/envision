<template>
  <AModal
    v-model:open="visible"
    :title="mode === 'create' ? '新增字典类型' : '编辑字典类型'"
    :confirm-loading="loading"
    @ok="submit"
  >
    <ASpin :spinning="loading">
      <AForm
        ref="formRef"
        :label-col="{ style: { width: '80px' } }"
        :model="formData"
        :rules="rules"
        class="mt-4"
      >
        <AFormItem label="字典名称" name="name">
          <AInput v-model:value="formData.name" placeholder="如：用户性别" />
        </AFormItem>
        <AFormItem label="字典类型" name="type">
          <AInput v-model:value="formData.type" placeholder="如：system_user_gender" />
        </AFormItem>
        <AFormItem label="状态" name="status">
          <ARadioGroup v-model:value="formData.status" :options="commonStatus" />
        </AFormItem>
        <AFormItem label="备注" name="remark">
          <ATextarea v-model:value="formData.remark" />
        </AFormItem>
        <AFormItem label="使用字符串" name="useString" extra="强制将字典数据视为字符串类型">
          <ASwitch v-model:checked="formData.useString" />
        </AFormItem>
      </AForm>
    </ASpin>
  </AModal>
</template>

<script lang="ts" setup>
import useDict from '@/hooks/use-dict'
import {
  addDictType,
  updateDictType,
  getDictTypeDetail,
  type DictTypeVO,
} from '@/api/system/dict/type'
import logger from '@/utils/logger'
import { message, type FormInstance, type FormProps } from 'ant-design-vue'

const rules: FormProps['rules'] = {
  name: [{ required: true, message: '请填写字典名称' }],
  type: [{ required: true, message: '请填写字典类型' }],
}

const emit = defineEmits(['success'])

const visible = ref(false)
const mode = ref<'create' | 'update'>('create')
const formRef = ref<FormInstance>()
const loading = ref(false)

const formData = ref<Partial<DictTypeVO>>({
  name: '',
  type: '',
  status: 0,
})

const [commonStatus] = useDict('common_status')

const submit = async () => {
  try {
    loading.value = true
    await formRef.value?.validate()

    if (mode.value === 'create') {
      await addDictType(formData.value)
    } else {
      await updateDictType(formData.value)
    }

    message.success('保存成功')
    emit('success')
    visible.value = false
  } catch (e) {
    logger.error(import.meta.url, '表单提交失败。', e)
  } finally {
    loading.value = false
  }
}

const loadData = async (id: number) => {
  loading.value = true
  const res = await getDictTypeDetail(id)
  formData.value = res
  loading.value = false
}

const open = (id?: number) => {
  formRef.value?.resetFields()
  mode.value = 'create'

  if (id) {
    mode.value = 'update'
    loadData(id)
  }

  visible.value = true
}

defineExpose({ open })
</script>
