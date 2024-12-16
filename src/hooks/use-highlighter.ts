import highlighter from '@/utils/highlighter'
import useAppStore from '@/stores/app'
import type { BundledLanguage } from 'shiki'

const useHighlighter = (code: string, lang: BundledLanguage): string => {
  const { theme } = useAppStore()

  const ret = highlighter.codeToHtml(code, {
    lang,
    theme: theme === 'dark' ? 'vitesse-dark' : 'vitesse-light',
  })

  return ret
}

export default useHighlighter
