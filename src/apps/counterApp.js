import { createApp } from '../runtime/createApp.js'
import { withCounter } from '../beads/withCounter.js'
import { withCountToggles } from '../beads/withCountToggles.js'
import { withDOM } from '../standard-beads/withDOM.js'
import { withLogger } from '../standard-beads/withLogger.js'

const render = ({ el, count, toggleCount }) => {
	el.countDisplay.textContent = count
	el.toggleCount.textContent = toggleCount ?? 0 // optional display
}

const { appRef, wire } = createApp({
	seed: { count: 0 },
	beads: [
		withCounter,
		withCountToggles,
		withDOM('countDisplay', 'toggleCount', 'inc', 'dec'), // ✅ shared DOM bead
		withLogger('log'), // ✅ updated logger
	],
	render,
})

const setup = () => {
	wire('inc', 'click', o => ({
		...o.increment(),
		...o.countToggle?.(),
	}))

	wire('dec', 'click', o => ({
		...o.decrement(),
		...o.countToggle?.(),
	}))
}

export { appRef, render, setup }
