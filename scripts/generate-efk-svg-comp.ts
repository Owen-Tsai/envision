import fs from 'fs'
import { fileURLToPath } from 'url'

const svgDir = fileURLToPath(new URL('../src/assets/img/form-kit', import.meta.url))
const outputDir = fileURLToPath(new URL('../src/components/efk-icons', import.meta.url))

const svgFiles = fs.readdirSync(svgDir)

const template = `<template>$$</template>`

svgFiles.forEach((file) => {
  const name = file.split('.svg')[0]
  const raw = fs.readFileSync(`${svgDir}/${file}`, { encoding: 'utf-8' })
  fs.writeFileSync(`${outputDir}/${name}.vue`, template.replace('$$', raw), { encoding: 'utf-8' })
})
