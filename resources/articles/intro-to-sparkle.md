# ✨ Intro to Sparkle

**Sparkle** is a minimal, functional UI microframework for the browser. It gives you full control over your HTML, state, and behavior — without a virtual DOM, compiler, or build step.

It’s built for developers who:

* Prefer direct DOM control over templates or components
* Value pure functions and composable state
* Want to skip build tooling and ship fast

If you like working with plain JavaScript — but wish you had just enough structure to compose clean, reactive UI — Sparkle is for you.

---

## 🧩 What Is a Bead?

A **bead** is a tiny, composable behavior function.

You don’t write components in Sparkle — you write beads:

```js
const withToggle = obj => ({
  isOn: obj.isOn ?? false,
  toggle: () => ({ ...obj, isOn: !obj.isOn })
})
```

Each bead adds a small capability (like toggling, counting, logging). You can combine as many as you want into a single app.

---

## ⚡ How State Works

State in Sparkle is:

* **Plain**: Just JavaScript objects
* **Immutable**: Every update returns a new object
* **Reactive**: Changes trigger your `render()`

Sparkle doesn’t use proxies or signals-in-everything. Instead, your app uses `update()` and `render()` directly — with no hidden machinery.

```js
update(s => ({ ...s, count: s.count + 1 }))
```

You can always inspect, test, or log state. It’s just an object.

---

## 🧪 A Complete Example

Here’s a minimal counter app using Sparkle:

```js
import { createApp } from './core/createApp.js'
import { createBead } from './core/createBead.js'

const withCounter = createBead('counter', obj => ({
  count: obj.count ?? 0,
  increment: () => ({ ...obj, count: obj.count + 1 })
}))

const render = ({ el, count }) => {
  el.output.textContent = count
}

const { appRef } = createApp({
  seed: { count: 0 },
  beads: [
    createBead('dom', () => ({
      el: {
        output: document.getElementById('output'),
        button: document.getElementById('inc')
      }
    })),
    withCounter
  ],
  render,
  setup: ({ wire }) => {
    wire('button', 'click', o => o.increment())
  }
})
```

With this HTML:

```html
<p id="output">0</p>
<button id="inc">Increment</button>
```

That’s it. No bundler, no compiler, no JSX — just JavaScript, behavior, and DOM.

---

## 🌍 Try It Yourself

Visit the live demo page:

👉 [sparkle-ashen.vercel.app](https://sparkle-ashen.vercel.app/)

You’ll find several widgets running side by side — each a standalone Sparkle app using the same principles.

---

## ✅ Summary

* Sparkle gives you reactive UI without complexity
* Apps are just functions and DOM
* Beads are small, pure, composable units of behavior
* No build step required

> If you can write JavaScript, you can write Sparkle.
