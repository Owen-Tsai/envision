<template>
  <AModal
    v-model:open="visible"
    :title="mode === 'create' ? '新增角色类型' : '编辑角色类型'"
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
        <AFormItem label="角色名称" name="name">
          <AInput v-model:value="formData.name" placeholder="如：系统管理员" />
        </AFormItem>
        <AFormItem label="角色标识" name="code">
          <AInput v-model:value="formData.code" placeholder="如：system_admin" />
        </AFormItem>

        <ARow>
          <ACol :span="12">
            <AFormItem label="显示顺序" name="sort">
              <AInputNumber v-model:value="formData.sort" />
            </AFormItem>
          </ACol>
          <ACol :span="12">
            <AFormItem label="状态" name="status">
              <ARadioGroup v-model:value="formData.status" :options="commonStatus" />
            </AFormItem>
          </ACol>
        </ARow>
        <AFormItem label="备注" name="remark">
          <ATextarea v-model:value="formData.remark" />
        </AFormItem>
      </AForm>
    </ASpin>
  </AModal>
</template>

<script lang="ts" setup>
import useDict from '@/hooks/use-dict'
import { addRole, updateRole, getRoleDetail, type RoleVO } from '@/api/system/role'
import { message, type FormInstance, type FormProps } from 'ant-design-vue'
import logger from '@/utils/logger'

const rules: FormProps['rules'] = {
  name: [{ required: true, message: '请填写角色名称' }],
  code: [{ required: true, message: '请填写角色标识' }],
}

const mode = ref<'create' | 'update'>('create')
const visible = ref(false)

const emit = defineEmits(['success'])
const formRef = ref<FormInstance>()

const loading = ref(false)

const formData = ref<RoleVO>({
  sort: 0,
  status: 0,
})

const [commonStatus] = useDict('common_status')

const submit = async () => {
  loading.value = true
  try {
    await formRef.value?.validate()

    if (mode.value === 'create') {
      await addRole(formData.value)
    } else {
      await updateRole(formData.value)
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
  const res = await getRoleDetail(id)
  formData.value = res
  loading.value = false
}

const open = (id?: number) => {
  formRef.value?.resetFields()

  if (id) {
    loadData(id)
    mode.value = 'update'
  } else {
    mode.value = 'create'
  }

  visible.value = true
}

defineExpose({ open })
</script>
