
import { bedazzle } from './bedazzle.js'

export const createDecorator = (...beads) => obj => bedazzle(obj, ...beads)
