export const composeUpdates = (...fns) => obj =>
  fns.reduce((acc, fn) => fn(acc), obj)
