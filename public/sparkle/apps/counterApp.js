import { createApp } from '../core/createApp.js'
import { fx } from '../core/blink.js'

import { withCounter } from '../beads/withCounter.js'
import { withCountToggles } from '../beads/withCountToggles.js'
import { withDOM } from '../standard-beads/withDOM.js'
import { withLogger } from '../standard-beads/withLogger.js'
import { withDevPanel } from '../standard-beads/withDevPanel.js'
import { withPersistence } from '../standard-beads/withPersistence.js'
import { withHistory } from '../standard-beads/withHistory.js'

console.log('[counterApp] loaded')

const renderCounter = ({ el, count, toggleCount }) => {
	console.log('[counterApp] fx triggered')
	el.countDisplay.textContent = count
	el.toggleCount.textContent = toggleCount ?? 0
}

const { appRef: counterRef, update: updateCounter } = createApp({
	seed: { count: 0 },
	beads: [
		withPersistence('Sparkle:Counter', ['count', 'toggleCount', 'history']),
		withHistory(50),
		withCounter,
		withCountToggles,
		withDOM('countDisplay', 'toggleCount', 'inc', 'dec'),
		withLogger('Counter'),
		withDevPanel,
	],
	render: renderCounter,
	setup: ({ wire }) => {
		wire('inc', 'click', o => [o.increment(), o.countToggle?.()])
		wire('dec', 'click', o => [o.decrement(), o.countToggle?.()])
	},
	autoRender: false,
})

renderCounter(counterRef.value)
fx(() => renderCounter(counterRef.value))
