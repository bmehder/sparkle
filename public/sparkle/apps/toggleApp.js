import { createApp } from '../core/createApp.js'
import { withToggle } from '../beads/withToggle.js'
import { withCountToggles } from '../beads/withCountToggles.js'
import { withDOM } from '../standard-beads/withDOM.js'
import { withLogger } from '../beads/withLogger.js'
import { withDevPanel } from '../standard-beads/withDevPanel.js'

const renderLabel = ({ el, label, isOn }) => {
	el.label.textContent = `${label}: ${isOn ? 'ON' : 'OFF'}`
}

const renderButton = ({ el, isOn }) => {
	el.toggleButton.textContent = isOn ? 'Turn Off' : 'Turn On'
}

const render = obj => [renderLabel, renderButton].forEach(fn => fn(obj))

const toggleAndCount = o => ({
	label: o.label,
	...o.toggle(),
	...o.countToggle(),
})

const { appRef } = createApp({
	seed: { label: 'Lights' },
	beads: [
		withDOM('label', 'toggleButton'),
		withToggle,
		withCountToggles,
		withDevPanel,
		withLogger,
	],
	render,
	setup: ({ wire }) => {
		wire('toggleButton', 'click', toggleAndCount)
	}
})

export { appRef, render }
