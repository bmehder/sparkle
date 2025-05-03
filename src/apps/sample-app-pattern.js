// SparkleAppPattern.js

import { createApp } from '../runtime/createApp.js'
import { withDOM } from '../standard-beads/withDOM.js'
import { withLogger } from '../standard-beads/withLogger.js'

// 🖼 Render function
const render = ({ el, key }) => {
	if (el.output) {
		el.output.textContent = key
	}
}

// 📦 Initial state
const seed = {
	key: 'initial',
}

// 🧩 Beads
// (Replace or add your own beads)
const withSomething = createBead('something', obj => ({
	key: obj.key ?? 'initial',
	doSomething: () => ({ key: 'updated' }),
}))

// 🔌 Create the app
const { appRef, wire } = createApp({
	seed,
	beads: [withSomething, withDOM('output', 'button'), withLogger('log')],
	render,
})

// 🔗 Event wiring
const setup = () => {
	wire('button', 'click', o => ({
		...o.doSomething(),
		...o.log?.(),
	}))
}

export { appRef, render, setup }
