import {
  createHighlighter,
  type HighlighterGeneric,
  type BundledLanguage,
  type BundledTheme
} from 'shiki'

const highlighter: HighlighterGeneric<BundledLanguage, BundledTheme> = await createHighlighter({
  themes: ['min-light'],
  langs: ['json', 'js']
})

export default highlighter
