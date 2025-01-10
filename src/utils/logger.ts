const prefix = [
  `%cFusionX`,
  'background-color: #409eff; color: #fff; padding: 2px 7px; border-radius: 20px; font-weight: bold;',
]

const logger = {
  error: (...args: any[]) => {
    const DEV = import.meta.env.DEV
    if (DEV) {
      console.error(...prefix, ...args)
    }
  },
  warn: (...args: any[]) => {
    const DEV = import.meta.env.DEV
    if (DEV) {
      console.warn(...prefix, ...args)
    }
  },
}

export default logger
