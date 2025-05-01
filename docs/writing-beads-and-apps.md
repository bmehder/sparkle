
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

Sparkle apps live in `src/apps/*.js` and follow a pattern:

```js
const render = obj => {
  obj.el.output.textContent = obj.count
}

const { appRef, decorate, update, wire } = createApp({
  seed: { count: 0 },
  beads: [withCounter, withLogger],
  render
})

const setup = () => {
  wire('inc', 'click', o => decorate(o).increment())
  wire('dec', 'click', o => decorate(o).decrement())
}

export { appRef, render, setup }
```

Each app file should export:
- `appRef`: the app’s reactive reference
- `render`: the UI update function
- `setup` (optional): wiring logic for DOM events

---

## 🧩 Reusing Beads

You can reuse beads across apps:

```js
// This tracks every interaction
withCountToggles
```

Just `decorate()` the object again before calling the method.

---

## 🧰 Tools You Can Use

| Utility            | Purpose                                |
|--------------------|----------------------------------------|
| `composeUpdates()` | Combine multiple state updates in order |
| `createDecorator()`| Return a reusable decorator            |
| `createUpdater()`  | Produce a functional update handler    |
| `registerApp()`    | Renders + runs `setup()` on an app     |

---

Sparkle is minimal by design — so you can build your own patterns on top of it.
