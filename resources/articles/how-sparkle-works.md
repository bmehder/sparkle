# ✨ How Sparkle Works

**Sparkle** is a tiny UI microframework that composes apps from pure functions and behavior units called **beads**. It requires no build tools, no compilation, and no frameworks — just JavaScript modules and the browser.

---

## 🧩 Core Concepts

### 🧱 Beads
Beads are functions that return a **partial object** that adds behavior or properties to the app's state.

```js
export const withToggle = obj => {
  const isOn = obj.isOn ?? false
  return {
    isOn,
    toggle: () => ({ ...obj, isOn: !isOn }),
  }
}
```

### 💎 bedazzle()
Composes multiple beads onto an object to produce a decorated state.

```js
bedazzle(seed, withToggle, withLogger)
```

### ⚙️ createApp()
Initializes an app with:
- a decorated state (`appRef`)
- an `update()` function for immutable updates
- a `decorate()` function to apply all current beads
- a `wire()` function for DOM event binding (used inside `setup()`)
- optional reactive rendering via `fx()`

### 🔁 update(fn)
Calls `decorate(fn(obj))`, reassigns the app's state, and re-renders.

---

## 🧬 App Lifecycle

1. You define a `seed` state and list of `beads`
2. You call `createApp()` with `render()` and optional `setup()`
3. Sparkle automatically wires `fx(() => render(appRef.value))`
4. Inside `setup({ wire })`, you declaratively attach DOM events
5. Every `update()` re-applies beads and triggers `render()`

---

## 🔧 Example Usage

```js
import { createApp } from '../core/createApp.js'
import { withToggle } from '../beads/withToggle.js'
import { withCountToggles } from '../beads/withCountToggles.js'
import { withDOM } from '../standard-beads/withDOM.js'
import { withLogger } from '../standard-beads/withLogger.js'

const render = ({ el, label, isOn }) => {
  el.label.textContent = `${label}: ${isOn ? 'ON' : 'OFF'}`
  el.toggleButton.textContent = isOn ? 'Turn Off' : 'Turn On'
}

const { appRef } = createApp({
  seed: { label: 'Lights' },
  beads: [
    withDOM('label', 'toggleButton'),
    withToggle,
    withCountToggles,
    withLogger
  ],
  render,
  setup: ({ wire }) => {
    wire('toggleButton', 'click', o => [o.toggle(), o.countToggle()])
  }
})
```

---

## 🧙‍♂️ No Magic

There’s no virtual DOM, no compiler, and no magic lifecycle.

You:
- own your state
- own your rendering
- define your wiring with `setup()`
- use plain functions to layer behavior

That’s Sparkle.

> Compose small, pure behaviors. Wire with intent. Render without illusion.
