import { createApp } from '../runtime/createApp.js'
import { withTime } from '../beads/withTime.js'
import { withTimerDOM } from '../beads/withTimerDOM.js'
import { withLogger } from '../beads/withLogger.js'

const render = obj =>
  (obj.el.timeDisplay.textContent = `${obj.seconds}s`)

const { appRef, update, wire } = createApp({
  seed: { seconds: 0 },
  beads: [withTime, withTimerDOM, withLogger],
  render
})

let intervalId = null

const start = obj => {
  if (!intervalId) {
    intervalId = setInterval(() => {
      update(o => o.tick())
    }, 1000)
  }
  return obj
}

const stop = obj => {
  clearInterval(intervalId)
  intervalId = null
  return obj
}

const setup = () => {
  wire('start', 'click', start)
  wire('stop', 'click', stop)
}

export { appRef, render, setup }
