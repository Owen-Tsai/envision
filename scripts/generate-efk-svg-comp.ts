import fs from 'fs'
import { fileURLToPath } from 'url'
import { format } from 'prettier'

const svgDir = fileURLToPath(new URL('../src/assets/img/form-kit', import.meta.url))
const outputDir = fileURLToPath(new URL('../src/components/efk-icons', import.meta.url))

const svgFiles = fs.readdirSync(svgDir)

const template = `<template>$$</template>`

svgFiles.forEach((file) => {
  const name = file.split('.svg')[0]
  const raw = fs.readFileSync(`${svgDir}/${file}`, 'utf-8')
  format(template.replace('$$', raw), {
    parser: 'vue',
    semi: false,
    tabWidth: 2,
    singleQuote: true,
    printWidth: 100,
    trailingComma: 'none',
    endOfLine: 'crlf',
    htmlWhitespaceSensitivity: 'ignore'
  }).then((content) => {
    fs.writeFileSync(`${outputDir}/${name}.vue`, content, 'utf-8')
  })
})
