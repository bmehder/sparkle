import { createApp } from '../core/createApp.js'
import { fx } from '../core/blink.js'

import { withCounter } from '../beads/withCounter.js'
import { withCountToggles } from '../beads/withCountToggles.js'
import { withDOM } from '../standard-beads/withDOM.js'
import { withLogger } from '../standard-beads/withLogger.js'
import { withDevPanel } from '../standard-beads/withDevPanel.js'
import { withHistory } from '../standard-beads/withHistory.js'

const render = ({ el, count, toggleCount }) => {
	el.countDisplay.textContent = count
	el.toggleCount.textContent = toggleCount ?? 0
}

const { appRef } = createApp({
	seed: { count: 0 },
	beads: [
		withHistory(50),
		withCounter,
		withCountToggles,
		withDOM('countDisplay', 'toggleCount', 'inc', 'dec'),
		withLogger('Counter'),
		withDevPanel,
	],
	render,
	setup: ({ wire }) => {
		wire('inc', 'click', o => [o.increment(), o.countToggle?.()])
		wire('dec', 'click', o => [o.decrement(), o.countToggle?.()])
	},
})

export { appRef, render }
