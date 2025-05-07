import { createBead } from '../core/createBead.js'

export const withHistory = (max = 50) =>
	createBead(`history:${max}`, obj => {
		const history = Array.isArray(obj.history) ? [...obj.history] : []
		const snapshot = {}

		for (const key in obj) {
			if (!['history', 'el', 'log'].includes(key)) {
				snapshot[key] = obj[key]
			}
		}

		history.push(snapshot)
		if (history.length > max) history.shift()

		return { history }
	})
