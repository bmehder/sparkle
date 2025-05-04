import { createApp } from '../runtime/createApp.js'
import { withTime } from '../beads/withTime.js'
import { withDOM } from '../standard-beads/withDOM.js'
import { withLogger } from '../standard-beads/withLogger.js'
import { withDevPanel } from '../standard-beads/withDevPanel.js'

const render = ({ el, seconds }) => {
	el.timeDisplay.textContent = `${seconds}s`
}

const { appRef, update, wire } = createApp({
	seed: { seconds: 0 },
	beads: [
		withTime,
		withDOM('timeDisplay', 'start', 'stop'),
		withLogger('logDERP'),
		withDevPanel,
	],
	render,
})

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

const setup = () => {
	wire('start', 'click', start)
	wire('stop', 'click', stop)
}

export { appRef, render, setup }
