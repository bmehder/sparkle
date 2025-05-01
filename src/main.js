import { registerApp } from './runtime/registerApp.js'
import * as toggleApp from './apps/toggleApp.js'
import * as timerApp from './apps/timerApp.js'
import * as counterApp from './apps/counterApp.js'

registerApp(toggleApp)
registerApp(timerApp)
registerApp(counterApp)
