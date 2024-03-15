<template>
  <AModal
    v-model:open="computedOpen"
    :title="isAdd ? '新增菜单' : '编辑菜单'"
    @cancel="computedOpen = false"
  >
    <AForm ref="formRef" :model="formData">
      <AFormItem label="上级菜单" prop="parentId">
        <ATreeSelect
          v-model:value="formData.parentId"
          show-search
          :dropdown-style="{ maxHeight: '300px', overflow: 'auto' }"
          tree-default-expand-all
          :tree-data="treeData"
        />
      </AFormItem>
      <AFormItem label="菜单名称" prop="name">
        <AInput v-model:value="formData.name" placeholder="请输入菜单名称" />
      </AFormItem>
      <AFormItem label="菜单类型" prop="type">
        <ARadioGroup v-model:value="formData.type" :options="menuTypes" />
      </AFormItem>
      <AFormItem label="菜单图标" prop="icon">
        <IconSelect v-model:value="formData.icon" placeholer="请选择菜单图标" />
      </AFormItem>
    </AForm>
  </AModal>
</template>

<script lang="ts" setup>
import { ref, computed, watch, type PropType } from 'vue'
import IconSelect from '@/components/icon-select/index.vue'
import type { FormInstance, TreeSelectProps } from 'ant-design-vue'
import { getMenuDetail, type MenuDTO } from '@/api/system/menu'

const menuTypes = [
  { label: '菜单', value: 1 },
  { label: '目录', value: 2 },
  { label: '操作', value: 3 }
]

const loading = ref(false)

const props = defineProps({
  open: {
    type: Boolean,
    required: true
  },
  mode: {
    type: String as PropType<'add' | 'edit'>,
    default: 'add'
  },
  value: {
    type: Object as PropType<MenuDTO>,
    required: true
  },
  treeData: {
    type: Object as PropType<TreeSelectProps['treeData']>
  },
  editId: {
    type: Number,
    default: undefined
  }
})

const emit = defineEmits(['update:open', 'update:value'])

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

const isAdd = computed(() => props.mode === 'add')

const formRef = ref<FormInstance>()

watch([() => props.editId, () => props.mode], ([newId, newMode]) => {
  loading.value = true
  if (newMode === 'edit') {
    if (newId) {
      getMenuDetail(newId).then((data) => {
        formData.value = data
        loading.value = false
      })
    }
  } else {
    if (newId) {
      formData.value.parentId = newId
    }
  }
})
</script>
