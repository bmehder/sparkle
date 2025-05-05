import { createApp } from '../core/createApp.js'
import { withCounter } from '../beads/withCounter.js'
import { withCountToggles } from '../beads/withCountToggles.js'
import { withDOM } from '../standard-beads/withDOM.js'
import { withLogger } from '../standard-beads/withLogger.js'
import { withDevPanel } from '../standard-beads/withDevPanel.js'

const render = ({ el, count, toggleCount }) => {
	el.countDisplay.textContent = count
	el.toggleCount.textContent = toggleCount ?? 0 // optional display
}

const { appRef } = createApp({
	seed: { count: 0 },
	beads: [
		withCounter,
		withCountToggles,
		withDOM('countDisplay', 'toggleCount', 'inc', 'dec'), // ✅ shared DOM bead
		withLogger('Counter'), // ✅ updated logger,
		withDevPanel,
	],
	render,
	setup: ({ wire }) => {
		wire('inc', 'click', o => ({
			...o.increment(),
			...o.countToggle?.(),
		}))

		wire('dec', 'click', o => ({
			...o.decrement(),
			...o.countToggle?.(),
		}))
	},
})

export { appRef, render }
