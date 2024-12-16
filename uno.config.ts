import { defineConfig, presetMini, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [presetMini()],
  transformers: [transformerDirectives()],
  theme: {
    colors: {},
    breakpoints: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      xxl: '1600px',
    },
  },
  rules: [
    [/^size-(\d+)px/, ([, d]) => ({ height: `${d}px`, width: `${d}px` })],
    [/^size-(\d+)%/, ([, d]) => ({ height: `${d}%`, width: `${d}%` })],
    [/^text-muted/, () => ({ color: 'var(--color-text-tertiary)' })],
    [
      /^radius-b/,
      () => ({
        'border-bottom-left-radius': 'var(--border-radius)',
        'border-bottom-right-radius': 'var(--border-radius)',
      }),
    ],
    [
      /^radius-t/,
      () => ({
        'border-top-left-radius': 'var(--border-radius)',
        'border-top-right-radius': 'var(--border-radius)',
      }),
    ],
  ],
  shortcuts: [
    {
      's-full': 'w-full h-full',
      'flex-center': 'flex items-center justify-center',
      'flex-center-v': 'flex flex-col items-center justify-center',
      'flex-between': 'flex items-center justify-between',
    },
  ],
})
