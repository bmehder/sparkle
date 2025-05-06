import { log, warn, groupCollapsed, groupEnd } from '../utils/log.js'

/**
 * 🧩 createBead
 *
 * A factory for creating named, composable behavior units ("beads").
 * Each bead receives the current object and may return a partial update.
 * This function logs input, output, merged result, and warns about key collisions.
 *
 * @param {string} name - The display name of the bead (used in debug logs)
 * @param {function} fn - The bead function (receives state and optional redecorate)
 * @returns {function} - A decorator function: (obj, redecorate) => partial update
 */
export const createBead = (name, fn) => (obj, redecorate) => {
	// Start a collapsed console group for this bead
	groupCollapsed(`🧩 [createBead: ${name}]`)

	// Log the input state object (before decoration)
	log('📥 Input:', obj)

	// Call the bead function with current state
	const result = fn(obj, redecorate)

	// Log the returned partial update (the bead's contribution)
	log('📤 Output:', result)

	// Merge the original state with the result to preview the next state
	const merged = { ...obj, ...result }
	log('📦 Merged:', merged)

	// Check for collisions: keys already present but being overwritten with a new value
	const collisions = Object.keys(result).filter(
		k => k in obj && result[k] !== obj[k]
	)
	if (collisions.length) {
		warn('⚠️ Key collisions:', collisions)
	}

	// End the console group
	groupEnd()

	// Return the raw bead result (merged happens later in bedazzle)
	return result
}
