import { createBead } from '../core/createBead.js'

export const withCountToggles = createBead('countToggles', obj => {
	const toggleCount = obj.toggleCount ?? 0
	
	return {
		countToggle: () => ({ toggleCount: toggleCount + 1 }),
	}
})
