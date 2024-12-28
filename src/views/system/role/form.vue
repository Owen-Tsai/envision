<template>
  <AModal
    v-model:open="isOpen"
    :title="isAdd ? '新增角色类型' : '编辑角色类型'"
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
import useModalOpen from '@/hooks/use-modal'

const rules: FormProps['rules'] = {
  name: [{ required: true, message: '请填写角色名称' }],
  code: [{ required: true, message: '请填写角色标识' }],
}

const props = defineProps<{
  record?: RoleVO
  open?: boolean
}>()

const emit = defineEmits(['success', 'update:open'])
const formRef = ref<FormInstance>()

const isOpen = useModalOpen(props, emit, formRef)

const loading = ref(false)

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
    isOpen.value = false
  } catch (e) {
    //
  } finally {
    loading.value = false
  }
}

watch(
  () => props.record?.id,
  (val) => {
    if (val) {
      loading.value = true
      getRoleDetail(val).then((res) => {
        formData.value = res
        loading.value = false
      })
    }
  },
)
</script>
