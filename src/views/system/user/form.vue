<template>
  <AModal
    v-model:open="visible"
    :title="mode === 'create' ? '新增用户' : '编辑用户'"
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
          <ACol :lg="mode === 'update' ? 24 : 12" :span="24">
            <AFormItem label="用户账号" name="username">
              <AInput v-model:value="formData.username" :disabled="mode === 'update'" />
            </AFormItem>
          </ACol>
          <template v-if="mode === 'create'">
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
          <!-- <ACol :lg="12" :span="24">
            <AFormItem label="岗位" name="postIds">
              <ASelect v-model:value="formData.postIds" />
            </AFormItem>
          </ACol> -->
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
import logger from '@/utils/logger'
import { getUserDetail, updateUser, createUser, type UserVO } from '@/api/system/user'
import { getDeptTree } from '@/api/system/dept'

const formRef = useTemplateRef<FormInstance>('formRef')

const rules: FormProps['rules'] = {
  username: [{ required: true, message: '请填写用户账号' }],
  password: [{ required: true, message: '请填写初始密码' }],
  nickname: [{ required: true, message: '请填写用户名称' }],
}

const emit = defineEmits(['success'])

const mode = ref<'create' | 'update'>('create')
const visible = ref(false)
const loading = ref(false)
const formData = ref<UserVO>({})

const [systemUserSex, commonStatus] = useDict('system_user_sex', 'common_status')

const { data, pending } = useRequest(getDeptTree, { immediate: true })

const submit = async () => {
  try {
    loading.value = true
    await formRef.value?.validate()
    if (mode.value === 'create') {
      await createUser(formData.value)
    } else {
      await updateUser(formData.value)
    }
    message.success('保存成功')
    visible.value = false
    emit('success')
  } catch (e) {
    logger.error('[system/user/form.vue] 表单提交失败。', e)
  } finally {
    loading.value = false
  }
}

const loadData = async (id: number) => {
  loading.value = true
  const data = await getUserDetail(id)
  formData.value = data
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
