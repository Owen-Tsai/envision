<template>
  <AModal
    v-model:open="isOpen"
    title="函数"
    :width="680"
    :keyboard="false"
    :mask-closable="false"
    :closable="false"
  >
    <div class="mt-4 flex gap-4">
      <div class="list">
        <Scrollbar wrapper-class="h-full" class="h-full">
          <div
            v-for="(config, fid, i) in schema.form.function"
            :key="i"
            class="item"
            :class="{ active: activeFid === fid }"
            @click="onItemSelected(fid)"
          >
            {{ config.name }}
          </div>
          <div class="item" @click="addFunc">
            <PlusOutlined />
            新增函数
          </div>
        </Scrollbar>
      </div>
      <div class="form">
        <div v-show="activeFid !== undefined">
          <AFormItem label="函数名称" name="name">
            <AInput v-model:value="data.name" />
          </AFormItem>
          <AFormItem name="body">
            <Codemirror
              v-model="data.body"
              :tab-size="2"
              :extensions="extensions"
              :style="{ height: '240px', width: '100%' }"
            />
          </AFormItem>
          <div class="actions">
            <AButton danger @click="onItemDelete">删除此函数</AButton>
            <AButton type="primary" @click="onItemSave">保存</AButton>
          </div>
        </div>
        <AEmpty v-show="!schema.form.function || functionsCount <= 0" description="当前没有函数" />
        <AEmpty
          v-show="functionsCount > 0 && activeFid === undefined"
          description="选取左侧函数进行编辑"
        />
      </div>
    </div>

    <template #footer>
      <AButton @click="isOpen = false">关闭</AButton>
    </template>
  </AModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, inject } from 'vue'
import { message, type FormProps } from 'ant-design-vue'
import { Codemirror } from 'vue-codemirror'
import { generateId } from '@fusionx/utils'
import { useDesignerInjection } from '../../_hooks'
import extensions from '@/utils/codemirror'

const { open } = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', open: boolean): void
}>()

const isOpen = computed({
  get() {
    return open
  },
  set(val) {
    emit('update:open', val)
  }
})

const { schema } = useDesignerInjection()
const functionsCount = computed(() => Object.keys(schema.value.form.function || {}).length)

const activeFid = ref<string>()
const data = reactive({
  name: '',
  body: ''
})

const addFunc = () => {
  const id = generateId()
  data.name = id
  data.body = ''
  if (schema.value.form.function === undefined) {
    schema.value.form.function = {}
  }
  schema.value.form.function[id] = {
    name: data.name,
    body: data.body
  }
  onItemSelected(id)
}

const onItemSelected = (fid: string) => {
  if (fid === activeFid.value) return
  activeFid.value = fid
  data.name = schema.value.form.function![fid].name
  data.body = schema.value.form.function![fid].body || ''
}

const onItemSave = () => {
  if (schema.value.form.function === undefined) {
    schema.value.form.function = {}
  }
  schema.value.form.function[activeFid.value!] = {
    name: data.name,
    body: data.body
  }
  message.success('修改成功')
}

const onItemDelete = () => {
  if (schema.value.form.function?.[activeFid.value!]) {
    delete schema.value.form.function?.[activeFid.value!]
    activeFid.value = undefined
  }
}
</script>

<style lang="scss" scoped>
.list {
  width: 120px;
  flex-shrink: 0;
  max-height: 360px;

  .item {
    border: 1px solid var(--colorBorder);
    padding: 4px 0;
    border-radius: var(--borderRadius);
    cursor: pointer;
    @apply flex-center gap-1 mb-2;

    &.active {
      border-color: var(--colorPrimaryBorder);
      background-color: var(--colorPrimaryBg);
      color: var(--colorPrimary);
    }
  }
}
.form {
  flex-grow: 1;
}
.actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 16px;
  gap: 8px;
  border-radius: var(--borderRadius);
}
</style>
