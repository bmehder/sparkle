import { createBead } from '../utils/createBead.js'

export const withNumber = (key = 'count', { start = 0, step = 1 } = {}) =>
  createBead(`number:${key}`, obj => {
    const value = typeof obj[key] === 'number' ? obj[key] : start

    return {
      [key]: value,
      [`increment${capitalize(key)}`]: () => ({
        ...obj,
        [key]: value + step
      }),
      [`decrement${capitalize(key)}`]: () => ({
        ...obj,
        [key]: value - step
      })
    }
  })

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)
