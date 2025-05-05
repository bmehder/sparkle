export const createWiring = (ref, update) => (elKey, event, handler) => {
	ref.value.el[elKey][`on${event}`] = e => {
		const result = handler(ref.value, e)

		if (result === undefined) return

		// ✨ If handler returns an array of partials, merge them
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

		// ✨ If handler returns a single partial object
		if (typeof result === 'object') {
			update(() => ({ ...ref.value, ...result }))
			return
		}

		// 🛑 Ignore invalid return values (string, number, etc.)
		console.warn('[wire] Ignored non-object update result:', result)
	}
}
