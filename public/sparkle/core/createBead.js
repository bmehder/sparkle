/**
 * 🧩 createBead
 *
 * A factory for creating named, composable behavior units (beads).
 * Each bead receives the current object and returns new partial state.
 * It also provides development-time logging and key collision warnings.
 *
 * @param {string} name - The display name of the bead (used in debug logs)
 * @param {function} fn - The bead function (receives state and optional redecorate)
 * @returns {function} - A decorator function: (obj, redecorate) => partial update
 */
export const createBead = (name, fn) => (obj, redecorate) => {
	console.groupCollapsed(`🧩 [createBead: ${name}]`)
	console.log('📥 Input:', obj)

	const result = fn(obj, redecorate)
	console.log('📤 Output:', result)

	const collisions = Object.keys(result).filter(
		k => k in obj && result[k] !== obj[k]
	)
	
	if (collisions.length) {
		console.warn('⚠️ Key collisions:', collisions)
	}

	console.groupEnd()
	return result
}
