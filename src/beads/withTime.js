export const withTime = obj => {
  const seconds = obj.seconds ?? 0
  return {
    seconds,
    tick: () => ({ ...obj, seconds: seconds + 1 }),
  }
}
