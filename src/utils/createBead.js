/**
 * 🧩 createBead
 *
 * A factory for creating named, composable behavior units (beads).
 * Each bead receives the current object and returns new partial state.
 * It also provides optional debugging for overlapping keys.
 *
 * @param {string} name - The display name of the bead (used in debug logs)
 * @param {function} fn - The bead function (receives state and optional redecorate)
 * @returns {function} - A decorator function (obj, redecorate) => partial update
 */
export const createBead = (name, fn) => (obj, redecorate) => {
	// 🔍 Log bead input (for development and debugging)
	console.log(`[createBead: ${name}] input:`, obj)

	// 🧠 Run the bead function to get its partial state
	const result = fn(obj, redecorate)

	// ⚠️ Check for overlapping keys (that would be replaced by this bead)
	const collisions = Object.keys(result).filter(
		k => k in obj && result[k] !== obj[k]
	)

	// 🚨 Warn if this bead overlaps keys that were already set by previous beads
	if (collisions.length) {
		console.warn(`[${name}] overlaps keys:`, collisions)
	}

	// ✅ Return the partial object to be merged into app state
	return result
}
