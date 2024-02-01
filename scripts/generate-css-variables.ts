import { theme } from 'ant-design-vue'
import type { MapToken } from 'ant-design-vue/es/theme/interface'
import fs from 'fs'
import { fileURLToPath } from 'node:url'

const { darkAlgorithm, defaultAlgorithm, defaultSeed } = theme

const lightTokensMap = defaultAlgorithm(defaultSeed)
const darkTokenMap = darkAlgorithm(defaultSeed)

const blackListKeys = [
  'lineWidth',
  'lineType',
  'sizeUnit',
  'sizeStep',
  'sizePopupArrow',
  'controlHeight',
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
  'orange'
]

const sizesKeys = ['fontSize', 'borderRadius']

const isInBlackList = (key: string) => {
  return blackListKeys.findIndex((e) => key.includes(e))
}

const generateStyleString = (map: MapToken) => {
  let str = ''
  Object.keys(map).forEach((key) => {
    if (isInBlackList(key) === -1) {
      str += `--${key}: ${(map as any)[key]}`
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

fs.writeFileSync(
  fileURLToPath(new URL('../src/styles/var.scss', import.meta.url)),
  `${comment}\n${lightThemeStr}\n${darkThemeStr}`,
  'utf-8'
)
