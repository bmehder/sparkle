# 🟣 Sparkle Framework Documentation


## 🧭 What’s in This Guide

This documentation is a deep technical walkthrough of the Sparkle framework. It’s designed to be read front-to-back or referenced section by section.

Here’s what’s covered:

- 🚀 Quickstart: Set up a working Sparkle app in under a minute
- ✨ Core Concepts: What Sparkle is and how it’s different
- 🏗️ Runtime & Architecture: The lifecycle of a Sparkle app
- ⚡️ Blink Internals: How Sparkle handles reactivity without a VDOM
- 🧪 Testing: Pure functions make testability first-class
- 📦 Utilities: `bedazzle`, `createBead`, `composeUpdates`, and more
- 🧩 Beads: How to create, layer, and reason about Sparkle behaviors
- 🛠️ Contribution Guide: How to build and submit your own beads
- 🧠 Design Philosophy: The values behind Sparkle’s minimal design

> This is a long-form, no-shortcuts guide. Expect clarity, not cleverness.

Sparkle is a minimal, functional UI microframework built on top of two core ideas:

- 🧩 **Composable behavior through "beads"**
- ⚡️ **Reactive state with Blink signals**

It aims to give developers full control over DOM, behavior, and state — without templates, VDOM, or build steps. Instead of magic, Sparkle gives you **functions, reactivity, and clarity**.


---



## 🚀 Quickstart

Sparkle apps don’t require a build tool, bundler, or CLI. All you need is an HTML file and a few script tags. Here's the fastest way to get started:


---



### 1. Scaffold Your HTML

```html
<body>
  <div id="app">
    <p id="count-display">0</p>
    <button id="inc">Increment</button>
  </div>

  <script type="module" src="./src/main.js"></script>
</body>
```

You’ll reference elements like `#count-display` and `#inc` in your app’s `render()` and `wire()` logic.


---



### 2. Create Your App Logic

```js
// src/counterApp.js
import { createApp } from '../runtime/createApp.js'
import { withCounter } from '../beads/withCounter.js'

export const render = ({ el, count }) => {
  el.countDisplay.textContent = count
}

export const setup = () => {
  wire('inc', 'click', o => update(s => ({ ...s, count: s.count + 1 })))
}

export const { appRef, update, wire } = createApp({
  seed: { count: 0 },
  beads: [
    withCounter,
    obj => ({
      el: {
        countDisplay: document.getElementById('count-display'),
        inc: document.getElementById('inc')
      }
    })
  ],
  render
})
```


---



### 3. Register the App

```js
// src/main.js
import * as counterApp from './counterApp.js'
import { registerApp } from './runtime/registerApp.js'

registerApp(counterApp)
```

That’s it. You now have a fully functional reactive UI with no VDOM, no JSX, and no framework boilerplate.


---



### ✅ TL;DR

- Build your HTML manually
- Create pure bead behaviors
- Use `createApp()` to connect state, render, and events
- Call `registerApp()` to run it

> If it sparkles, ship it.


## ✨ Core Concepts




### ⚡️ Blink

Blink is Sparkle’s reactive core. It provides signals and effects, allowing your state to be reactive without needing a virtual DOM.

Core utilities:

- `explicit(initial)` — creates a writable signal
- `fx(fn)` — runs a function and tracks its dependencies
- `implicit(fn)` — derived signal from other signals

When your app state is stored in a signal (`explicit()`), Sparkle can re-run your `render()` function every time the state changes — no proxies, no hooks, just pure state.


---



## 🧱 File Structure

```
src/
  apps/           → App examples: counter, timer, toggle
  beads/          → Core beads (pure behaviors)
  standard-beads/ → Reusable bead factories (recommended)
  runtime/        → App lifecycle (createApp, registerApp)
  utils/          → Bedazzle engine, signals, decorators, wiring
  styles/         → CSS for examples
  main.js         → Registers and starts each example app
```


---





## 🏗️ Runtime & Architecture

The runtime is Sparkle's functional core — it orchestrates state, rendering, and behavior composition without hidden layers or side effects. Every app runs through this architecture:

```
DOM ↔ wire() → update() → bedazzle() → render()
```

Let’s look at each part.


---



### 🔧 `createApp()`

This is the entry point for setting up a Sparkle app. It wires together state management, reactive rendering, decoration, and event wiring.

```js
const { appRef, decorate, update, wire } = createApp({
  seed: { count: 0 },
  beads: [withCounter, withLogger],
  render
})
```

#### What it does:

- Wraps your `seed` state in a Blink signal: `explicit(seed)`
- Applies all your beads using `bedazzle()`
- Creates an `update(fn)` function using `createUpdater()`
- Triggers `render()` every time state updates
- Returns a helper to re-`decorate()` any object
- Provides `wire()` to declaratively attach DOM event listeners

What is returned by `createApp` is derived from your initial state and beads. You get full control — nothing is injected or proxied.


---



### 🔁 `createUpdater()`

This function defines how `update(fn)` works:

```js
ref.value = decorate(fn(ref.value))
ref.value.log?.()
render(ref.value)
```

In other words:

- It takes your old state
- Runs your update function (`fn(state)`)
- Re-decorates the result with all current beads
- Optionally calls `.log()` if it exists (via `withLogger`)
- Triggers a re-render

This is Sparkle’s **immutable update loop** — no proxies, no observers. You always return a new state object, and `decorate()` keeps its methods fresh.


---



### 🧩 `decorate()` and Re-Decoration

`decorate(obj)` runs your bead cascade:

```js
bedazzle(obj, ...beads)
```

Because beads are pure functions that return extensions to `obj`, they can be re-applied as many times as you like — safely and consistently.

This is Sparkle’s answer to stale closures, missing methods, or broken state: just decorate the new object again.


---


#### 🧠 Why Not Just Copy the Behavior?

When you call a method like `state.increment()`, it returns a **new object** — but that object only contains the properties returned by that specific method. Any other behavior from your beads (like `decrement`, `log`, or `toggle`) is not included unless explicitly carried over.

Even if you spread the old state into the new one:

```js
increment: () => ({ ...obj, count: obj.count + 1 })
```

You're only copying fields — not behavior. Those methods aren't bound or persistent across state transitions.

Instead of trying to preserve behavior manually, Sparkle just **re-decorates** the new state object using all active beads. This ensures:

- ✅ You always get the full behavior set back
- ✅ No method is ever lost or silently dropped
- ✅ Beads remain pure, stateless, and composable

This keeps your app consistent and your behavior declarations testable and clean. This approach also makes beads highly testable and composable.


---



### 🎛 `wire()` and DOM Ownership

Instead of components or template bindings, Sparkle uses a `wire()` utility to bind DOM events to state logic:

```js
wire('inc', 'click', o => update(s => ({ ...s, count: s.count + 1 })))
```

#### How it works:

- Looks up `state.el.inc` (must exist)
- Adds an event listener for `click`
- Runs the handler with the latest decorated state

This lets you wire up behavior declaratively, but keep full control over:

- The elements (you defined them in HTML)
- The events (you choose which ones to listen for)
- The actions (you write them by hand)


---



### 🔍 How This Differs from Other Frameworks
Most frameworks wrap your event logic in layers of abstraction:
- React binds events through JSX and synthetic event delegation
- Svelte uses compiled `on:` directives tied to generated scope
- Vue adds listeners via templates and internal proxies

Sparkle avoids all of that:
- You **write HTML** directly
- You **own your elements** by referencing them with `document.getElementById()`
- You **wire behavior** directly with `wire(elKey, event, handler)`

There are no components, no lifecycle events, and no hidden reactivity around DOM events. You have full and literal control.

> Sparkle doesn't own the DOM — you do. It just helps you hook into it cleanly.


---



### 🧬 `registerApp()`

This utility is used in `main.js` to mount multiple apps:

```js
registerApp({ appRef, render, setup })
```

It:

- Calls `render(appRef.value)` initially
- Runs `setup()` (if provided) to attach events via `wire()`
- Subscribes to `appRef` using `fx()` so that future changes trigger re-rendering

This makes it easy to split apps into self-contained modules while keeping rendering and setup unified.


---


With these runtime tools, Sparkle gives you full architectural clarity — from state to render to DOM wiring — using nothing but plain JavaScript and functions you control.


## 📦 Anatomy of an App Module

Every app follows the same structure:

```js
export const render = ({ el, count }) => {
  el.countDisplay.textContent = count
}

export const setup = () => {
  wire('inc', 'click', o => update(s => ({ ...s, count: s.count + 1 })))
}

export { appRef }
```

This keeps behavior modular, testable, and swappable. It’s ideal for embedded widgets, demos, or feature-scoped UI.


---



---



## 🧾 Templates and HTML


## ⚡️ Blink Internals

Blink is Sparkle’s reactive core — a simple but powerful signal system for tracking and reacting to state changes. Unlike frameworks that rely on virtual DOMs or component trees, Blink focuses on direct, functional reactivity.


---



### 🔭 What Is Blink?

Blink is a minimal reactivity system inspired by signals, but without hidden machinery. It tracks dependencies, reruns functions when needed, and never interferes with how you structure your app.

Blink provides three core primitives:

```js
explicit(initial) // create a writable signal
fx(fn)            // reactive effect
implicit(fn)      // derived signal
```

These work together to update your UI in response to changes — with no diffing, no hooks, no proxies.


---



### 🔹 `explicit(initial)` – Writable Signals

This creates a reactive signal. It returns an object with a `.value` property:

```js
const count = explicit(0)
count.value = 1
```

Assigning to `.value` notifies any active `fx()` listeners.


---



### 🔹 `fx(fn)` – Reactive Effects

Wraps a function so it re-runs whenever a signal it accesses changes.

```js
fx(() => {
  console.log(count.value)
})
```

Every time `count.value` changes, this function re-executes.

This is how Sparkle apps re-render reactively:

```js
fx(() => render(appRef.value))
```

This will automatically re-run any time `appRef.value` is reassigned via `update()`.


---



### 🔹 `implicit(fn)` – Derived Signals

Creates a reactive value based on other signals.

```js
const double = implicit(() => count.value * 2)
console.log(double.value) // 2
```

Blink ensures that whenever `count.value` changes, `double.value` is recalculated.


---



### 🔄 Why This Matters

Blink avoids common framework abstractions:

- ❌ No proxies
- ❌ No VDOM
- ❌ No diffing
- ❌ No lifecycle juggling

It’s transparent:

- You access `.value` explicitly
- You know when effects run
- You can test it like any other function


---



### 📐 Internals at a Glance

Blink tracks dependencies by:

1. Temporarily sets a shared `activeEffect` while `fx()` runs
2. Logging every signal accessed via `.value`
3. Re-registering the effect with each of those signals

On update:

- `.value = newVal` triggers all subscribed effects
- No batching or async behavior — updates are synchronous and predictable


---



### 🧪 Testable and Transparent

You can test Blink state transitions like any other JS value:

```js
const count = explicit(0)
count.value = 1
expect(count.value).toBe(1)
```

And `fx()` effects can be tested for invocation timing or reactivity.


---



### ✨ Blink vs. Other Systems

| Feature             | Blink    | React (hooks) | Solid (signals) |
| ------------------- | -------- | ------------- | --------------- |
| Reactive Primitives | ✅ Yes    | ⚠️ Indirect   | ✅ Yes           |
| Triggers Re-renders | ✅ Direct | ✅ Via diffing | ✅ Direct        |
| Requires Compiler   | ❌ No     | ✅ Yes (JSX)   | ✅ Yes           |
| Works with Plain JS | ✅ Always | ❌             | ⚠️ Mostly       |

Blink gives you fine-grained control over reactivity without requiring a framework mindset or special language features.


---



### ✅ Summary

Blink is small, explicit, and tightly integrated into Sparkle’s architecture:

- Signals give you deterministic, testable state
- Effects rerun cleanly and predictably
- Derived values are just functions

Use `explicit()` for state, `fx()` for effects, and `implicit()` when you want derivation.

> Blink is what makes Sparkle reactive — and it never hides what it’s doing.

Sparkle doesn’t have a template syntax or JSX. You just write HTML like you normally would:

```html
<p id="count-display">0</p>
<button id="inc">Increment</button>
```

Then reference it manually in your beads or render function:

```js
el: {
  countDisplay: document.getElementById('count-display'),
  inc: document.getElementById('inc')
}
```

Reactive rendering is triggered by Blink. Your `render()` function mutates the DOM directly — no VDOM diffing or lifecycle juggling.

> In Sparkle, HTML is the template. You own it. You update it.

This results in fast, understandable, and transparent UI behavior.


---



## 🧪 Testing

Sparkle is designed for pure functional testing:

- Beads are pure and testable in isolation
- `bedazzle()` can simulate state updates
- No special environment or DOM mocking required

```js
let state = bedazzle({}, withCounter)
state = state.increment()
expect(state.count).toBe(1)
```

This encourages bead-driven test suites and enables apps to be built and validated incrementally.


---



## 📦 Utilities Deep Dive

Sparkle’s utility functions power the low-level behavior of the framework. They enable composability, extendability, reactivity, and safe layering — all without requiring a compiler or framework-specific syntax.

Let’s explore the key utilities that support the Sparkle runtime.


---



### ✨ `bedazzle(state, ...beads)`

This is the core composition function in Sparkle. It applies all bead functions to a base state object, layering their output immutably.

```js
const bedazzle = (state, ...fns) =>
  fns.reduce(
    (obj, fn) => ({ ...obj, ...fn(obj, newState => bedazzle(newState, ...fns)) }),
    state
  )
```

#### Why it's powerful:

- Beads can be aware of both current state and the re-decoration pathway
- Every update triggers a fresh decoration — no stale behavior
- Produces a fully composed object with all the bead logic applied

Beads can call their own methods recursively or pass decorated versions of the next state.


---



### 🧱 `createBead(name, fn)`

This helper is used to define beads with:

- A consistent name (for logging and debugging)
- Collision protection (warns if properties already exist)

```js
const withFlag = key =>
  createBead(`flag:${key}`, obj => ({
    [key]: obj[key] ?? false,
    [`toggle${capitalize(key)}`]: () => ({ ...obj, [key]: !obj[key] })
  }))
```

`createBead()` ensures that bead authors don’t accidentally overwrite other bead output, helping keep composition safe.


---



### 🔁 `composeUpdates(...fns)`

Composes a sequence of update functions that transform state objects. This is useful when you need to coordinate multiple updates — such as applying a behavior, re-decorating, then triggering a follow-up action.

```js
composeUpdates(
  o => decorate(o).increment(),
  decorate,
  o => o.countToggle()
)(state)
```

This works, but the list of callbacks can feel a little clunky — especially since you have to remember to re-decorate the state in the middle of the chain. This adds mental overhead for simple flows.

We're exploring ergonomics improvements to this utility in a future update to make chaining behavior cleaner and more intuitive.

This utility currently preserves clarity by:

- Keeping each function pure
- Chaining state transformations explicitly
- Making re-decoration part of the pipeline, not a side effect


---



### 🔤 `capitalize(str)`

A simple helper used to dynamically generate method names like `incrementCount`, `toggleFlag`, etc.

```js
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)
```

Used heavily in standard beads to support key-based naming.


---



### ⚠️ Deprecated / Internal Utilities

These are present in the repo but may be removed or folded in:

- `init.js`: Safe initializer — rarely needed in current patterns
- `decorate.js`: Manual call to `bedazzle()` — typically handled via `decorate()` from `createApp`

Use them only for legacy patterns or very low-level debugging.


---



### ✅ Summary

These utilities give Sparkle its compositional flexibility:

- `bedazzle()` applies logic safely and recursively
- `createBead()` standardizes reusable behavior
- `composeUpdates()` lets you build effect pipelines

Together, they make behavior layering predictable, testable, and expressive — the foundation for everything Sparkle does.


## 🛠️ Contribution Guide

Sparkle is designed to be extendable — and contributions are welcome, especially in the form of beads. This section explains how to contribute well-crafted, reusable behaviors and keep the ecosystem clean, expressive, and safe.


---



### 📦 What Can You Contribute?

Sparkle encourages contributions in the form of:

- ✅ Custom beads for common UI behaviors
- ✅ Standard beads (via `createBead`) for reusable logic
- ✅ Utility functions (rare, but considered)
- ✅ Documentation examples or patterns


---



### 🧩 What Makes a Good Bead?

A well-written bead should:

- Be **pure**: no side effects, no mutation
- Be **reentrant** (safe to reapply multiple times without unexpected behavior)
- Be **testable**: pure input → pure output
- Be **scoped**: one responsibility (toggle, track, increment)
- Avoid key collisions or naming ambiguity

Follow the **finite behavior rule**:

> If the behavior has a small, finite set of outcomes, include them. Otherwise, make it composable.

For example:
- `withFlag()` handles a boolean — toggle is the only reasonable action
- `withNumber()` could increment, decrement, reset, double, etc. — so it’s better split into separate beads


---



### 🧱 Standard Beads (using `createBead()`)

Standard beads should:

- Use `createBead(name, fn)`
- Include dynamic naming if needed (e.g. `toggleFoo`, `incrementBar`)
- Throw or warn on conflicting keys (handled automatically by `createBead`)

Standard beads live in the `standard-beads/` folder and can be:

- Configurable (e.g. pass `key`, `start`, `step`)
- Focused (e.g. `withFlag`, not `withEverything`)
- Layerable with other beads


---



### 📛 Naming Guidelines

- Use `withX()` for bead factories
- Use `camelCase` for property and method names
- Avoid overlapping names between standard beads
- Prefer intention-revealing names over abstractions


---



### 🧪 Testing Your Bead

Beads should have unit tests that:

- Verify initial state behavior
- Test each method (e.g. `.toggle()`, `.increment()`)
- Confirm no state leakage or shared references

You can use raw `bedazzle()` in your tests to simulate behavior:

```js
const state = bedazzle({}, withFlag('isVisible'))
const toggledState = state.toggleIsVisible()
expect(toggledState.isVisible).toBe(true)
```


---



### 📂 Folder and File Conventions

- Place your bead in `standard-beads/withSomething.js`
- Export it as a named export
- Add it to the central export file: `standard-beads/index.js`


---



### 📜 Submitting Your Bead (future public repo)

If Sparkle becomes a public project:

- Fork the repo
- Add your bead and test
- Include usage examples in a comment block
- Open a pull request with a clear title

Bead contributions will be reviewed for:

- Simplicity
- Composition safety
- Test coverage
- Usefulness to others


---



### 🤝 Community Philosophy

We value:

- Small, expressive building blocks
- A preference for clarity over cleverness
- Composable, testable, debug-friendly code

If your bead does something practical and reusable — share it. If your bead does something weird but interesting — share it anyway.

> Beads are what make Sparkle sparkle.


## 🧠 Design Philosophy

Sparkle is built around a few guiding principles:

- 🧩 **Behavior is composable.** Beads are the core unit of structure — not components or files.
- 🔄 **Re-decoration ensures behavior integrity.** You never lose a method or state field after update.
- 🧼 **State is transparent.** Everything is a plain JS object — no getters, proxies, or hidden layers.
- 🎯 **Explicit over clever.** You wire DOM. You write your render. You control behavior.
- 🔬 **Easy to test.** Pure functions mean no surprises, and you don’t need a DOM to validate behavior.

> It sparkles — because it doesn’t try to be magic.


---



## 📌 Summary

Sparkle gives you:

- 🧩 Functional composition via beads
- ⚡️ Reactive rendering via Blink
- 🔧 Full control over wiring and rendering
- ✅ Clean testability and state clarity
- 💡 A no-build workflow with plain HTML

Explore the apps. Contribute a bead. Build UI that does exactly what you mean. Welcome to Sparkle.

