import { createBead } from '../core/createBead.js'

/**
 * 🧩 withNewText
 *
 * Adds support for tracking input text. Respects existing `newText` (e.g. from persistence).
 */
export const withNewText = createBead('newText', obj => ({
	newText: typeof obj.newText === 'string' ? obj.newText : '',
}))
