<template>
  <div class="view">
    <ACard v-if="permission.has('attachtype:attach-type:query')" class="mb-4">
      <AForm ref="filterForm" :label-col="{ span: 6 }" class="dense-form" :model="queryParams">
        <ARow :gutter="[0, 16]">
          <ACol :lg="8" :span="24">
            <AFormItem label="附件名称" name="name">
              <AInput v-model:value="queryParams.name" placeholder="请输入附件名称" allow-clear />
            </AFormItem>
          </ACol>
          <ACol :lg="8" :span="24">
            <AFormItem label="附件代码" name="item">
              <AInput
                v-model:value="queryParams.modeName"
                placeholder="请输入附件代码"
                allow-clear
              />
            </AFormItem>
          </ACol>
          <ACol :lg="8" :span="24">
            <AFlex justify="end" align="center" :gap="16">
              <AButton html-type="reset" @click="onFilterReset">重置</AButton>
              <AButton html-type="submit" type="primary" @click="onFilter">查询</AButton>
            </AFlex>
          </ACol>
        </ARow>
      </AForm>
    </ACard>

    <ACard title="附件分类">
      <template #extra>
        <AFlex :gap="8">
          <AButton
            v-if="permission.has('attachtype:attach-type:create')"
            type="primary"
            :loading="pending"
            @click="onEdit()"
          >
            <template #icon>
              <PlusOutlined />
            </template>
            新增
          </AButton>
          <ATooltip title="重新载入">
            <AButton type="text" :loading="pending" @click="execute">
              <template #icon>
                <ReloadOutlined />
              </template>
            </AButton>
          </ATooltip>
        </AFlex>
      </template>

      <div class="overflow-x-auto">
        <ATable
          :columns="columns"
          :data-source="data?.list"
          :loading="pending"
          :pagination="pagination"
          @change="onChange"
        >
          <template #bodyCell="scope: TableScope<AttachClassVO>">
            <template v-if="scope?.column.key === 'allowFileType'">
              <a-tag v-for="(item, index) in scope.text" :key="index">{{ item }}</a-tag>
            </template>
            <template v-if="scope?.column.key === 'maxFileSize'">
              {{ scope.text / 1024 / 1024 }}MB
            </template>
            <template v-if="scope?.column.key === 'ismust'">
              <a-tag color="red" v-if="scope.text === 1">必传</a-tag>
              <a-tag v-if="scope.text === 0">非必传</a-tag>
            </template>
            <template v-if="scope?.column.key === 'createTime'">
              {{ dayjs(scope.text).format('YYYY-MM-DD HH:mm') }}
            </template>
            <template v-if="scope?.column.title === '操作'">
              <AFlex :gap="16">
                <ATypographyLink
                  v-if="permission.has('attachtype:attach-type:update')"
                  @click="onEdit(scope!.record)"
                >
                  <EditOutlined />
                  编辑
                </ATypographyLink>
                <APopconfirm
                  v-if="permission.has('attachtype:attach-type:delete')"
                  title="该操作无法撤销，确定要删除吗？"
                  :overlay-style="{ width: '240px' }"
                  @confirm="onDelete(scope!.record)"
                >
                  <ATypographyLink type="danger">
                    <DeleteOutlined />
                    删除
                  </ATypographyLink>
                </APopconfirm>
              </AFlex>
            </template>
          </template>
        </ATable>
      </div>
    </ACard>

    <FormModal v-if="visible" :record="entry" @success="execute" @close="visible = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import { ReloadOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { permission } from '@/hooks/use-permission'
import { useTable, columns } from './use-table'
import useActions from './use-action'
import FormModal from './form.vue'
import type { FormInstance } from 'ant-design-vue'
import type { AttachClassVO } from '@/api/application/attach-class'

const filterForm = ref<FormInstance>()

const { data, pending, execute, queryParams, onFilter, onChange, onFilterReset, pagination } =
  useTable(filterForm)

const { entry, visible, onDelete, onEdit } = useActions(execute)
defineOptions({ name: 'SystemService' })
</script>
