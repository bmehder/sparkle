import { createBead } from '../utils/createBead.js'

export const withInterfaceTest = (name, validate) =>
	createBead(`test:${name}`, obj => {
		if (!validate(obj)) {
			throw new Error(`❌ Interface "${name}" not satisfied`)
		}
		return { [`_tested:${name}`]: true }
	})
