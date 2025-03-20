<template>
  <a-card style="width: 100%">
    <a-table :columns="columns" :data-source="uploadList" :pagination="false">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'maxFileSize'">
          小于{{ record.maxFileSize / 1024 }}KB
        </template>
        <template v-if="column.key === 'ismust'">
          <a-tag color="red" v-if="record.ismust === 1">必传</a-tag>
          <a-tag v-if="record.ismust === 0">非必传</a-tag>
        </template>
        <template v-if="column.key === 'uploadedFile'">
          {{ record.attachDO ? record.attachDO.uploadname : '用户未上传' }}
        </template>
        <template v-if="column.key === 'action'">
          <a-button class="selectButton" @click="view(record.attachDO)" v-if="record.attachDO">
            <EyeOutlined />
            查看
          </a-button>
        </template>
      </template>
    </a-table>
  </a-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { EyeOutlined } from '@ant-design/icons-vue'
import { getAttachView, getUploadList, type UploadListType } from '@/api/attach'
import type { TableProps } from 'ant-design-vue'

const props = defineProps({
  planId: {
    type: String,
    required: true,
  },
  applyId: {
    type: String,
    required: true,
  },
  appId: {
    type: String,
    required: true,
  },
  currentAuditProcess: {
    type: String,
    required: true,
  },
})

//查看或下载附件方法
const view = async (attachDO: any) => {
  // console.log('查看附件: ', attachDO)
  // const url = import.meta.env.VITE_API_URL + '/common/attach/get?attachId=' + attachDO.id
  // window.open(url, '_blank')
  const data = await getAttachView(attachDO.id, attachDO.modeName)
  const url = URL.createObjectURL(data)
  window.open(url)
}

const refreshList = async () => {
  uploadList.value = await getUploadList(props.planId, props.applyId, props.appId)
}

// 附件表格中的列
const columns: TableProps['columns'] = [
  {
    title: '附件名称',
    dataIndex: 'name',
    key: 'name',
    width: 200,
    ellipsis: true,
  },
  {
    title: '文件类型',
    dataIndex: 'allowFileType',
    key: 'allowFileType',
  },
  {
    title: '文件大小',
    dataIndex: 'maxFileSize',
    key: 'maxFileSize',
  },
  {
    title: '是否必传',
    dataIndex: 'ismust',
    key: 'ismust',
  },
  {
    title: '已上传附件',
    dataIndex: 'uploadedFile',
    key: 'uploadedFile',
  },
  {
    title: '操作',
    key: 'action',
  },
]

//需要上传的列表
const uploadList = ref<UploadListType>([])

// 对外暴露方法
defineExpose({
  refreshList,
})
</script>

<style scoped lang="scss">
.selectButton {
  margin-right: 20px;
}
</style>
