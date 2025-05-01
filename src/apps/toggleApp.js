import { createApp } from '../runtime/createApp.js'
import { composeUpdates } from '../utils/composeUpdates.js'
import { withToggle } from '../beads/withToggle.js'
import { withCountToggles } from '../beads/withCountToggles.js'
import { withDOM } from '../beads/withDOM.js'
import { withLogger } from '../beads/withLogger.js'

const renderLabel = ({ el, label, isOn }) =>
  (el.label.textContent = `${label}: ${isOn ? 'ON' : 'OFF'}`)

const renderButton = ({ el, isOn }) =>
  (el.toggle.textContent = isOn ? 'Turn Off' : 'Turn On')

const render = obj => [renderLabel, renderButton].forEach(fn => fn(obj))

const { appRef, decorate, update, wire } = createApp({
  seed: { label: 'Lights' },
  beads: [withToggle, withCountToggles, withDOM, withLogger],
  render
})

const toggleAndCount = obj =>
  composeUpdates(
    o => o.toggle(),
    decorate,
    o => o.countToggle()
  )(obj)

const setup = () => {
  wire('toggle', 'click', toggleAndCount)
}

export { appRef, render, setup }
