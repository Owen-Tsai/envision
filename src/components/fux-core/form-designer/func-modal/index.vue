<template>
  <AModal v-model:open="isOpen" title="函数" :width="700" :keyboard="false" :mask-closable="false">
    <div class="mt-4 flex gap-4">
      <div class="list">
        <Scrollbar wrapper-class="h-full" class="h-full">
          <div
            v-for="(config, fid, i) in appSchema.form.function"
            :key="i"
            class="item"
            :class="{ active: activeFid === fid }"
            @click="onItemSelected(fid)"
          >
            <ATypographyText :content="config.name" class="text px-4" ellipsis />
          </div>
          <AButton type="dashed" block :icon="h(PlusOutlined)" @click="addFunc">新增函数</AButton>
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
            <template #extra>
              <ATypographyParagraph type="secondary" class="pt-1">
                可以在函数体内通过
                <ATypographyText code>$func</ATypographyText>,
                <ATypographyText code>$values</ATypographyText>,
                <ATypographyText code>$schema</ATypographyText>
                属性分别访问渲染器实例方法、表单数据和应用 Schema。详情请<a href="#">参见文档</a>
              </ATypographyParagraph>
            </template>
          </AFormItem>
          <div class="actions">
            <AButton danger @click="onItemDelete">删除此函数</AButton>
            <ADropdownButton class="ml-4" type="primary" @click="onItemSave">
              保存
              <template #overlay>
                <AMenu :items="menuItems" @click="onMenuItemClick" />
              </template>
            </ADropdownButton>
          </div>
        </div>
        <AEmpty
          v-show="!appSchema.form.function || functionsCount <= 0"
          description="当前没有函数"
        />
        <AEmpty
          v-show="functionsCount > 0 && activeFid === undefined"
          description="选取左侧函数进行编辑"
        />
      </div>
    </div>

    <template #footer>
      <AButton
        v-if="
          !appSchema.form.function || Object.keys(appSchema.form.function).length <= 0 || !activeFid
        "
        type="primary"
        @click="isOpen = false"
        >关闭</AButton
      >
    </template>
  </AModal>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { message, type MenuProps } from 'ant-design-vue'
import { Codemirror } from 'vue-codemirror'
import { generateId } from '@fusionx/utils'
import { useDesignerInjection } from '../../_hooks'
import extensions from '@/utils/codemirror'
import useModalOpen from '@/hooks/use-modal'

const menuItems = [{ label: '保存并关闭', key: 'saveAndClose' }]

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', open: boolean): void
}>()

const isOpen = useModalOpen(props, emit)

const { appSchema } = useDesignerInjection()!
const functionsCount = computed(() => Object.keys(appSchema.value.form.function || {}).length)

const activeFid = ref<string>()
const data = reactive({
  name: '',
  body: '',
})

const addFunc = () => {
  const id = generateId()
  data.name = id
  data.body = ''
  if (appSchema.value.form.function === undefined) {
    appSchema.value.form.function = {}
  }
  appSchema.value.form.function[id] = {
    name: data.name,
    body: data.body,
  }
  onItemSelected(id)
}

const onItemSelected = (fid: string) => {
  if (fid === activeFid.value) return
  activeFid.value = fid
  data.name = appSchema.value.form.function![fid].name
  data.body = appSchema.value.form.function![fid].body || ''
}

const onItemSave = () => {
  if (appSchema.value.form.function === undefined) {
    appSchema.value.form.function = {}
  }
  appSchema.value.form.function[activeFid.value!] = {
    name: data.name,
    body: data.body,
  }
  message.success('修改成功')
}

const onItemDelete = () => {
  if (appSchema.value.form.function?.[activeFid.value!]) {
    delete appSchema.value.form.function?.[activeFid.value!]
    activeFid.value = undefined
    message.success('删除成功')
  }
}

const onMenuItemClick: MenuProps['onClick'] = async ({ key }) => {
  if (key === 'saveAndClose') {
    onItemSave()
    isOpen.value = false
  }
}
</script>

<style lang="scss" scoped>
.list {
  width: 160px;
  flex-shrink: 0;
  max-height: 360px;

  .item {
    border: 1px solid var(--color-border);
    padding: 4px 0;
    border-radius: var(--border-radius);
    cursor: pointer;
    @apply flex-center gap-1 mb-2;

    &:hover {
      border-color: var(--color-primary);
      .text {
        color: var(--color-primary);
      }
    }
    &.active {
      border-color: var(--color-primary);
      .text {
        color: var(--color-primary);
      }
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
  border-radius: var(--border-radius);
}
</style>
