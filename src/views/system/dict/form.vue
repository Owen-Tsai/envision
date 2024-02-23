<template>
  <AModal
    v-model:open="computedOpen"
    :title="isAdd ? '新增字典类型' : '编辑字典类型'"
    :confirm-loading="loading"
    destroy-on-close
    @ok="handleSubmit"
    @cancel="computedOpen = false"
  >
    <ASpin :spinning="loading">
      <AForm :label-col="{ span: 4 }" :model="formData" class="mt-4">
        <AFormItem label="字典名称" name="dictName" :rules="[{ required: true, trigger: 'blur' }]">
          <AInput v-model:value="formData.dictName" />
        </AFormItem>
        <AFormItem label="字典类型" name="dictType" :rules="[{ required: true, trigger: 'blur' }]">
          <AInput v-model:value="formData.dictType" />
        </AFormItem>
        <AFormItem label="状态" name="status">
          <ARadioGroup v-model:value="formData.status">
            <ARadio v-for="item in statusOpts" :key="item.dictValue" :value="item.dictValue">{{
              item.dictLabel
            }}</ARadio>
          </ARadioGroup>
        </AFormItem>
        <AFormItem label="备注" name="remark">
          <ATextarea v-model:value="formData.remark" />
        </AFormItem>
      </AForm>
    </ASpin>
  </AModal>
</template>

<script lang="ts" setup>
import { ref, computed, watch, type PropType } from 'vue'
import { Form } from 'ant-design-vue'
import useDict from '@/hooks/use-dict'
import { addType, updateType, getDetail, type TypeDTO } from '@/api/system/dict/type'

const props = defineProps({
  open: {
    type: Boolean,
    required: true
  },
  id: {
    type: Number
  },
  value: {
    type: Object as PropType<TypeDTO>,
    required: true
  }
})

const emit = defineEmits(['update:value', 'update:open'])

const loading = ref(false)

const useForm = Form.useForm

const { sys_normal_disable: statusOpts } = useDict('sys_normal_disable')

const isAdd = computed(() => props.id === undefined)

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

const { resetFields } = useForm(formData)

const modalActionCbk = () => {
  loading.value = false
}

const handleSubmit = () => {
  loading.value = true
  if (isAdd.value) {
    addType(formData.value).then(modalActionCbk)
  } else {
    updateType(formData.value).then(modalActionCbk)
  }
}

watch(
  () => props.id,
  (val) => {
    if (val !== undefined) {
      loading.value = true
      getDetail(val).then((res) => {
        formData.value = res
        loading.value = false
      })
    }
  }
)

defineExpose({
  resetFields
})
</script>
