<template>
  <AModal
    v-model:open="isOpen"
    :title="!record ? '新增用户' : '编辑用户'"
    :confirm-loading="loading"
    @ok="submit"
  >
    <AForm
      ref="formRef"
      :model="formData"
      :rules="rules"
      :label-col="{ style: { width: '80px' } }"
      class="mt-4"
    >
      <ASpin :spinning="loading">
        <ARow :gutter="16">
          <ACol :lg="record ? 24 : 12" :span="24">
            <AFormItem label="用户账号" name="username">
              <AInput v-model:value="formData.username" :disabled="!!record" />
            </AFormItem>
          </ACol>
          <template v-if="!record">
            <ACol :lg="12" :span="24">
              <AFormItem label="初始密码" name="password">
                <AInputPassword v-model:value="formData.password" />
              </AFormItem>
            </ACol>
          </template>
          <ACol :lg="12" :span="24">
            <AFormItem label="用户名称" name="nickname">
              <AInput v-model:value="formData.nickname" />
            </AFormItem>
          </ACol>
          <ACol :lg="12" :span="24">
            <AFormItem label="所属部门" name="deptId">
              <ATreeSelect
                v-model:value="formData.deptId"
                :tree-data="data"
                tree-data-simple-mode
                :loading="pending"
                :field-names="{ label: 'name', value: 'key' }"
              />
            </AFormItem>
          </ACol>
          <ACol :lg="12" :span="24">
            <AFormItem label="手机号码" name="mobile">
              <AInput v-model:value="formData.mobile" />
            </AFormItem>
          </ACol>
          <ACol :lg="12" :span="24">
            <AFormItem label="邮箱" name="email">
              <AInput v-model:value="formData.email" />
            </AFormItem>
          </ACol>
          <ACol :lg="12" :span="24">
            <AFormItem label="性别" name="sex">
              <ASelect v-model:value="formData.sex" :options="systemUserSex" />
            </AFormItem>
          </ACol>
          <ACol :lg="12" :span="24">
            <AFormItem label="岗位" name="postIds">
              <ASelect v-model:value="formData.postIds" />
            </AFormItem>
          </ACol>
          <ACol :lg="12" :span="24">
            <AFormItem label="状态" name="status">
              <ASelect v-model:value="formData.status" :options="commonStatus" />
            </AFormItem>
          </ACol>
          <ACol :span="24">
            <AFormItem label="备注" name="remark">
              <ATextarea v-model:value="formData.remark"></ATextarea>
            </AFormItem>
          </ACol>
        </ARow>
      </ASpin>
    </AForm>
  </AModal>
</template>

<script lang="ts" setup>
import { message, type FormInstance, type FormProps } from 'ant-design-vue'
import useDict from '@/hooks/use-dict'
import useRequest from '@/hooks/use-request'
import useModalOpen from '@/hooks/use-modal'
import { getUserDetail, updateUser, createUser, type UserVO } from '@/api/system/user'
import { getDeptTree } from '@/api/system/dept'

const formRef = useTemplateRef<FormInstance>('formRef')

const rules: FormProps['rules'] = {
  username: [{ required: true, message: '请填写用户账号' }],
  password: [{ required: true, message: '请填写初始密码' }],
  nickname: [{ required: true, message: '请填写用户名称' }],
}

const props = defineProps<{
  record?: UserVO
  open?: boolean
}>()

const emit = defineEmits(['success', 'update:open'])

const isOpen = useModalOpen(props, emit, formRef)

const loading = ref(false)
const formData = ref<UserVO>({})

const [systemUserSex, commonStatus] = useDict('system_user_sex', 'common_status')

const { data, pending } = useRequest(getDeptTree, { immediate: true })

const submit = async () => {
  try {
    loading.value = true
    await formRef.value?.validate()
    if (props.record !== undefined) {
      // update
      await updateUser(formData.value)
      message.success('保存成功')
    } else {
      // add
      await createUser(formData.value)
      message.success('创建成功')
    }

    isOpen.value = false
    emit('success')
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}

watch(
  () => props.record?.id,
  (val) => {
    if (val) {
      loading.value = true
      getUserDetail(val).then((data) => {
        formData.value = data
        loading.value = false
      })
    }
  },
)
</script>
