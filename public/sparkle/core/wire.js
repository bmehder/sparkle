/**
 * 🔗 createWiring
 *
 * Returns a wire() function that connects DOM events to update logic.
 * It attaches an event listener to the specified element, invoking a handler
 * that optionally returns a partial state object.
 *
 * @param {object} ref - A reactive appRef with .value pointing to app state
 * @param {function} update - The update function from createUpdater
 * @returns {function} - wire(elKey, event, action)
 *
 * @example
 * wire('inc', 'click', (o, e) => o.increment())
 */
export const createWiring = (ref, update) => (elKey, event, action) =>
	// 🧷 Attach handler directly to the DOM element's event
	(ref.value.el[elKey][`on${event}`] = e => {
		// 🧠 Run the action, passing in the current decorated state and the event
		const result = action(ref.value, e)

		// ✅ If the handler returns a new state object, update and decorate it
		if (result !== undefined) {
			update(() => result)
		}
	})
