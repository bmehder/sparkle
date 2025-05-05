/**
 * 🔄 createUpdater
 *
 * Creates a state updater function tied to a reactive appRef.
 * Applies a user-defined update function to the current state,
 * decorates the result, and triggers a render.
 *
 * @param {object} ref - A Blink signal wrapping the current app state
 * @param {function} decorate - The bead composer function from createDecorator
 * @returns {function} - An updater: fn => void
 */
export const createUpdater = (ref, decorate) => fn => {
	// 🎯 Run the user-defined update function on the current state
	const next = fn(ref.value)

	// ❌ Ignore invalid update results (e.g., undefined, non-object)
	if (!next || typeof next !== 'object') {
		console.error('[update] Ignored invalid update result:', next)
		return
	}

	// ✅ Re-apply decoration to the new state and assign it
	ref.value = decorate(next)

	// 🧪 Optional: call .log() if the state exposes it
	ref.value.log?.()
}
