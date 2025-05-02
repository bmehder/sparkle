
import { createApp } from '../runtime/createApp.js'
import { composeUpdates } from '../utils/composeUpdates.js'
import { withCounter } from '../beads/withCounter.js'
import { withCountToggles } from '../beads/withCountToggles.js'
import { withLogger } from '../beads/withLogger.js'

const render = ({ el, count }) =>
  (el.countDisplay.textContent = count)

const { appRef, decorate, update, wire } = createApp({
  seed: { count: 0 },
  beads: [
    withCounter,
    withCountToggles,
    _ => ({
      el: {
        countDisplay: document.getElementById('count-display'),
        inc: document.getElementById('inc'),
        dec: document.getElementById('dec')
      }
    }),
    withLogger
  ],
  render
})

const setup = () => {
  wire('inc', 'click', o =>
    composeUpdates(
      o => decorate(o).increment(),
      decorate,
      o => o.countToggle()
    )(o)
  )
  wire('dec', 'click', o =>
    composeUpdates(
      o => decorate(o).decrement(),
      decorate,
      o => o.countToggle()
    )(o)
  )
}

export { appRef, render, setup }
