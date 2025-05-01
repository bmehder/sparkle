export const createUpdater = (ref, decorate, render) => fn => {
  ref.value = decorate(fn(ref.value))
  ref.value.log?.()
  render(ref.value)
}
