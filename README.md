# ✨ Sparkle

> Composable, build-free UI widgets using behavior layering and reactive signals — no frameworks, no bundlers, no magic.

Sparkle is a microframework for building small, reactive apps (like buttons, carousels, counters, or todo lists) using plain HTML and JavaScript. It’s inspired by functional programming, not by React or the virtual DOM.

* ✅ No build step
* 🧹 Composable "beads" (behavior units)
* ⚡ Minimal reactive core (`explicit`, `fx`)
* 🧠 Useful for education and experimentation
* 🪄 Ideal for embeddable widgets and UI islands

## 🚀 Quick Start

Create an HTML file:

```html
<script type="module">
  import { createApp } from './sparkle/core/createApp.js'
  import { withToggle } from './sparkle/beads/withToggle.js'
  import { withDOM } from './sparkle/standard-beads/withDOM.js'

  const render = ({ el, isOn }) => {
    el.button.textContent = isOn ? 'Turn Off' : 'Turn On'
  }

  createApp({
    seed: { isOn: false },
    beads: [withToggle, withDOM('button')],
    render,
    setup: ({ wire }) => {
      wire('button', 'click', o => o.toggle())
    }
  })
</script>

<button id="button">Toggle</button>
```

Just drop it in your `public/` folder and you're done.

## 🧹 Beads: Layered Behavior

Beads are composable functions that add behavior to your app state.

```js
export const withCounter = createBead('counter', obj => {
  const count = obj.count ?? 0
  return {
    count,
    increment: () => ({ count: count + 1 }),
    decrement: () => ({ count: count - 1 })
  }
})
```

They’re named for a reason — you thread them together like jewelry.

## ⚡ Signals: Minimal Reactivity

Blink (Sparkle’s signal system) gives you `explicit()` and `fx()` for reactive state:

```js
const count = explicit(0)

fx(() => {
  console.log('Count is now:', count.value)
})

count.value++ // triggers the effect
```

Sparkle uses this internally to re-render your app automatically.

## 📆 Folder Structure

```
sparkle/
  core/              → Minimal runtime (no framework)
  beads/             → App-specific behaviors
  standard-beads/    → Shared, generic beads (DOM, logger, persistence)
  apps/              → Self-contained app modules
  styles/            → Global stylesheet (optional)
```

## 🧠 Why Sparkle?

Sparkle is less about competing with React, Vue, or Svelte — and more about **rethinking how small UI logic is composed**.

It’s great for:

* Embeddable widgets
* Teaching functional composition
* Building UI without the weight of a framework
* Thinking in behavior, not components

## 🧪 Example Apps

Check out `/apps/` for examples:

* `todoApp.js`
* `toggleApp.js`
* `voteApp.js`
* `carouselApp.js`

Each app defines its own logic, wiring, and render function — no framework required.

## ❤️ Philosophy

> Sparkle isn’t a framework. It’s a set of ideas — about smallness, layering, and clarity.

You can read more in the [`docs/`](./docs) folder or visit the [Why Sparkle](./docs/why-sparkle.md) essay.

## 🛠️ No Build. No Bundler. No Problem.

Just drop the `sparkle/` folder into your `public/` directory and start importing modules via `type="module"`.

It’s that simple.

## 🧪 License

MIT
