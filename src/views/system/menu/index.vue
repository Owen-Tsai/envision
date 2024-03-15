<template>
  <div class="view">
    <ARow :gutter="24">
      <ACol :span="24">
        <ACard>
          <AForm ref="filterFormRef" :model="queryParams" class="dense-filter-form">
            <ARow :gutter="24">
              <ACol :span="24" :lg="8">
                <AFormItem label="菜单名称" prop="name">
                  <AInput v-model:value="queryParams.name" placeholder="请输入菜单名称" />
                </AFormItem>
              </ACol>
              <ACol :span="24" :lg="8">
                <AFormItem label="菜单状态" prop="status">
                  <ASelect v-model:value="queryParams.status" placeholer="请选择菜单状态" />
                </AFormItem>
              </ACol>
              <ACol :span="24" :lg="8">
                <AFlex justify="end" align="center" :gap="16">
                  <AButton @click="onFilterReset">重置</AButton>
                  <AButton type="primary" @click="onFilter">查询</AButton>
                </AFlex>
              </ACol>
            </ARow>
          </AForm>
        </ACard>
      </ACol>

      <ACol :span="24">
        <ACard title="菜单管理" class="mt-4 flex-1">
          <template #extra>
            <AFlex :gap="8">
              <AButton :loading="pending">
                <template #icon>
                  <PlusOutlined />
                </template>
                新增
              </AButton>
              <AButton type="primary" :loading="pending" @click="showDialog('add')">
                <template #icon>
                  <PlusOutlined />
                </template>
                新增
              </AButton>
              <ATooltip title="折叠/展开全部">
                <AButton type="text" :loading="pending">
                  <template #icon>
                    <SwapOutlined :rotate="90" />
                  </template>
                </AButton>
              </ATooltip>
              <ATooltip title="重新载入">
                <AButton type="text" :loading="pending" @click="execute">
                  <template #icon>
                    <ReloadOutlined />
                  </template>
                </AButton>
              </ATooltip>
            </AFlex>
          </template>

          <ATable
            :data-source="data"
            :columns="columns"
            row-key="id"
            :scroll="{ x: 1400 }"
            :loading="pending"
            :sticky="{ offsetHeader: 90 }"
            :pagination="false"
          >
            <template #bodyCell="scope">
              <template v-if="scope?.column.key === 'actions'">
                <AFlex :gap="16">
                  <ATypographyLink @click="showDialog('edit', scope.record.id)"
                    >修改</ATypographyLink
                  >
                  <ATypographyLink @click="showDialog('add', scope.record.id)"
                    >新增</ATypographyLink
                  >
                  <ATypographyLink type="danger">删除</ATypographyLink>
                </AFlex>
              </template>
            </template>
          </ATable>
        </ACard>
      </ACol>
    </ARow>

    <ModalForm v-model:open="visible" v-model:value="formData" :mode="mode" :edit-id="editId" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { SwapOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { useTable, columns } from './use-table'
import ModalForm from './form.vue'
import type { MenuDTO } from '@/api/system/menu'

const filterFormRef = ref()

const formData = ref<MenuDTO>({
  name: '',
  path: '',
  permission: '',
  sort: 0,
  type: 1
})
const visible = ref(false)
// current entry for editing
const editId = ref<number | undefined>()
const mode = ref<'add' | 'edit'>('add')

const showDialog = (action: 'add' | 'edit', id?: number) => {
  editId.value = id
  visible.value = true
  mode.value = action
}

const { data, execute, pending, queryParams, onFilter, onFilterReset } = useTable(filterFormRef)
</script>
