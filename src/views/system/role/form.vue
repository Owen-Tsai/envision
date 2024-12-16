<template>
  <AModal
    v-model:open="open"
    :title="isAdd ? '新增角色类型' : '编辑角色类型'"
    destroy-on-close
    :confirm-loading="loading"
    :after-close="resetFields"
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
import { ref, computed, type PropType } from 'vue'
import useDict from '@/hooks/use-dict'
import { addRole, updateRole, getRoleDetail, type RoleVO } from '@/api/system/role'
import { message, type FormInstance, type FormProps } from 'ant-design-vue'

const rules: FormProps['rules'] = {
  name: [{ required: true, message: '请填写角色名称' }],
  code: [{ required: true, message: '请填写角色标识' }],
}

const props = defineProps({
  record: {
    type: Object as PropType<RoleVO>,
  },
})

const emit = defineEmits(['success', 'close'])

const formRef = ref<FormInstance>()
const loading = ref(false)
const open = ref(true)
const formData = ref<RoleVO>({
  sort: 0,
  status: 0,
})

const [commonStatus] = useDict('common_status')

const isAdd = computed(() => props.record === undefined)

const submit = async () => {
  try {
    loading.value = true
    await formRef.value?.validate()

    if (isAdd.value) {
      await addRole(formData.value)
      message.success('创建成功')
    } else {
      await updateRole(formData.value)
      message.success('保存成功')
    }

    emit('success')
    open.value = false
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
  getRoleDetail(props.record.id).then((res) => {
    formData.value = res
    loading.value = false
  })
}
</script>
