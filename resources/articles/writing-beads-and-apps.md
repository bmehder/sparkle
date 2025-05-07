# ✍️ Writing Beads and Apps in Sparkle

In Sparkle, **beads** are how you define behavior. **Apps** are how you compose them.

This guide shows you how to write your own reusable beads and build self-contained apps — all with plain functions and no framework overhead.

---

## 🧩 Writing a Bead

A **bead** is a pure function that extends an object with new behavior. It takes a state object (`obj`) and returns a **partial object** — typically methods or derived values.

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

✅ Guidelines for good beads:

* **Pure** — no side effects or shared references
* **Composable** — don’t mutate the input; return new state
* **Focused** — do one thing (e.g., toggle, count, track)
* **Reentrant** — safe to reapply on every update
* **Testable** — can be unit tested like any function

Want it to be reusable? Wrap it in `createBead()` for logging and key collision safety.

---

## 🏗️ Using `createBead()` to Wrap and Reuse Beads

When writing a bead, Sparkle provides an optional helper called `createBead()` that acts as a **bead factory**. This function takes your bead’s core behavior (the function that defines what the bead does) and wraps it with extra features like logging, name tagging, and collision checks.

In essence, you give `createBead()` a unique name and your bead function, and it returns a new bead that behaves the same — but with better dev-time support.

The wrapper added by `createBead()` does **not** change your bead’s logic or performance. It only adds structure to help with development and debugging:

* ✅ **Logging**: Automatically logs input, output, and merged result each time the bead runs.
* ✅ **Collision Detection**: Warns if the bead overwrites existing keys in state.
* ✅ **Named Identifier**: Uses the name you provide (`createBead('counter', fn)`) for easy tracing in the console.

### 🧩 When to Use `createBead()`

* ✔️ When you're building **reusable** or **shareable** beads
* ✔️ When you're writing beads in the `standard-beads/` folder
* ✔️ When debugging or logging behavior matters
* ❌ Optional for one-off or quick inline beads in a small app

All official Sparkle beads (like `withLogger`, `withDOM`, etc.) are created using `createBead()` to standardize behavior and aid debugging. You don’t have to use it, but adopting it makes your beads easier to reuse and test — and safer to compose.

### 📦 Example: Wrapping a Bead with `createBead()`

```js
// Define the bead behavior
const withCounter = obj => {
  const count = obj.count ?? 0
  return {
    count,
    increment: () => ({ ...obj, count: count + 1 }),
    decrement: () => ({ ...obj, count: count - 1 })
  }
}

// Wrap it with createBead for debug support
export const CounterBead = createBead('counter', withCounter)
```

You can now use `CounterBead` in any app just like any other bead — but with logging, naming, and key safety built in automatically.

> Use `createBead()` for any bead you plan to share, debug, or rely on. Skip it for quick experiments. It’s optional — but helpful.

---

## 🧱 Creating an App Module

Sparkle apps live in `sparkle/apps/*.js` and follow a simple, declarative pattern.

Each app defines its:

* initial state (`seed`)
* behavior layers (`beads`)
* DOM projection (`render`)
* event logic (`setup`)

### Example: `counter.js`

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

---

### 📦 What an App Exports

Each app file typically exports:

* `appRef` — the reactive state reference
* (Optional) any exposed methods, flags, or values

No need to export `render()` or `setup()` — Sparkle handles it for you.

---

### 💡 Why This Matters

Sparkle apps are just files. No components, no build steps, no context juggling.

You get:

* Full control over state and DOM
* Pure behavior units you can test and reuse
* Clean wiring that lives near the thing it affects

> Build what you mean. Compose what you need.

---
