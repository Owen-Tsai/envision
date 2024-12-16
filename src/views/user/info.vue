<template>
  <AForm
    ref="formRef"
    :mode="formData"
    :label-col="{ style: { width: '80px' } }"
    class="form"
    @submit="submit"
  >
    <ASpin :spinning="loading">
      <AFormItem label="用户名称" name="nickname">
        <AInput v-model:value="formData.nickname" placeholder="请输入用户名称" />
      </AFormItem>
      <AFormItem label="手机号码" name="mobile">
        <AInput v-model:value="formData.mobile" placeholder="请输入手机号码" />
      </AFormItem>
      <AFormItem label="邮箱地址" name="email">
        <AInput v-model:value="formData.email" placeholder="请输入邮箱地址" />
      </AFormItem>
      <AFormItem label="性别" name="sex">
        <ARadioGroup :options="systemUserSex" v-model:value="formData.sex" />
      </AFormItem>

      <AFlex class="ml-80px" :gap="16">
        <AButton type="primary" html-type="submit">保存</AButton>
      </AFlex>
    </ASpin>
  </AForm>
</template>

<script lang="ts" setup>
import { ref, watchEffect, type PropType } from 'vue'
import { type FormInstance } from 'ant-design-vue'
import { updateProfile, type ProfileVO } from '@/api/system/user/profile'
import useDict from '@/hooks/use-dict'

const props = defineProps({
  profile: {
    type: Object as PropType<ProfileVO | undefined>,
    required: true,
  },
})

const emit = defineEmits(['success'])

const formData = ref<ProfileVO>({})
const formRef = ref<FormInstance>()
const loading = ref(false)

const [systemUserSex] = useDict('system_user_sex')

const submit = async () => {
  try {
    loading.value = true
    // await formRef.value?.validate()
    await updateProfile(formData.value)
    emit('success')
  } catch (e) {
    //
  } finally {
    loading.value = false
  }
}

watchEffect(() => {
  if (props.profile !== undefined) {
    formData.value = { ...props.profile }
  }
})
</script>

<style lang="scss" scoped></style>
