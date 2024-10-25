import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { format } from 'prettier'
import * as icons from '@ant-design/icons-vue'

const placeholder = '$$'
const blackList = [
  '__esModule',
  'default',
  'createFromIconfontCN',
  'getTwoToneColor',
  'setTwoToneColor'
]

const targetFile = fileURLToPath(new URL('../src/types/global.d.ts', import.meta.url))

let str = ''

Object.keys(icons).forEach((key) => {
  if (blackList.includes(key)) return
  str += '\n' + `  ${key}: typeof import('@ant-design/icons-vue')['${key}']`
})

const original = readFileSync(targetFile, { encoding: 'utf-8' })

format(original.replace(placeholder, str), {
  parser: 'typescript',
  semi: false,
  tabWidth: 2,
  singleQuote: true,
  printWidth: 100,
  trailingComma: 'none',
  htmlWhitespaceSensitivity: 'ignore'
}).then((content) => {
  writeFileSync(targetFile, content, 'utf-8')
})
