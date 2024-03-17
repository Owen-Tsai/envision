<template>
  <AModal
    v-model:open="computedOpen"
    title="分配角色"
    :after-close="resetFields"
    :confirm-loading="pending || loading"
    @cancel="computedOpen = false"
    @ok="submit"
  >
    <AAlert type="info" class="mt-4">
      <template #message>
        设置用户
        <b>{{ nickname }}</b>
        的角色：
      </template>
    </AAlert>
    <AForm ref="formRef" :model="formData" class="mt-4">
      <ASpin :spinning="loading || pending">
        <AFormItem label="角色" name="roleIds">
          <ASelect
            v-model:value="formData.roleIds"
            :loading="pending || loading"
            :options="data"
            :field-names="{ label: 'name', value: 'id' }"
            mode="multiple"
          />
        </AFormItem>
      </ASpin>
    </AForm>
  </AModal>
</template>

<script lang="ts" setup>
import { ref, computed, watch, type PropType } from 'vue'
import { message, type FormInstance } from 'ant-design-vue'
import { setUserRole, getUserRoles, type UserRoleDTO } from '@/api/system/permission'
import { getSimpleList } from '@/api/system/role'
import useRequest from '@/hooks/use-request'

const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  nickname: {
    type: String,
    required: true
  },
  value: {
    type: Object as PropType<UserRoleDTO>,
    required: true
  },
  open: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:open', 'update:value'])

const formRef = ref<FormInstance>()
const loading = ref(false)

const computedOpen = computed({
  get: () => props.open,
  set: (val) => {
    emit('update:open', val)
  }
})

const formData = computed({
  get: () => props.value,
  set: (val) => {
    emit('update:value', val)
  }
})

const submit = async () => {
  loading.value = true
  try {
    await formRef.value?.validate()
    await setUserRole(props.id, formData.value.roleIds)
    message.success('保存成功')
    computedOpen.value = false
  } catch (e) {
    // do nothing
  } finally {
    loading.value = false
  }
}

const resetFields = () => {
  formRef.value?.resetFields()
}

const { data, pending, execute } = useRequest(getSimpleList)

watch(
  () => computedOpen.value,
  (val) => {
    if (val) {
      loading.value = true
      execute()
      getUserRoles(props.id)
        .then((data) => {
          formData.value.roleIds = data
        })
        .finally(() => {
          loading.value = false
        })
    }
  }
)
</script>
