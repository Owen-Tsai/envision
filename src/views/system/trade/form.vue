<template>
  <ACard :title="title">
    <template #extra>
      <div class="flex gap-4">
        <AButton
          :type="mode === 'edit' ? 'primary' : undefined"
          :disabled="id === undefined"
          :loading="loading"
          @click="switchMode"
        >
          <template v-if="mode === 'edit'" #icon><PlusOutlined /></template>
          {{ mode === 'edit' ? '新增下级' : '取消新增' }}
        </AButton>
        <APopconfirm
          v-show="mode === 'edit'"
          :title="`确定要删除${formData.name}吗？该操作无法恢复`"
          placement="bottomRight"
          @confirm="onDelete"
        >
          <AButton :disabled="id === undefined" danger :loading="loading">删除本级</AButton>
        </APopconfirm>
      </div>
    </template>
    <div>
      <ASpin v-if="id" :spinning="loading">
        <AForm
          ref="form"
          :model="formData"
          :label-col="{ style: { width: '120px' } }"
          :rules="rules"
        >
          <ARow>
            <ACol :span="24" :lg="12">
              <AFormItem label="上级行业编号" name="pid">
                {{ formData.pid }}
              </AFormItem>
            </ACol>
            <ACol :span="24" :lg="12">
              <AFormItem label="上级行业名称" name="pname">
                {{ formData.pname }}
              </AFormItem>
            </ACol>
          </ARow>
          <ARow>
            <ACol :span="24" :lg="12">
              <AFormItem label="行业代码" name="code">
                <AInput v-model:value="formData.code" />
              </AFormItem>
            </ACol>
            <ACol :span="24" :lg="12">
              <AFormItem label="行业名称" name="name">
                <AInput v-model:value="formData.name" />
              </AFormItem>
            </ACol>
          </ARow>

          <div class="flex items-center justify-end">
            <AButton type="primary" html-type="submit" @click="submit">
              {{ mode === 'add' ? '新增' : '保存' }}
            </AButton>
          </div>
        </AForm>
      </ASpin>
      <AEmpty v-else description="选择一个行业进行编辑" />
    </div>
  </ACard>
</template>

<script setup lang="ts">
import {
  addTradeInfo,
  modifyTradeInfo,
  getTradeInfo,
  deleteTradeInfo,
  type TradeInfoVO,
} from '@/api/system/trade'
import { message, type FormProps, type FormInstance } from 'ant-design-vue'

const rules: FormProps['rules'] = {
  name: [{ required: true, message: '请填写行业名称' }],
}

const { id } = defineProps<{
  id?: string
}>()

const emit = defineEmits(['success', 'update:id'])

const loading = ref(false)
const formRef = useTemplateRef<FormInstance>('form')
const mode = ref<'add' | 'edit'>('edit')
const toggle = useToggle(mode, {
  falsyValue: 'add',
  truthyValue: 'edit',
})

const title = computed(() =>
  mode.value === 'add' ? `在${formData.value.pname}下新增行业` : '编辑行业',
)

const formData = ref<TradeInfoVO>({})

const submit = async () => {
  loading.value = true
  try {
    await formRef.value?.validate()
    if (mode.value === 'add') {
      const id = await addTradeInfo(formData.value)
      emit('update:id', id)
      mode.value = 'edit'
    } else {
      await modifyTradeInfo(formData.value)
    }
    emit('success')
    message.success('保存成功')
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}

const loadNodeData = (id: string) => {
  loading.value = true
  getTradeInfo(id).then((res) => {
    formData.value = res
    loading.value = false
  })
}

const switchMode = () => {
  toggle()
  formRef.value?.clearValidate()
  if (mode.value === 'add') {
    formData.value.pname = formData.value.name
    formData.value.pid = formData.value.id
    formData.value.code = ''
    formData.value.name = ''
    formData.value.sort = 1
  } else {
    loadNodeData(id!)
  }
}

const onDelete = async () => {
  loading.value = true
  try {
    await deleteTradeInfo(id!)
    message.success('删除成功')
    emit('success')
  } catch (e) {
  } finally {
    emit('update:id', undefined)
    loading.value = false
  }
}

watch(
  () => id,
  (val) => {
    if (val) {
      loadNodeData(val)
    }
  },
)
</script>
