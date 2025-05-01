
import { bedazzle } from '../utils/bedazzle.js'
import { createDecorator } from '../utils/createDecorator.js'
import { createUpdater } from '../utils/createUpdater.js'
import { createWiring } from '../utils/wire.js'
import { explicit, fx } from '../utils/slank.js'

export const createApp = ({ seed, beads, render }) => {
  const decorate = createDecorator(...beads)
  const appRef = explicit(decorate(seed))
  const update = createUpdater(appRef, decorate, render)
  const wire = createWiring(appRef, update)

  // Reactive render on state change
  fx(() => render(appRef.value))

  return { appRef, decorate, update, wire }
}
