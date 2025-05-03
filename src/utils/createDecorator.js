import { bedazzle } from './bedazzle.js'

/**
 * 💎 createDecorator
 *
 * Bundles one or more bead functions into a single decorator function.
 * When called with an object, it runs the object through all beads using `bedazzle`,
 * producing a fully composed, behavior-rich version of the object.
 *
 * @param {...function} beads - Bead functions created with `createBead`
 * @returns {function} - A decorator: obj => decoratedObj
 */
export const createDecorator =
	(...beads) =>
	obj =>
		bedazzle(obj, ...beads)
