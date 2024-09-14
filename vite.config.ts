import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import unoCss from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const { VITE_BASE_URL } = loadEnv(mode, process.cwd())

  return {
    base: VITE_BASE_URL,
    plugins: [vue(), vueJsx(), unoCss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '~img': fileURLToPath(new URL('./src/assets/img', import.meta.url))
      }
    },
    server: {
      port: 1127,
      host: true
    }
  }
})
