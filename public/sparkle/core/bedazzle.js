/**
 * ✨ bedazzle
 *
 * Applies a sequence of bead functions to a state object, layering behavior and structure.
 * Each bead receives the current object and a redecorate helper for dynamic re-decoration.
 *
 * @param {object} state - The starting state (usually the seed)
 * @param {...function} fns - A list of bead functions to apply
 * @returns {object} - The fully decorated object with all bead contributions merged in
 */
export const bedazzle = (state, ...fns) =>
	fns.reduce(
		(obj, fn) => ({
			...obj,
			...fn(obj, newState => bedazzle(newState, ...fns)), // redecorate support
		}),
		state
	)
