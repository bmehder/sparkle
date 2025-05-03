import { createDecorator } from '../utils/createDecorator.js'
import { createUpdater } from '../utils/createUpdater.js'
import { createWiring } from '../utils/wire.js'
import { explicit, fx } from '../utils/blink.js'

/**
 * ⚡ createApp
 *
 * Assembles a Sparkle app by combining initial state, behavior beads,
 * a render function, and wiring utilities. Returns all the runtime
 * handles needed to control and extend the app.
 *
 * @param {object} config
 * @param {object} config.seed - The initial state of the app
 * @param {function[]} config.beads - An array of bead functions (created via createBead)
 * @param {function} config.render - A function that projects state to DOM
 * @returns {object} - { appRef, decorate, update, wire }
 */
export const createApp = ({ seed, beads, render }) => {
	// 🧩 Create the decoration function from all provided beads
	const decorate = createDecorator(...beads)

	// 🪞 Wrap the initial state in a reactive signal
	const appRef = explicit(decorate(seed))

	// 🔄 Create the update function (runs user updates and triggers render)
	const update = createUpdater(appRef, decorate, render)

	// 🔗 Create the wire function (connects DOM events to update logic)
	const wire = createWiring(appRef, update)

	// 🖼 Reactively re-render the app whenever state changes
	fx(() => render(appRef.value))

	// 🧵 Return core runtime handles
	return { appRef, decorate, update, wire }
}
