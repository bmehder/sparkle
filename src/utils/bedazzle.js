export const bedazzle = (state, ...fns) =>
  fns.reduce(
    (obj, fn) => ({ ...obj, ...fn(obj, newState => bedazzle(newState, ...fns)) }),
    state
  )
