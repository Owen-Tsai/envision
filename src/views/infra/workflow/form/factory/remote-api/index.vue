<template>
  <AModal
    v-model:open="computedOpen"
    title="远程 API"
    :keyboard="false"
    :mask-closable="false"
    :closable="false"
    width="640px"
  >
    <div class="mt-4 flex gap-4">
      <div class="list">
        <EScrollbar wrapper-class="h-full" class="h-full">
          <div
            v-for="(config, fid, i) in schema.remoteAPIs"
            :key="i"
            class="item"
            :class="{ active: activeFid === fid }"
            @click="onItemSelected(fid)"
          >
            {{ config.name }}
          </div>
          <div class="item" @click="addEntry">
            <PlusOutlined />
            新增 API
          </div>
        </EScrollbar>
      </div>
      <div class="form">
        <div v-show="activeFid !== undefined">
          <AFormItem label="API 名称">
            <AInput v-model:value="data.name" />
          </AFormItem>
          <AFormItem label="URL 地址">
            <AInput v-model:value="data.url" placeholder="/example/module/method" />
          </AFormItem>
          <AFormItem label="请求方式">
            <ARadioGroup v-model:value="data.method" :options="['get', 'post', 'put', 'delete']" />
          </AFormItem>
          <AFormItem label="请求参数">
            <Codemirror
              v-model="data.params"
              :tab-size="2"
              :extensions="extensions"
              :style="{ height: '180px', width: '100%' }"
            />
          </AFormItem>
          <div class="actions">
            <AButton danger @click="onItemDelete">删除此 API</AButton>
            <AButton type="primary" @click="onItemSave">保存</AButton>
          </div>
        </div>
        <AEmpty v-show="!schema.remoteAPIs || apiCount <= 0" description="当前没有 API" />
        <AEmpty
          v-show="apiCount > 0 && activeFid === undefined"
          description="选取左侧 API 进行编辑"
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
import { generateID } from '@/utils/envision'
import { injectionKey, type FormCreatorCtx, type APIConfig } from '@/types/workflow'
import extensions from '../../codemirror'

const props = defineProps({
  open: {
    type: Boolean,
    required: true
  }
})

const { schema } = inject<FormCreatorCtx>(injectionKey)!
const apiCount = computed(() => Object.keys(schema.remoteAPIs).length)

const emit = defineEmits(['update:open'])

const activeFid = ref<string>()
const data = reactive<APIConfig>({
  name: '',
  method: 'get',
  params: '',
  url: ''
})

const computedOpen = computed({
  get: () => props.open,
  set: (val) => {
    emit('update:open', val)
  }
})

const addEntry = () => {
  const id = generateID()
  schema.remoteAPIs[id] = {
    method: 'get',
    url: '',
    params: '',
    name: id
  }
  onItemSelected(id)
}

const onItemSelected = (fid: string) => {
  if (fid === activeFid.value) return
  activeFid.value = fid
  data.name = schema.remoteAPIs[fid].name
  data.method = schema.remoteAPIs[fid].method
  data.url = schema.remoteAPIs[fid].url
  data.params = schema.remoteAPIs[fid].params || ''
}

const onItemSave = () => {
  schema.remoteAPIs[activeFid.value!] = {
    name: data.name,
    url: data.url,
    method: data.method,
    params: data.params
  }
  message.success('修改成功')
}

const onItemDelete = () => {
  delete schema.remoteAPIs[activeFid.value as string]
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
