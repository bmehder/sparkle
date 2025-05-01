export const withCounter = obj => {
  const count = obj.count ?? 0
  return {
    count,
    increment: () => ({ ...obj, count: count + 1 }),
    decrement: () => ({ ...obj, count: count - 1 })
  }
}
