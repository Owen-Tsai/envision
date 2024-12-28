import { theme } from 'ant-design-vue'
import { writeFile } from 'node:fs/promises'
import { kebabCase } from 'lodash-es'
import { fileURLToPath } from 'node:url'

const { darkAlgorithm, defaultAlgorithm, defaultSeed } = theme

const lightTokensMap = defaultAlgorithm(defaultSeed)
const darkTokenMap = darkAlgorithm(defaultSeed)

const blackListKeys = [
  'lineType',
  'sizeUnit',
  'sizePopupArrow',
  'zIndexBase',
  'zIndexPopupBase',
  'opacityImage',
  'wireframe',
  'purple',
  'cyan',
  'magenta',
  'yellow',
  'pink',
  'volcano',
  'lime',
  'blue',
  'red',
  'green',
  'gold',
  'orange',
]

const sizesKeys = ['fontSize', 'borderRadius']

const isInBlackList = (key: string) => {
  return blackListKeys.findIndex((e) => key.includes(e)) === -1
}

const generateStyleString = (map: Record<string, any>) => {
  let str = ''
  Object.keys(map).forEach((key) => {
    if (isInBlackList(key)) {
      str += `--${kebabCase(key)}: ${map[key]}`
      if (sizesKeys.some((sizeKey) => key.includes(sizeKey))) {
        str += 'px'
      }
      str += ';'
    }
  })

  return str
}

const lightThemeStr = `html {${generateStyleString(lightTokensMap)}}`
const darkThemeStr = `html.dark {${generateStyleString(darkTokenMap)}}`
const comment = `/* This file was automatically generated, do not modify directly! */`

await writeFile(
  fileURLToPath(new URL('../src/styles/var.scss', import.meta.url)),
  `${comment}\n${lightThemeStr}\n${darkThemeStr}`,
  'utf-8',
)

console.log('[fusionx/admin] var.scss generated successfully!')
