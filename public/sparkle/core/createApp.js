import { createDecorator } from './createDecorator.js'
import { createUpdater } from './createUpdater.js'
import { createWiring } from './createWiring.js'
import { explicit, fx } from './blink.js'

/**
 * ⚡ createApp
 *
 * Assembles a Sparkle app by combining initial state, behavior beads,
 * a render function, and wiring utilities. It automatically renders the app
 * and optionally wires event listeners if a `setup` function is provided.
 *
 * @param {object} config
 * @param {object} config.seed - The initial state of the app
 * @param {function[]} config.beads - An array of bead functions (from createBead)
 * @param {function} config.render - A function that projects state to DOM
 * @param {function} [config.setup] - Optional function that wires event handlers
 * @param {boolean} [config.autoRender=true] - Toggle reactive rendering
 * @returns {object} - { appRef, decorate, update, wire }
 */
export const createApp = ({ seed, beads, render, setup, autoRender = true }) => {
	const decorate = createDecorator(...beads)
	const appRef = explicit(decorate(seed))
	const update = createUpdater(appRef, decorate)
	const wire = createWiring(appRef, update)

	if (autoRender) fx(() => render(appRef.value))
	if (typeof setup === 'function') setup({ appRef, update, wire })

	return { appRef, decorate, update, wire }
}
