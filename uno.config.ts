import { defineConfig, presetMini } from 'unocss'
import directives from '@unocss/transformer-directives'

export default defineConfig({
  presets: [presetMini()],
  transformers: [directives()],
  theme: {
    colors: {}
  },
  rules: [
    [/^size-(\d+)px/, ([, d]) => ({ height: `${d}px`, width: `${d}px` })],
    [/^size-(\d+)%/, ([, d]) => ({ height: `${d}%`, width: `${d}%` })]
  ],
  shortcuts: [
    {
      's-full': 'w-full h-full',
      'flex-center': 'flex items-center justify-center',
      'flex-center-v': 'flex flex-col items-center justify-center',
      'flex-between': 'flex items-center justify-between'
    }
  ]
})
