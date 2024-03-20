<template>
  <div class="view">
    <ARow :gutter="24">
      <ACol :span="24">
        <ACard>
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
        <ACard title="菜单管理" class="mt-4 flex-1">
          <template #extra>
            <AFlex :gap="8">
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
                  <ATypographyLink @click="showDialog('edit', scope.record.id)">
                    <EditOutlined />
                    修改
                  </ATypographyLink>
                  <ATypographyLink @click="showDialog('add', scope.record.id)">
                    <PlusOutlined />
                    新增
                  </ATypographyLink>
                  <APopconfirm
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
      v-model:open="visible"
      v-model:value="formData"
      :mode="mode"
      :id="entryId"
      :tree-data="data"
      @success="execute"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import {
  SwapOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue'
import useDict from '@/hooks/use-dict'
import { menuTypes } from '@/utils/constants'
import { useTable, columns } from './use-table'
import ModalForm from './form.vue'
import { deleteMenuWithChildren, type MenuVO } from '@/api/system/menu'

const filterFormRef = ref()

const { commonStatus } = useDict('common_status')

const formData = ref<MenuVO>({
  alwaysShow: false,
  visible: true,
  status: 0,
  keepAlive: true,
  type: 1
})
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

const { data, execute, pending, queryParams, onFilter, onFilterReset } = useTable(filterFormRef)

defineOptions({ name: 'SystemMenu' })
</script>
