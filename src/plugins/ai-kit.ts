import { aiKit } from '@fusionx/ai-kit'

import type { App } from 'vue'

export default (app: App) => {
  app.use(aiKit, {
    apiKey: import.meta.env.VITE_AI_KIT_API_KEY,
  })
}
