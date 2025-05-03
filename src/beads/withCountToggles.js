import { createBead } from '../utils/createBead.js'

export const withCountToggles = createBead('countToggles', obj => {
	const toggleCount = obj.toggleCount ?? 0
	return {
		toggleCount,
		countToggle: () => ({ toggleCount: toggleCount + 1 }),
	}
})
