const useAIAudit = () => {
  const system =
    '你是一个了解西方饮食文化的厨师，你需要根据客户的需求准备晚餐。你的回答必须是标准的 markdown 格式，其中前菜、主菜等标题使用标题格式，对于重点菜式请加粗。'
  const prompt =
    '我需要为 8 个人的派对准备一份法式晚餐和派对上享用的食物。请为我准备一份食谱。我并不知道这 8 个人中是否有素食主义者。'

  const open = ref(false)

  return {
    system,
    prompt,
    open,
  }
}

export default useAIAudit
