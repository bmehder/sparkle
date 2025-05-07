import { createBead } from '../core/createBead.js'

/**
 * 🔒 withPersistenceLite
 *
 * A minimal persistence bead that:
 * - Restores selected fields from localStorage (once, on first decoration)
 * - Saves those fields on every update (excluding transient fields like `el`)
 *
 * @param {string} key - localStorage key to persist under
 * @param {string[]} fields - fields to restore/save (e.g., ['todos', 'newText'])
 */
export const withPersistence = (key = 'sparkle-app', fields = []) => {
	let hydrated = false
	let lastSaved = ''

	return createBead(`persistLite:${key}`, obj => {
		let result = {}

		// 1. Hydrate once on first decoration
		if (!hydrated) {
			hydrated = true
			try {
				const stored = localStorage.getItem(key)
				if (stored) {
					const parsed = JSON.parse(stored)
					if (parsed && typeof parsed === 'object') {
						for (const f of fields) {
							if (f in parsed) result[f] = parsed[f]
						}
					}
				}
			} catch (err) {
				console.warn(`[withPersistenceLite] Failed to parse "${key}"`, err)
			}
		}

		// 2. Schedule save of selected fields
		const safe = {}
		for (const f of fields) {
			if (f in obj) safe[f] = obj[f]
		}

		const next = JSON.stringify(safe)
		if (next !== lastSaved) {
			lastSaved = next
			if (typeof requestIdleCallback === 'function') {
				requestIdleCallback(() => {
					localStorage.setItem(key, next)
				})
			} else {
				setTimeout(() => {
					localStorage.setItem(key, next)
				}, 100)
			}
		}

		return result
	})
}
