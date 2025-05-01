export const createBead = (name, fn) => (obj, redecorate) => {
  const result = fn(obj, redecorate)
  const collisions = Object.keys(result).filter(k => k in obj)
  if (collisions.length) {
    console.warn(`[${name}] overlaps keys:`, collisions)
  }
  return result
}
