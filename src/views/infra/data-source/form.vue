<template>
  <AModal
    v-model:open="isOpen"
    :title="isAdd ? '新增数据源配置' : '编辑数据源配置'"
    :confirm-loading="loading"
    @ok="submit"
  >
    <ASpin :spinning="loading">
      <AForm
        ref="formRef"
        :label-col="{ style: { width: '100px' } }"
        :model="formData"
        :rules="rules"
        class="mt-4"
      >
        <AFormItem label="数据源名称" name="name">
          <AInput v-model:value="formData.name" placeholder="如：master" />
        </AFormItem>
        <AFormItem label="数据源连接" name="url">
          <AInput v-model:value="formData.url" placeholder="如：http://127.0.0.1:3306" />
        </AFormItem>
        <AFormItem label="用户名" name="username">
          <AInput v-model:value="formData.username" placeholder="用于数据源连接的用户名" />
        </AFormItem>
        <AFormItem label="密码" name="password">
          <AInput v-model:value="formData.password" placeholder="用于数据源连接的密码" />
        </AFormItem>
      </AForm>
    </ASpin>
  </AModal>
</template>

<script lang="ts" setup>
import {
  addDataSource,
  updateDataSource,
  getDataSourceDetail,
  type DataSourceVO,
} from '@/api/infra/data-source'
import { message, type FormInstance, type FormProps } from 'ant-design-vue'
import useModalOpen from '@/hooks/use-modal'

const rules: FormProps['rules'] = {
  name: [{ required: true, message: '请填写数据源名称' }],
  url: [{ required: true, message: '请填写数据源连接' }],
  username: [{ required: true, message: '请填写用户名' }],
  password: [{ required: true, message: '请填写密码' }],
}

const props = defineProps<{
  record?: DataSourceVO
  open?: boolean
}>()

const emit = defineEmits(['success', 'update:open'])
const formRef = ref<FormInstance>()

const isOpen = useModalOpen(props, emit, formRef)

const loading = ref(false)

const formData = ref<DataSourceVO>({})

const isAdd = computed(() => props.record === undefined)

const submit = async () => {
  try {
    loading.value = true
    await formRef.value?.validate()

    if (isAdd.value) {
      await addDataSource(formData.value)
      message.success('创建成功')
    } else {
      await updateDataSource(formData.value)
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
      getDataSourceDetail(val).then((res) => {
        formData.value = res
        loading.value = false
      })
    }
  },
)
</script>
