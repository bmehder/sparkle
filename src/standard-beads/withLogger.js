import { createBead } from '../utils/createBead.js'

export const withLogger = (label = 'log') =>
  createBead(`logger:${label}`, obj => ({
    [label]: () => {
      console.group(`[${label}]`)
      console.dir(obj)
      console.groupEnd()
      return obj
    }
  }))
