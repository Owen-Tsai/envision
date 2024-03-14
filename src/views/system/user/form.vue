<template>
  <AModal
    v-model:open="computedOpen"
    :title="!editId ? '新增用户' : '编辑用户'"
    :after-close="resetFields"
    @cancel="computedOpen = false"
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
          <template v-if="!editId">
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
                :loading="pending"
                :field-names="{
                  label: 'title',
                  value: 'key'
                }"
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
            <AFormItem label="性别" name="status">
              <ASelect v-model:value="formData.status" :options="dictDataToOptions(genderOpts)" />
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
              <ASelect v-model:value="formData.status" :options="dictDataToOptions(statusOpts)" />
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
import { ref, computed, watch, type PropType } from 'vue'
import useDict from '@/hooks/use-dict'
import useRequest from '@/hooks/use-request'
import { dictDataToOptions } from '@/utils/envision'
import { getUserDetail, type UserDTO } from '@/api/system/user'
import { getDeptTree } from '@/api/system/dept'
import type { FormInstance, FormProps } from 'ant-design-vue'

const formRef = ref<FormInstance>()

const rules: FormProps['rules'] = {
  username: [{ required: true, message: '请填写用户账号' }],
  password: [{ required: true, message: '请填写初始密码' }],
  nickname: [{ required: true, message: '请填写用户名称' }],
  deptId: [{ required: true, message: '请选择所属部门' }]
}

const props = defineProps({
  open: {
    type: Boolean,
    required: true
  },
  editId: {
    type: Number,
    default: undefined
  },
  value: {
    type: Object as PropType<UserDTO>,
    required: true
  }
})

const loading = ref(false)

const emit = defineEmits(['update:value', 'update:open'])

const { sys_user_sex: genderOpts, sys_normal_disable: statusOpts } = useDict(
  'sys_user_sex',
  'sys_normal_disable'
)

const { data, pending } = useRequest(getDeptTree, { immediate: true })

const formData = computed({
  get: () => props.value,
  set: (val) => {
    emit('update:value', val)
  }
})

const computedOpen = computed({
  get: () => props.open,
  set: (val) => {
    emit('update:open', val)
  }
})

const resetFields = () => {
  formRef.value?.resetFields()
  formData.value.username = undefined
  formData.value.password = undefined
}

watch(
  () => props.editId,
  (val) => {
    if (val) {
      loading.value = true
      getUserDetail(val).then((data) => {
        formData.value = data
        loading.value = false
      })
    }
  }
)
</script>
