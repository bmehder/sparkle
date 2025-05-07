
# ✍️ Writing Beads and Apps in Sparkle

This guide explains how to write your own **beads** (composable behaviors) and create new **apps** using Sparkle.

---

## 🧩 Writing a Bead

A bead is a pure function that takes a state object (`obj`) and returns a **partial object** to merge in.

### Example: `withCounter.js`

```js
export const withCounter = obj => {
  const count = obj.count ?? 0
  return {
    count,
    increment: () => ({ ...obj, count: count + 1 }),
    decrement: () => ({ ...obj, count: count - 1 })
  }
}
```

Beads should:
- Be **pure**: no side effects
- Be **composable**: don’t mutate input
- Optionally include methods that return updated state

---

## 🧱 Creating an App Module

Sparkle apps live in `src/apps/*.js` and follow a consistent pattern.

Each module creates its own state, behaviors, render logic, and event wiring using `createApp()`.

```js
import { createApp } from '../core/createApp.js'
import { withCounter } from '../beads/withCounter.js'
import { withLogger } from '../standard-beads/withLogger.js'
import { withDOM } from '../standard-beads/withDOM.js'

const render = ({ el, count }) => {
  el.output.textContent = count
}

const { appRef } = createApp({
  seed: { count: 0 },
  beads: [
    withDOM('output', 'inc', 'dec'),
    withCounter,
    withLogger
  ],
  render,
  setup: ({ wire }) => {
    wire('inc', 'click', o => o.increment())
    wire('dec', 'click', o => o.decrement())
  }
})

export { appRef }
```

Each app file typically exports:

- `appRef`: the app’s reactive reference, so `fx(() => render(appRef.value))` is handled internally
- (Optionally) any named methods or flags you want to expose

You no longer need to export or call a separate `setup()` function — wiring is handled inline during app creation.

> Sparkle apps are just files. Pure functions in, expressive DOM out.

---

Sparkle is minimal by design — so you can build your own patterns on top of it.
