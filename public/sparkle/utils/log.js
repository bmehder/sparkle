import { DEBUG } from '../config/debug.js'

export const log = (...args) => DEBUG && console.log(...args)
export const warn = (...args) => DEBUG && console.warn(...args)
export const group = (...args) => DEBUG && console.group(...args)
export const groupEnd = () => DEBUG && console.groupEnd()
export const groupCollapsed = (...args) => DEBUG && console.groupCollapsed(...args)
