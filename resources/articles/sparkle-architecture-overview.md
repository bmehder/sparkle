# ✨ Sparkle Architecture Overview

## ⚗️ Formula

```text
Sparkle = Bedazzle + Blink + Intention
```

Sparkle is not a framework — it’s a minimal architecture composed of two small libraries:

- **Bedazzle** — structural behavior composition via decorator functions ("beads")
- **Blink** _(formerly Slank)_ — reactive state management via signals and effects

Combined, they form a powerful and tiny loop:

> 🎯 decorate → 🔁 update → 🎨 render → 🔗 wire → repeat

---

## 🧩 Components

### 1. **Beads (`createBead`)**

> Add structural behavior to an object.

- Each bead is a named function that receives `obj` and returns partial state.
- No mutations, no side effects, no `this`.

```js
export const withCounter = createBead('counter', obj => {
	const count = obj.count ?? 0
	return {
		count,
		increment: () => ({ count: count + 1 }),
	}
})
```

---

### 2. **Decoration (`bedazzle`)**

> Composes all beads into a decorated object.

```js
bedazzle(seed, withCounter, withLogger)
```

- Merges each bead’s output
- Provides a `redecorate()` helper for chaining

---

### 3. **Signals (`explicit`, `fx`)**

> Tracks state and auto-renders when updated.

```js
const appRef = explicit(decorate(seed))
fx(() => render(appRef.value))
```

---

### 4. **Wiring (`wire`)**

> Connects DOM events to state updates

```js
wire('inc', 'click', o => o.increment())
```

- `o` is the fully decorated state
- The return value is passed to `update()`, redecorated, and rendered

---

## 🔁 The Sparkle Loop

1. Initial seed → `decorate()`
2. Setup reactive render with `fx()`
3. Setup DOM bindings with `wire()`
4. Events call `update(fn)`
5. `fn` returns new partial state
6. `update()` → `decorate()` → `render()` again

All without a build step, framework, or VDOM.

---

## 🧠 Why It Works

- Composable behavior
- Pure, declarative updates
- Modular and testable
- Works with or without a framework
- Minimal surface area, maximal expressiveness

---

## 💡 Notably Absent

- ❌ VDOM
- ❌ Reducers
- ❌ JSX
- ❌ Global state
- ❌ Actions or effects

Sparkle doesn’t impose — it decorates.

---

## 💬 Summary

> Sparkle is what happens when behavior composition, reactivity, and clarity get out of each other's way.

It’s not trying to be a new framework — just a better foundation.
