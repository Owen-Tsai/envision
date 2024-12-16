<template>
  <AModal
    v-model:open="ModalOpen"
    title="新增行业"
    :confirm-loading="loading"
    @ok="submit"
    @cancel="cancel"
  >
    <AForm
      ref="formRef"
      :model="formData"
      :rules="rules"
      :label-col="{ style: { width: '80px' } }"
      class="mt-8"
    >
      <ASpin :spinning="loading">
        <ARow :gutter="16">
          <ACol :lg="12" :span="24">
            <AFormItem label="父行业编号" name="pid">
              <AInput v-model:value="formData.pid" disabled />
            </AFormItem>
          </ACol>
          <ACol :lg="12" :span="24">
            <AFormItem label="父行业名称" name="pname">
              <AInput v-model:value="formData.pname" disabled />
            </AFormItem>
          </ACol>
          <ACol :lg="12" :span="24">
            <AFormItem label="行业名称" name="name">
              <AInput v-model:value="formData.name" />
            </AFormItem>
          </ACol>
          <ACol :lg="12" :span="24">
            <AFormItem label="行业编码" name="code">
              <AInput v-model:value="formData.code" />
            </AFormItem>
          </ACol>
        </ARow>
      </ASpin>
    </AForm>
  </AModal>
</template>

<script lang="ts" setup>
import { ref, computed, watch, inject } from 'vue'
import { type FormInstance, type FormProps } from 'ant-design-vue'
import { addTradeInfo } from '@/api/system/trade'
const refresh = inject('layoutContext')

const formRef = ref<FormInstance>()

const rules: FormProps['rules'] = {
  name: [{ required: true, message: '请填写行业名称' }],
}

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  pid: {
    type: String,
    required: true,
  },
  pname: {
    type: String,
    required: true,
  },
})

console.log(props)

//是否显示附件库组件
const emit = defineEmits(['update:open'])
const ModalOpen = computed({
  get: () => props.open,
  set: (val) => {
    emit('update:open', val)
  },
})

const loading = ref(false)
const formData = ref({
  pid: props.pid,
  pname: props.pname,
  name: '',
  code: '',
})

watch(
  () => props,
  (newValue, oldValue) => {
    console.log(newValue)
    formData.value.pid = newValue.pid
    formData.value.pname = newValue.pname
  },
  { deep: true, immediate: true },
)

const submit = async () => {
  try {
    loading.value = true
    await formRef.value?.validate()
    const data = await addTradeInfo(formData.value)
    console.log(data)
    ModalOpen.value = false
    ;(refresh as any)()
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}

const cancel = () => {
  ModalOpen.value = false
}
</script>
