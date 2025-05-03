import { createBead } from '../utils/createBead.js'

export const withDOM = (...keys) =>
	createBead('dom', obj => {
		const el = obj.el ?? {}
		for (const key of keys) {
			const element = document.getElementById(key)
			if (!element) {
				console.warn(`[withDOM] Element with ID "${key}" not found.`)
			}
			el[key] = element
		}
		return { el }
	})
