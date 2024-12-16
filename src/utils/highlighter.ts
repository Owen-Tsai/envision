import {
  createHighlighter,
  type HighlighterGeneric,
  type BundledLanguage,
  type BundledTheme,
} from 'shiki'

const highlighter: HighlighterGeneric<BundledLanguage, BundledTheme> = await createHighlighter({
  themes: ['vitesse-light', 'vitesse-dark'],
  langs: ['json', 'js', 'vue', 'ts', 'tsx', 'jsx', 'sql', 'xml', 'java', 'txt'],
})

export default highlighter
