/**
 * 🔗 createWiring
 *
 * Returns a wire() function that connects DOM events to update logic.
 * It attaches an event listener to the specified element, invoking a handler
 * that optionally returns a partial state object or array of partials.
 *
 * @param {object} ref - A reactive appRef with .value pointing to app state
 * @param {function} update - The update function from createUpdater
 * @returns {function} - wire(elKey, event, action)
 *
 * @example
 * wire('inc', 'click', (o, e) => o.increment())
 */
export const createWiring = (ref, update) => (elKey, event, handler) => {
	ref.value.el[elKey][`on${event}`] = e => {
		const result = handler(ref.value, e)
		
		if (result === undefined) return

		if (Array.isArray(result)) {
			const merged = result.reduce((acc, partial) => {
				if (partial && typeof partial === 'object') {
					Object.assign(acc, partial)
				}
				return acc
			}, {})
			update(() => ({ ...ref.value, ...merged }))
			return
		}

		if (typeof result === 'object') {
			update(() => ({ ...ref.value, ...result }))
			return
		}

		console.warn('[wire] Ignored non-object update result:', result)
	}
}
