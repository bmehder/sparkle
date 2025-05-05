export const withLogger = obj => ({
  log: () => {
    console.log('🔎 State:', obj)
    return obj
  }
})
