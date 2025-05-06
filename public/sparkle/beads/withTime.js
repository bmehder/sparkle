import { createBead } from '../core/createBead.js'

export const withTime = createBead('time', obj => {
	const seconds = typeof obj.seconds === 'number' ? obj.seconds : 0

	return {
		tick: () => ({ seconds: seconds + 1 }),
		reset: () => ({ seconds: 0 })
	}
})
