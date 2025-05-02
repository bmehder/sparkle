import { createApp } from '../runtime/createApp.js'
import { composeUpdates } from '../utils/composeUpdates.js'

// 🧩 Import your beads here
import { withSomeFeature } from '../beads/withSomeFeature.js'
import { withAnotherFeature } from '../beads/withAnotherFeature.js'

// 🧾 Define the initial state
const seed = {
	// Add your initial state properties here
	example: 0,
}

// 🎨 Define the render function
const render = ({ el, example }) => {
	// Update the DOM based on the current state
	el.output.textContent = example
}

// 🔧 Create the app
const { appRef, decorate, update, wire } = createApp({
	seed,
	beads: [
		withSomeFeature,
		withAnotherFeature,
		_ => ({
			el: {
				// Wire DOM elements here
				output: document.getElementById('output'),
				increment: document.getElementById('increment'),
			},
		}),
	],
	render,
})

// 🧵 Wire up UI interactions
const setup = () => {
	wire('increment', 'click', o =>
		composeUpdates(o => decorate(o).increment(), decorate)(o)
	)
}

// 📦 Export for external use (like index.js or testing)
export { appRef, render, setup }
