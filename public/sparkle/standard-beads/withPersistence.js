import { createBead } from '../core/createBead.js'

/**
 * 🔒 withPersistence
 *
 * Persists the app state to localStorage under the given key.
 * On first run, merges any stored state into the current object.
 * On every update, stores the full decorated object to localStorage.
 */
export const withPersistence = (key = 'sparkle-app') =>
	createBead(`persist:${key}`, obj => {
		// Load saved state (only once on first decoration)
		const stored = localStorage.getItem(key)
		let merged = obj

		if (stored) {
			try {
				const parsed = JSON.parse(stored)
				if (parsed && typeof parsed === 'object') {
					merged = { ...obj, ...parsed }
				}
			} catch (err) {
				console.warn(
					`[withPersistence] Failed to parse localStorage for "${key}"`,
					err
				)
			}
		}

		// Save current state after update
		setTimeout(() => {
			try {
				localStorage.setItem(key, JSON.stringify(obj))
			} catch (err) {
				console.warn(`[withPersistence] Failed to store state for "${key}"`, err)
			}
		}, 0)

		return merged
	})
