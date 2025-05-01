import { createBead } from '../utils/createBead.js'

export const withFlag = (key = 'flag') =>
  createBead(`flag:${key}`, obj => {
    const value = obj[key] ?? false

    return {
      [key]: value,
      [`toggle${capitalize(key)}`]: () => ({
        ...obj,
        [key]: !value
      })
    }
  })

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)
