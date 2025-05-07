# 🌟 Why Sparkle?

> A lightweight architecture for composable behavior, embeddable UIs, and functional thinking.

---

## 🚫 What Sparkle *isn't*

* It isn't trying to replace React, Vue, or Svelte.
* It isn't a full SPA framework.
* It doesn't do routing, hydration, or SSR.
* It won't replace your build system.

And that's the point.

---

## ✅ What Sparkle *is*

* A tiny runtime for composing behavior as **pure functions**
* A declarative layer you can drop into any HTML page
* A framework-free way to build widgets, carousels, and mini-apps
* An approachable introduction to **functional programming in the browser**

---

## 🧠 A Mindset, Not Just a Tool

Sparkle is designed around a simple idea:

> You can build interactive interfaces by **layering behaviors** — not managing components.

It asks:

* What if UI state was just data?
* What if every behavior was a function?
* What if we could compose interactivity like we compose CSS classes?

---

## 🧩 Beads, Not Components

Sparkle apps are made of **beads**: tiny behavior units that decorate the app state.

```js
const withCounter = (state) => ({
  count: 0,
  increment: () => ({ count: state.count + 1 })
})
```

Beads are:

* Pure
* Composable
* Debuggable

They form a **decorator cascade** — building up behavior layer by layer.

---

## 🧪 Teach Functional Programming with Real UI

Most FP tutorials stop at list filtering or sum reductions.

Sparkle picks up where they leave off:

* Compose your logic with pure functions
* Wire it to real DOM events
* Render with a declarative `render(state)` function

FP becomes tangible — not theoretical.

---

## 🔗 Embeddable by Design

Sparkle apps can live in a single HTML file:

```html
<script type="module">
  import { createApp } from '/sparkle/core/createApp.js'
  ...
</script>
```

No bundler. No build step. No lock-in.

That makes it perfect for:

* Widgets
* Docs
* Design systems
* Legacy integrations

---

## 🪶 Lightweight, Transparent, Intentional

Sparkle is small enough to read.
Simple enough to teach.
Powerful enough to rethink how you build interfaces.

It's not a trend. It's a tool for thinking clearly.

---

## ✨ Who Is Sparkle For?

* Developers who like pure functions
* Teachers and learners exploring functional concepts
* Designers and engineers collaborating on behavior
* Engineers who want just enough interactivity — without the framework tax

---

## 🚀 Start Small. Think Clearly. Compose Behavior.

That’s what Sparkle is for.

> Sparkle isn't here to compete. It's here to clarify.
