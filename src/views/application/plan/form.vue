<template>
  <AModal
    v-model:open="open"
    :title="isAdd ? '新建申报计划' : '编辑申报计划'"
    destroy-on-close
    :confirm-loading="loading"
    :after-close="resetFields"
    @ok="submit"
  >
    <ASpin :spinning="loading">
      <AForm
        ref="formRef"
        :label-col="{ style: { width: '80px' } }"
        :model="formData"
        :rules="rules"
        class="mt-4"
      >
        <AFormItem label="计划名称" name="item">
          <AInput v-model:value="formData.item" placeholder="如：2024年生活补贴" />
        </AFormItem>
        <AFormItem label="所属应用" name="appId">
          <ASelect
            v-model:value="formData.appId"
            :options="appOpts"
            allow-clear
            :field-names="{ label: 'name', value: 'id' }"
            @change="setFlowId"
          />
        </AFormItem>
        <AFormItem label="需求附件" name="fjfl">
          <a-select
            v-model:value="formData.fjfl"
            mode="multiple"
            style="width: 100%"
            placeholder="请选择"
            :options="fjflOpts"
            :field-names="{ label: 'name', value: 'id' }"
            :max-tag-count="5"
            :loading="fjflPending"
            @change="setFjflIds"
          ></a-select>
        </AFormItem>
        <AFormItem label="常态化" name="daily">
          <ASwitch v-model:checked="formData.daily" @change="(v) => onDailyChange(v as boolean)" />
        </AFormItem>
        <template v-if="!formData.daily">
          <AFormItem label="开始时间" name="startTime">
            <ADatePicker v-model:value="formData.startTime" value-format="x" />
          </AFormItem>
          <AFormItem label="截止时间" name="endTime">
            <ADatePicker v-model:value="formData.endTime" value-format="x" />
          </AFormItem>
          <!-- <AFormItem label="起止时间" name="startTime">
            <ARangePicker v-model:value="formData.startTime" picker="date" value-format="x" />
           -->
        </template>
      </AForm>
    </ASpin>
  </AModal>
</template>

<script lang="ts" setup>
import { ref, computed, type PropType } from 'vue'
import useRequest from '@/hooks/use-request'
import { getApplicationSimpleList } from '@/api/application'
import { getAttachTypeSimpleList } from '@/api/application/plan'
import { createPlan, updatePlan, getPlanDetail, type PlanVO } from '@/api/application/plan'
import { message, type FormInstance, type FormProps, type SelectProps } from 'ant-design-vue'

const rules: FormProps['rules'] = {
  item: [{ required: true, message: '请填写申报计划名称' }],
  appId: [{ required: true, message: '请选择应用' }],
  fjfl: [{ required: true, message: '请选择需求附件' }],
  startTime: [{ required: true, message: '请选择计划开始时间' }],
  endTime: [{ required: true, message: '请选择计划截止时间' }]
}

const props = defineProps({
  record: {
    type: Object as PropType<PlanVO>
  }
})

const emit = defineEmits(['success', 'close'])

const formRef = ref<FormInstance>()
const loading = ref(false)
const open = ref(true)
const formData = ref<Partial<PlanVO>>({
  daily: false
})
const { data: appOpts } = useRequest(getApplicationSimpleList, { immediate: true })
const { data: fjflOpts, pending: fjflPending } = useRequest(getAttachTypeSimpleList, {
  immediate: true
})
const isAdd = computed(() => props.record === undefined)
const submit = async () => {
  try {
    loading.value = true
    await formRef.value?.validate()

    if (isAdd.value) {
      await createPlan(formData.value)
      message.success('创建成功')
    } else {
      await updatePlan(formData.value)
      message.success('保存成功')
    }

    emit('success')
    open.value = false
  } catch (e) {
    //
  } finally {
    loading.value = false
  }
}

const resetFields = () => {
  formRef.value?.resetFields()
  emit('close')
}

const onDailyChange = (checked: boolean) => {
  // we do nothing for now
  if (checked) {
    formData.value.startTime = String(new Date().getTime())
    formData.value.endTime = String(new Date('2099').getTime())
  }
}

const setFlowId = () => {
  formData.value.flow = appOpts.value?.find((v) => v.id === formData.value.appId)?.processIds
}
const setFjflIds: SelectProps['onChange'] = (value) => {
  console.log(`selected ${value}`)
}

if (props.record?.id) {
  loading.value = true
  getPlanDetail(props.record.id).then((res) => {
    formData.value = res
    loading.value = false
  })
}
</script>
