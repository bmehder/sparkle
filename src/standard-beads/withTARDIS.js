// standard-beads/withTARDIS.js
import { createBead } from '../utils/createBead.js'

/**
 * ⏰ withTARDIS
 *
 * A time-traveling persistence bead that stores `past`, `future`, and `snapshot`
 * from a Sparkle app using `withUndoRedo`. It fully restores the timeline
 * and latest state on reload.
 *
 * Optionally accepts a `max` parameter to limit the size of the `past` and `future` stacks.
 *
 * Automatically includes a `timestamp` to track last update.
 *
 * Note: This bead does not implement undo/redo logic itself.
 */
export const withTARDIS = (key = 'timeline', max = 100) =>
	createBead(`tardis:${key}`, obj => {
		let restored = obj

		// On load: restore full timeline and current snapshot from localStorage
		try {
			const saved = JSON.parse(localStorage.getItem(key))
			if (saved && typeof saved === 'object') {
				const { past = [], future = [], snapshot = {} } = saved
				restored = {
					...obj,
					...snapshot,
					past,
					future,
				}
			}
		} catch (err) {
			console.warn(`[withTARDIS] Failed to load timeline from "${key}"`, err)
		}

		// Save full timeline + current snapshot on every re-decoration
		setTimeout(() => {
			try {
				let { past = [], future = [], ...snapshot } = obj

				// Enforce max limit for past and future entries
				if (Array.isArray(past) && past.length > max) {
					past = past.slice(past.length - max)
				}
				if (Array.isArray(future) && future.length > max) {
					future = future.slice(0, max)
				}

				const toStore = {
					past,
					future,
					snapshot,
					timestamp: Date.now(),
				}
				localStorage.setItem(key, JSON.stringify(toStore))
			} catch (err) {
				console.warn(`[withTARDIS] Failed to save timeline to "${key}"`, err)
			}
		}, 0)

		return restored
	})
