<template>
  <AModal
    v-model:open="computedOpen"
    :title="isAdd ? '新增用户' : '编辑用户'"
    @cancel="computedOpen = false"
  >
    <AForm ref="formRef" :model="formData">
      <ARow :gutter="16">
        <template v-if="isAdd">
          <ACol :lg="12" :span="24">
            <AFormItem label="用户账号" name="userName">
              <AInput v-model:value="formData.userName" />
            </AFormItem>
          </ACol>
          <ACol :lg="12" :span="24">
            <AFormItem label="初始密码" name="password">
              <AInputPassword v-model:value="formData.password" />
            </AFormItem>
          </ACol>
        </template>
        <ACol :lg="12" :span="24">
          <AFormItem label="用户名称" name="nickName">
            <AInput v-model:value="formData.nickName" />
          </AFormItem>
        </ACol>
        <ACol :lg="12" :span="24">
          <AFormItem label="所属部门" name="deptId">
            <ASelect v-model:value="formData.deptId"></ASelect>
          </AFormItem>
        </ACol>
        <ACol :lg="12" :span="24">
          <AFormItem label="手机号码" name="phonenumber">
            <AInput v-model:value="formData.phonenumber" />
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
    </AForm>
  </AModal>
</template>

<script lang="ts" setup>
import { ref, computed, type PropType } from 'vue'
import useDict from '@/hooks/use-dict'
import { dictDataToOptions } from '@/utils/envision'
import type { FormInstance } from 'ant-design-vue'
import type { UserDTO } from '@/api/system/user'

const props = defineProps({
  open: {
    type: Boolean,
    required: true
  },
  mode: {
    type: String as PropType<'add' | 'edit'>,
    default: 'add'
  },
  value: {
    type: Object as PropType<UserDTO>,
    required: true
  }
})

const emit = defineEmits(['update:value', 'update:open'])

const { sys_user_sex: genderOpts, sys_normal_disable: statusOpts } = useDict(
  'sys_user_sex',
  'sys_normal_disable'
)

const isAdd = computed(() => props.mode === 'add')

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

const formRef = ref<FormInstance>()

const resetFields = () => {
  formRef.value?.resetFields()
}

defineExpose({
  resetFields
})
</script>
