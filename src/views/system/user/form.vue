<template>
  <AModal
    v-model:open="open"
    :title="!id ? '新增用户' : '编辑用户'"
    destroy-on-close
    :after-close="resetFields"
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
          <template v-if="!id">
            <ACol :lg="12" :span="24">
              <AFormItem label="用户账号" name="username">
                <AInput v-model:value="formData.username" />
              </AFormItem>
            </ACol>
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
            <AFormItem label="角色" name="roleIds">
              <ASelect v-model:value="formData.roleIds"></ASelect>
            </AFormItem>
          </ACol>
          <ACol :lg="12" :span="24">
            <AFormItem label="岗位" name="postIds">
              <ASelect v-model:value="formData.postIds"></ASelect>
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
import { ref } from 'vue'
import { message, type FormInstance, type FormProps } from 'ant-design-vue'
import useDict from '@/hooks/use-dict'
import useRequest from '@/hooks/use-request'
import { getUserDetail, updateUser, createUser, type UserVO } from '@/api/system/user'
import { getDeptTree } from '@/api/system/dept'

const formRef = ref<FormInstance>()

const rules: FormProps['rules'] = {
  username: [{ required: true, message: '请填写用户账号' }],
  password: [{ required: true, message: '请填写初始密码' }],
  nickname: [{ required: true, message: '请填写用户名称' }]
}

const props = defineProps({
  id: {
    type: Number,
    default: undefined
  }
})

const emit = defineEmits(['success', 'close'])

const loading = ref(false)
const formData = ref<UserVO>({})
const open = ref(true)

const { systemUserSex, commonStatus } = useDict('system_user_sex', 'common_status')

const { data, pending } = useRequest(getDeptTree, { immediate: true })

const resetFields = () => {
  formRef.value?.resetFields()
  emit('close')
}

const submit = async () => {
  try {
    loading.value = true
    await formRef.value?.validate()
    if (props.id !== undefined) {
      // update
      await updateUser(formData.value)
      message.success('保存成功')
    } else {
      // add
      await createUser(formData.value)
      message.success('创建成功')
    }

    open.value = false
    emit('success')
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}

if (props.id) {
  loading.value = true
  getUserDetail(props.id).then((data) => {
    formData.value = data
    loading.value = false
  })
}
</script>
