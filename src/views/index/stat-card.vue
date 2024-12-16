<template>
  <div class="fux-card">
    <div class="inner">
      <div class="fux-card-header">数据资源</div>
      <div class="fux-card-body">
        <div class="grid grid-cols-2 gap-4">
          <div v-for="(item, i) in data" :key="i" class="entry">
            <ECounter :end-val="item.value" class="count">
              <template #suffix>
                <span class="suffix">{{ item.suffix }}</span>
              </template>
            </ECounter>
            <div class="title">{{ item.title }}</div>
          </div>
        </div>
      </div>
    </div>
    <img :src="bgIcon" class="bg-icon" />
  </div>
</template>

<script setup lang="ts">
import bgIcon from '~img/bg-3d.svg'

const data = [
  { title: '数据目录', value: 7, suffix: '个' },
  { title: '数据总量', value: 16, suffix: '条' },
  { title: '信息项', value: 68, suffix: '个' },
  { title: '数据更新率', value: 13, suffix: '次（昨日）' },
]
</script>

<style lang="scss" scoped>
.fux-card {
  background: linear-gradient(-45deg, rgb(35 93 197), rgb(26 55 245));
  border-radius: var(--border-radius);
  color: var(--color-white);
  position: relative;
  overflow: hidden;
  .fux-card-body {
    padding: 24px;
    padding-top: 0;
  }
  .fux-card-header {
    font-weight: 600;
    font-size: 16px;
    padding: 0 24px;
    height: 56px;
    @apply flex items-center;
  }
}

.bg-icon {
  position: absolute;
  bottom: 0;
  right: 0;
  opacity: 0.16;
  height: 140px;
}

.entry {
  .count {
    font-size: 24px;
    font-weight: 600;
    margin-top: 4px;

    .suffix {
      font-size: 12px;
      margin-left: 8px;
    }
  }
}
</style>
