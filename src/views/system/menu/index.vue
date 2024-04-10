<template>
  <div class="view">
    <ARow :gutter="24">
      <ACol :span="24">
        <ACard v-if="permission.has('system:menu:query')" class="mb-4">
          <AForm ref="filterFormRef" :model="queryParams" class="dense-filter-form">
            <ARow :gutter="24">
              <ACol :span="24" :lg="8">
                <AFormItem label="菜单名称" name="name">
                  <AInput v-model:value="queryParams.name" placeholder="请输入菜单名称" />
                </AFormItem>
              </ACol>
              <ACol :span="24" :lg="8">
                <AFormItem label="菜单状态" name="status">
                  <ASelect
                    v-model:value="queryParams.status"
                    :options="commonStatus"
                    placeholer="请选择菜单状态"
                  />
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
        <ACard title="菜单管理" class="flex-1">
          <template #extra>
            <AFlex :gap="8">
              <AButton
                v-if="permission.has('system:menu:create')"
                type="primary"
                :loading="pending"
                @click="showDialog('add')"
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
              <ATooltip title="刷新菜单缓存">
                <AButton type="text" :loading="pending" @click="clearMenuCache">
                  <template #icon>
                    <RetweetOutlined />
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
              <template v-if="scope?.column.key === 'type'">
                <ATag color="processing">
                  {{ menuTypes.find((e) => e.value === scope.record.type)?.label }}
                </ATag>
              </template>
              <template v-if="scope?.column.key === 'status'">
                <EDictTag :dict-object="commonStatus" :value="scope.record.status" />
              </template>
              <template v-if="scope?.column.key === 'actions'">
                <AFlex :gap="16">
                  <ATypographyLink
                    v-if="permission.has('system:menu:update')"
                    @click="showDialog('edit', scope.record.id)"
                  >
                    <EditOutlined />
                    修改
                  </ATypographyLink>
                  <ATypographyLink
                    v-if="permission.has('system:menu:create')"
                    @click="showDialog('add', scope.record.id)"
                  >
                    <PlusOutlined />
                    新增
                  </ATypographyLink>
                  <APopconfirm
                    v-if="permission.has('system:menu:delete')"
                    title="删除该菜单项将一并删除该菜单下的所有子菜单，确定要删除吗？"
                    :overlay-inner-style="{ width: '260px' }"
                    @confirm="onDelete(scope.record.id)"
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
        </ACard>
      </ACol>
    </ARow>

    <ModalForm
      v-if="visible"
      :mode="mode"
      :id="entryId"
      :tree-data="data"
      @success="execute"
      @close="visible = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import {
  ReloadOutlined,
  RetweetOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue'
import useDict from '@/hooks/use-dict'
import { permission } from '@/hooks/use-permission'
import useStorage from '@/hooks/use-storage'
import { menuTypes } from '@/utils/constants'
import { deleteMenuWithChildren } from '@/api/system/menu'
import { useTable, columns } from './use-table'
import ModalForm from './form.vue'

const filterFormRef = ref()

const storage = useStorage('sessionStorage')

const { commonStatus } = useDict('common_status')

const visible = ref(false)
// current entry for editing
const entryId = ref<number | undefined>()
const mode = ref<'add' | 'edit'>('add')

const showDialog = (action: 'add' | 'edit', id?: number) => {
  entryId.value = id
  visible.value = true
  mode.value = action
}

const onDelete = async (id: number) => {
  await deleteMenuWithChildren(id)
  message.success('删除成功')
  execute()
}

const clearMenuCache = () => {
  storage.delete('permission-info')
  window.location.reload()
}

const { data, execute, pending, queryParams, onFilter, onFilterReset } = useTable(filterFormRef)

defineOptions({ name: 'SystemMenu' })
</script>
