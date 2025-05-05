import { createBead } from '../core/createBead.js'

export const withNewText = createBead('newText', obj => ({
	newText: obj.newText ?? '',

	setText: text => ({ newText: text }),

	clearText: () => ({ newText: '' }),
}))
