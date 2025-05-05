import { createApp } from '../core/createApp.js'
import { withTime } from '../beads/withTime.js'
import { withDOM } from '../standard-beads/withDOM.js'
import { withLogger } from '../standard-beads/withLogger.js'
import { withDevPanel } from '../standard-beads/withDevPanel.js'

const render = ({ el, seconds }) => {
	el.timeDisplay.textContent = `${seconds}s`
}

let intervalId = null

const start = () => {
	if (!intervalId) {
		intervalId = setInterval(() => {
			update(o => o.tick())
		}, 1000)
	}
}

const stop = () => {
	clearInterval(intervalId)
	intervalId = null
}

const reset = () => {
	stop()
	update(o => o.reset())
}

const { appRef, update } = createApp({
	seed: { seconds: 0 },
	beads: [
		withTime,
		withDOM('timeDisplay', 'start', 'stop', 'reset'),
		withLogger('timer'),
		withDevPanel,
	],
	render,
	setup: ({ wire }) => {
		wire('start', 'click', start)
		wire('stop', 'click', stop)
		wire('reset', 'click', reset)
	},
})

export { appRef, render }
