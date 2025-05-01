
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
- a `wire()` function for DOM event bindings
- a `decorate()` function to apply all current beads

### 🔁 update(fn)
Calls `decorate(fn(obj))`, reassigns the app's state, and re-renders.

---

## 🧬 App Lifecycle

1. You define a `seed` state and list of `beads`
2. You call `createApp()` to get back the app control surface
3. You `wire()` events to actions
4. You `render()` from the state object
5. You optionally export a `setup()` function to group wiring logic
6. You `registerApp()` in `main.js`

---

## 🔧 Example Usage

```js
const {
  appRef,
  wire,
  update,
  decorate
} = createApp({ seed, beads, render })

wire('toggle', 'click', () =>
  update(
    composeUpdates(
      o => o.toggle(),
      decorate,
      o => o.countToggle()
    )
  )
)

render(appRef.value)
```

---

## 🧙‍♂️ No Magic

There’s no virtual DOM, no compiler, and no magic lifecycle.

You:
- own your state
- own your rendering
- wire everything explicitly

That’s Sparkle.
