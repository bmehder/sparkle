import { createApp } from '../runtime/createApp.js'
import { withToggle } from '../beads/withToggle.js'
import { withCountToggles } from '../beads/withCountToggles.js'
import { withDOM } from '../standard-beads/withDOM.js'
import { withLogger } from '../standard-beads/withLogger.js'
import { withDevPanel } from '../standard-beads/withDevPanel.js'

const renderLabel = ({ el, label, isOn }) => {
	el.label.textContent = `${label}: ${isOn ? 'ON' : 'OFF'}`
}

const renderButton = ({ el, isOn }) => {
	el.toggleButton.textContent = isOn ? 'Turn Off' : 'Turn On'
}

const render = obj => [renderLabel, renderButton].forEach(fn => fn(obj))

const { appRef, wire } = createApp({
	seed: { label: 'Lights' },
	beads: [
		withToggle,
		withCountToggles,
		withDOM('label', 'toggleButton'),
		withDevPanel,
		withLogger('log'),
	],
	render,
})

const toggleAndCount = o => ({
	label: o.label,
	...o.toggle(),
	...o.countToggle(),
})

const setup = () => {
	wire('toggleButton', 'click', toggleAndCount)
}

export { appRef, render, setup }
