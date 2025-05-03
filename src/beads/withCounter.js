import { createBead } from '../utils/createBead.js'

export const withCounter = createBead('counter', obj => {
	const count = typeof obj.count === 'number' ? obj.count : 0

	return {
		count,

		increment: () => ({
			count: count + 1,
		}),

		decrement: () => ({
			count: count - 1,
		}),
	}
})
