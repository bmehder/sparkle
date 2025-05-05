/**
 * 🧩 createBead
 *
 * A factory for creating named, composable behavior units (beads).
 * Each bead receives the current object and returns new partial state.
 * It also provides development-time logging and key collision warnings.
 *
 * Use DEBUG_BEADS to enable or disable bead logging globally.
 * Use DEBUG_BEAD_NAMES to limit logging to specific bead names.
 *
 * @param {string} name - The display name of the bead (used in debug logs)
 * @param {function} fn - The bead function (receives state and optional redecorate)
 * @returns {function} - A decorator function: (obj, redecorate) => partial update
 */

export const createBead = (name, fn) => (obj, redecorate) => {
	console.groupCollapsed(`🧩 [createBead: ${name}]`)
	console.log('📥 Input:', obj)

	// 🧠 Run the bead function to get its partial output
	const result = fn(obj, redecorate)

	console.log('📤 Output:', result)

	// ⚠️ Check for overlapping keys that this bead would override
	const collisions = Object.keys(result).filter(
		k => k in obj && result[k] !== obj[k]
	)

	// 🚨 Warn if this bead replaces keys that already exist in the object
	if (collisions.length) {
		console.warn('⚠️ Key collisions:', collisions)
	}

	console.groupEnd()

	// 🔁 Return the partial state to be merged by bedazzle
	return result
}
