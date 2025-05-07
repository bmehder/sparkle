import { createBead } from '../core/createBead.js'

export const withPersistence = (key = 'sparkle-app', fields = []) => {
	let hydrated = false
	let lastSaved = ''

	return createBead(`persist:${key}`, obj => {
		console.log(`[withPersistence] RUNNING for: ${key}`)

		let patch = {}

		if (!hydrated) {
			hydrated = true
			try {
				const stored = localStorage.getItem(key)
				if (stored) {
					const parsed = JSON.parse(stored)
					if (parsed && typeof parsed === 'object') {
						for (const f of fields) {
							if (f in parsed) patch[f] = parsed[f]
						}
						console.log(`[withPersistence] LOADED for: ${key}`, patch)
					}
				}
			} catch (err) {
				console.warn(`[withPersistence] Failed to parse "${key}"`, err)
			}
		}

		const safe = {}
		for (const f of fields) {
			if (f in obj) safe[f] = obj[f]
		}

		const json = JSON.stringify(safe)
		if (json !== lastSaved) {
			lastSaved = json
			console.log(`[withPersistence] SAVING for: ${key}`, safe)

			if (typeof requestIdleCallback === 'function') {
				requestIdleCallback(() => localStorage.setItem(key, json))
			} else {
				setTimeout(() => localStorage.setItem(key, json), 100)
			}
		}

		return patch
	})
}
