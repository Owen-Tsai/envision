<template>
  <AModal
    v-model:open="computedOpen"
    title="函数"
    :keyboard="false"
    :mask-closable="false"
    :closable="false"
    width="640px"
  >
    <div class="mt-4 flex gap-4">
      <div class="list">
        <EScrollbar wrapper-class="h-full" class="h-full">
          <div
            v-for="(config, fid, i) in schema.functions"
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
        </EScrollbar>
      </div>
      <div class="form">
        <div v-show="activeFid !== undefined">
          <AFormItem label="函数名称">
            <AInput v-model:value="data.name" />
          </AFormItem>
          <Codemirror
            v-model="data.body"
            :tab-size="2"
            :extensions="extensions"
            :style="{ height: '240px', width: '100%' }"
          />
          <div class="actions">
            <AButton danger @click="onItemDelete">删除此函数</AButton>
            <AButton type="primary" @click="onItemSave">保存</AButton>
          </div>
        </div>
        <AEmpty v-show="!schema.functions || functionsCount <= 0" description="当前没有函数" />
        <AEmpty
          v-show="functionsCount > 0 && activeFid === undefined"
          description="选取左侧函数进行编辑"
        />
      </div>
    </div>

    <template #footer>
      <AButton @click="computedOpen = false">关闭</AButton>
    </template>
  </AModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, inject } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { Codemirror } from 'vue-codemirror'
import { generateID } from '@/utils/fusion'
import { injectionKey, type FormCreatorCtx } from '@/types/workflow'
import extensions from '../../codemirror'

const props = defineProps({
  open: {
    type: Boolean,
    required: true
  }
})

const { schema } = inject<FormCreatorCtx>(injectionKey)!
const functionsCount = computed(() => Object.keys(schema.functions).length)

const emit = defineEmits(['update:open'])

const activeFid = ref<string>()
const data = reactive({
  name: '',
  body: ''
})

const computedOpen = computed({
  get: () => props.open,
  set: (val) => {
    emit('update:open', val)
  }
})

const addFunc = () => {
  const id = generateID()
  data.name = id
  data.body = ''
  schema.functions[id] = {
    name: data.name,
    body: data.body
  }
  onItemSelected(id)
}

const onItemSelected = (fid: string) => {
  if (fid === activeFid.value) return
  activeFid.value = fid
  data.name = schema.functions[fid].name
  data.body = schema.functions[fid].body || ''
}

const onItemSave = () => {
  schema.functions[activeFid.value!] = {
    name: data.name,
    body: data.body
  }
  message.success('修改成功')
}

const onItemDelete = () => {
  delete schema.functions[activeFid.value as string]
  activeFid.value = undefined
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
