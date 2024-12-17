import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import unoCss from 'unocss/vite'
import autoImport from 'unplugin-auto-import/vite'
import devTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const { VITE_BASE_URL } = loadEnv(mode, process.cwd())

  return {
    base: VITE_BASE_URL,
    plugins: [
      vue(),
      vueJsx(),
      unoCss(),
      autoImport({
        imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
      }),
      devTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '~img': fileURLToPath(new URL('./src/assets/img', import.meta.url)),
        '~vis': fileURLToPath(new URL('./src/assets/vis', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
    server: {
      port: 1127,
      host: true,
    },
  }
})
