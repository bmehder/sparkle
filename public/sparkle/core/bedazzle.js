/**
 * ✨ bedazzle
 *
 * Applies a sequence of bead functions to a state object, layering behavior and structure.
 * Each bead receives the current object and a redecorate helper for dynamic re-decoration.
 *
 * @param {object} state - The starting state (usually the seed)
 * @param {...function} fns - A list of bead functions to apply
 * @returns {object} - The fully decorated object with all bead contributions merged in
 *
 * 🧠 What It's Doing Conceptually:
 * - Starts with the base state
 * - Runs each bead (fn) in order
 * - Passes the current object to each bead along with a redecorate() helper
 * - Each bead returns a partial object
 * - All partials are merged together: { ...obj, ...partial }
 * - The final result is a fully composed object with behaviors and data
 *
 * 🧩 Why It Matters:
 * - This is the heart of Sparkle’s structural composition model
 * - It ensures beads are isolated, ordered, and dynamically re-invokable
 * - It makes update(fn) “just work” — because any returned object gets re-decorated
 */

export const bedazzle = (state, ...fns) =>
	fns.reduce(
		(obj, fn) => ({
			...obj, // retain accumulated keys
			...fn(
				obj,
				(
					newState // apply this bead, passing in:
				) => bedazzle(newState, ...fns) // → a redecorate callback for recursive updates
			),
		}),
		state // initial accumulator
	)