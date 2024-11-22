<template>
  <ACard :body-style="{ padding: '16px' }" class="dept-card" title="详情">
    <template #extra>
      <AButton type="primary" class="mr-5" v-if="info.id" @click="addMethod">新增下级</AButton>
      <AButton danger v-if="info.id" @click="deleteMethod(info.id)">删除</AButton>
    </template>

    <!--          <pre>{{ selectedKeys }}</pre>-->

    <a-descriptions bordered :column="2" v-if="info.id">
      <a-descriptions-item label="父行业编号">{{ info.pid }}</a-descriptions-item>
      <a-descriptions-item label="父行业名称">{{ info.pname }}</a-descriptions-item>
      <a-descriptions-item label="行业编号">{{ info.id }}</a-descriptions-item>
      <a-descriptions-item label="行业名称" v-if="!editMode">
        {{ info.name }}
        <a-button :icon="h(EditOutlined)" @click="editMode = true" class="ml-2" />
      </a-descriptions-item>
      <a-descriptions-item label="行业名称" v-else>
        <a-input v-model:value="newName" class="w-1/3"></a-input>
        <a-button :icon="h(CheckOutlined)" @click="modifyMethod" class="ml-2" />
        <a-button :icon="h(CloseOutlined)" @click="cancelEditMode" class="ml-2" />
      </a-descriptions-item>
    </a-descriptions>

    <a-empty v-if="!info.id" />
  </ACard>

  <AddForm v-model:open="AddFormShow" v-model:pid="info.id" v-model:pname="info.name" />
</template>

<script setup lang="ts">
import { ref, watch, inject, h } from 'vue'
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons-vue'
import { getTradeInfo, deleteTradeInfo, modifyTradeInfo } from '@/api/system/trade'
import AddForm from '@/views/system/trade/add-form.vue'
import { Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { createVNode } from 'vue'
const refresh = inject('layoutContext')

const props = defineProps({
  id: {
    type: String
  }
})

const editMode = ref<boolean>(false)
const newName = ref<string>('')

const info = ref({
  pid: '',
  pname: '',
  id: '',
  name: ''
})

const nullInfo = ref({
  pid: '',
  pname: '',
  id: '',
  name: '',
  level: ''
})

watch(
  () => props.id,
  async (newValue, oldValue) => {
    if (newValue) {
      // console.log(newValue)
      info.value = await getTradeInfo(newValue)
      newName.value = info.value.name
    } else {
      info.value = nullInfo.value
    }
  },
  { deep: true, immediate: true }
)

const AddFormShow = ref<boolean>(false)

const addMethod = () => {
  AddFormShow.value = true
}

const deleteMethod = (id: string) => {
  Modal.confirm({
    title: '您确定要删除这个行业吗?',
    icon: createVNode(ExclamationCircleOutlined),
    content: '',
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    async onOk() {
      await deleteTradeInfo(id)
      info.value = nullInfo.value
      ;(refresh as any)()
    },
    onCancel() {
      console.log('Cancel')
    }
  })
}

const cancelEditMode = () => {
  newName.value = info.value.name
  editMode.value = false
}

const modifyMethod = async () => {
  await modifyTradeInfo(info.value.id, newName.value)
  info.value = await getTradeInfo(info.value.id)
  newName.value = info.value.name
  editMode.value = false
}
</script>

<style scoped lang="scss"></style>
