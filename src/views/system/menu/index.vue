<template>
  <div class="view">
    <ARow :gutter="24">
      <ACol :span="24">
        <ACard v-if="permission.has('system:menu:query')" class="mb-4">
          <AForm ref="filterFormRef" :model="queryParams" class="dense-form">
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
                    placeholder="请选择菜单状态"
                  />
                </AFormItem>
              </ACol>
              <ACol :span="24" :lg="8">
                <AFlex justify="end" align="center" :gap="16">
                  <AButton html-type="reset" @click="onFilterReset">重置</AButton>
                  <AButton html-type="submit" type="primary" @click="onFilter">查询</AButton>
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
                @click="onEdit('add')"
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
                <AButton type="text" :loading="pending" @click="onClearCache">
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
            <template #bodyCell="scope: TableScope<MenuVO>">
              <template v-if="scope?.column.key === 'type'">
                <ATag color="processing">
                  {{ menuTypes.find((e) => e.value === scope.record.type)?.label }}
                </ATag>
              </template>
              <template v-if="scope?.column.key === 'status'">
                <EDictTag :dict-object="commonStatus" :value="scope.text" />
              </template>
              <template v-if="scope?.column.key === 'actions'">
                <AFlex :gap="16">
                  <ATypographyLink
                    v-if="permission.has('system:menu:update')"
                    @click="onEdit('edit', scope.record)"
                  >
                    <EditOutlined />
                    修改
                  </ATypographyLink>
                  <ATypographyLink
                    v-if="permission.has('system:menu:create')"
                    @click="onEdit('add', scope.record)"
                  >
                    <PlusOutlined />
                    新增
                  </ATypographyLink>
                  <APopconfirm
                    v-if="permission.has('system:menu:delete')"
                    title="删除该菜单项将一并删除该菜单下的所有子菜单，确定要删除吗？"
                    :overlay-inner-style="{ width: '260px' }"
                    @confirm="onDelete(scope.record!)"
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

    <FormModal
      v-if="visible"
      :mode="mode"
      :record="entry"
      :tree-data="data"
      @success="execute"
      @close="visible = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  ReloadOutlined,
  RetweetOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue'
import useDict from '@/hooks/use-dict'
import { permission } from '@/hooks/use-permission'
import { menuTypes } from '@/utils/constants'
import type { MenuVO } from '@/api/system/menu'
import { useTable, columns } from './use-table'
import useActions from './use-actions'
import FormModal from './form.vue'

const filterFormRef = ref()

const [commonStatus] = useDict('common_status')

const { data, execute, pending, queryParams, onFilter, onFilterReset } = useTable(filterFormRef)

const { entry, mode, visible, onClearCache, onDelete, onEdit } = useActions(execute)

defineOptions({ name: 'SystemMenu' })
</script>
