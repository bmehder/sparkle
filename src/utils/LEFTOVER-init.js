import { bedazzle } from './bedazzle.js'
export const init = (seed, ...beads) => ({ value: bedazzle(seed, ...beads) })
