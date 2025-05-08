<template>
  <AModal v-model:open="open" title="AI 审核设置" :width="1000">
    <div class="mt-4">
      <ATimeline class="mt-8">
        <ATimelineItem>
          <div>
            读取并处理用户提交的数据和材料
            <ATag class="font-mono ml-2" color="blue">&lt;query&gt;</ATag>
          </div>
        </ATimelineItem>
        <ATimelineItem>
          <div>
            检索应用关联的政策实施细则
            <ATag class="font-mono ml-2" color="purple">&lt;knowledge&gt;</ATag>
          </div>
          <div class="file box flex w-300px p-4 mt-2 gap-4">
            <FileWordOutlined class="text-10 icon" />
            <div>
              <div>政策实施细则（测试）.docx</div>
              <div class="text-muted">2025.03.03</div>
            </div>
          </div>
        </ATimelineItem>
        <ATimelineItem>
          <div>智能体角色设定</div>
          <div class="box mt-2 p-4 max-h-400px overflow-y-auto">
            <ATypographyParagraph>
              你是一名电子政务业务办理助手，负责审核人才和企业提交的政策兑现申请。你需要根据你所获得的
              <ATooltip title="从知识库检索得到的政策实施细则">
                <ATag class="font-mono cursor-default" color="purple">&lt;knowledge&gt;</ATag>
              </ATooltip>
              来审核
              <ATooltip title="用户提交的申请表数据和申请材料">
                <ATag class="font-mono cursor-default" color="blue">&lt;query&gt;</ATag>
              </ATooltip>
              。
            </ATypographyParagraph>
            <ATypographyParagraph
              >在审核申请材料时，着重检查材料完整性、准确性和合规性。在材料完整性方面，检查审核申报表中存在内在逻辑关系的字段组合，深入理解其逻辑关联，严格检查是否按逻辑要求完整填写且不应当存在无意义的、随意填写的文字；在内容准确性方面，针对在同一申报中重复出现的字段，注意核查其一致性。对于一些
              <ATooltip title="从知识库检索得到的政策实施细则">
                <ATag class="font-mono cursor-default" color="purple">&lt;knowledge&gt;</ATag>
              </ATooltip>
              中没有明确要求的字段，检查其是否符合常理和客观规律；对于合规性检查，需要深入理解
              <ATooltip title="从知识库检索得到的政策实施细则">
                <ATag class="font-mono cursor-default" color="purple">&lt;knowledge&gt;</ATag>
              </ATooltip>
              中的要求，与
              <ATooltip title="用户提交的申请表数据和申请材料">
                <ATag class="font-mono cursor-default" color="blue">&lt;query&gt;</ATag>
              </ATooltip>
              交叉比对，检查政策符合度。</ATypographyParagraph
            >
            <ATypographyParagraph>
              最后，提供一份审核报告，应当包含结论和政策符合度评分。针对每个发现的问题，结合你获取的
              <ATooltip title="从知识库检索得到的政策实施细则">
                <ATag class="font-mono cursor-default" color="purple">&lt;knowledge&gt;</ATag>
              </ATooltip>
              ，提供具体的改进建议和指导。例如，对于材料不完整的情况，明确告知需要补充哪些具体材料。使用
              markdown 格式返回报告。</ATypographyParagraph
            >
          </div>
        </ATimelineItem>
        <ATimelineItem>
          <div>流式传输审核报告</div>
        </ATimelineItem>
      </ATimeline>
    </div>
  </AModal>
</template>

<script setup lang="ts">
const open = defineModel('open', {
  default: false,
})
</script>

<style lang="scss" scoped>
.box {
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
}
.icon {
  color: var(--color-primary);
}
</style>
