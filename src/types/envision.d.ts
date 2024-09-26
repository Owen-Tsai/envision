export {}

declare module 'vue' {
  export interface GlobalComponents {
    EScrollbar: typeof import('custom-vue-scrollbar').default
    EDictTag: typeof import('@/components/dict-tag/index.vue').default
    EUpload: typeof import('@/components/upload/index.vue').default
    ECounter: typeof import('vue-countup-v3').default
  }
}
