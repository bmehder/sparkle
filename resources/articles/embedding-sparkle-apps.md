# 🧱 Embedding Sparkle Apps in WordPress and Other CMSs

Sparkle’s zero-build, DOM-first architecture makes it an excellent choice for embedding interactive apps in existing platforms like **WordPress**, **Drupal**, **Squarespace**, or even plain HTML sites. This guide walks you through how to create a **self-contained Sparkle widget** that can be dropped into any environment with minimal friction.

---

## 🌟 Why Sparkle Fits This Use Case

* ✅ No build step or framework dependencies
* ✅ Pure JavaScript modules, run directly in the browser
* ✅ Manual DOM wiring — no shadow DOM or template abstractions
* ✅ Composable, isolated behavior through beads
* ✅ Declarative state logic that’s easy to debug and extend

You don’t need React, Vue, or Webpack — just a script tag and a div.

---

## 🧩 The Pattern: Self-contained Widget Functions

To embed a Sparkle app cleanly, structure it as a function that:

* Accepts a container ID
* Queries DOM elements **only inside that container**
* Defines a self-contained `render()` and `setup()`
* Returns `{ appRef, render }`

Let’s walk through a real example, then add a second one for comparison.

---

## 🌠 Example: `createCarouselApp()`

Here’s a full Sparkle carousel widget built for embed scenarios:

```js
import { createApp } from '../core/createApp.js'
import { createBead } from '../core/createBead.js'
import { withDevPanel } from '../standard-beads/withDevPanel.js'

export const createCarouselApp = (containerId = 'carousel') => {
  const el = id => document.querySelector(`#${containerId} [data-${id}]`)

  const render = ({ el, index, slides }) => {
    el.display.textContent = slides[index]
  }

  const seed = {
    index: 0,
    slides: [
      'Sparkle ran without a build step. My frontend team cried tears of joy.',
      'We replaced 900 lines of widget logic with six beads and a render function.',
      'Sparkle made our design system reactive without state management baggage.',
      'We used to inject behavior. Now we decorate it. Our team hasn’t looked back.',
      "The moment we embedded our first Sparkle app into Drupal, I whispered 'finally.'",
      "Sparkle isn't just small — it's polite. It composes, it layers, and it gets out of the way."
    ]
  }

  const withScopedDOM = createBead('carousel-dom', _obj => ({
    el: {
      display: el('display'),
      prev: el('prev'),
      next: el('next')
    }
  }))

  const withCarousel = createBead('carousel', obj => {
    const index = obj.index ?? 0
    const slides = Array.isArray(obj.slides) ? obj.slides : []

    return {
      next: () => ({ index: (index + 1) % slides.length }),
      prev: () => ({ index: (index - 1 + slides.length) % slides.length })
    }
  })

  const { appRef } = createApp({
    seed,
    beads: [withScopedDOM, withCarousel, withDevPanel],
    render,
    setup: ({ wire }) => {
      wire('next', 'click', o => o.next())
      wire('prev', 'click', o => o.prev())
    }
  })

  return { appRef, render }
}
```

---

## 🔌 Step-by-Step: Embedding in WordPress

### 1. Add HTML to Your Page

Use a Custom HTML block in the WordPress editor, or place this in a template:

```html
<div id="carousel" class="sparkle-widget">
  <div data-display></div>
  <button data-prev>← Previous</button>
  <button data-next>Next →</button>
</div>
```

### 2. Load the Script

If hosting Sparkle yourself:

```html
<script type="module">
  import { createCarouselApp } from '/sparkle/apps/carousel.js'
  createCarouselApp('carousel')
</script>
```

Or bundle the app using Vite or another tool if you need compatibility with older browsers.

---

## 🟢 Second Example: `createToggleApp()`

This is a minimal Sparkle toggle switch — perfect for embedded controls:

```js
import { createApp } from '../core/createApp.js'
import { createBead } from '../core/createBead.js'

export const createToggleApp = (containerId = 'toggle-widget') => {
  const el = id => document.querySelector(`#${containerId} [data-${id}]`)

  const render = ({ el, isOn }) => {
    el.status.textContent = isOn ? 'ON' : 'OFF'
    el.button.textContent = isOn ? 'Turn Off' : 'Turn On'
  }

  const seed = { isOn: false }

  const withScopedDOM = createBead('toggle-dom', _obj => ({
    el: {
      status: el('status'),
      button: el('button')
    }
  }))

  const withToggle = createBead('toggle', obj => ({
    toggle: () => ({ isOn: !obj.isOn })
  }))

  const { appRef } = createApp({
    seed,
    beads: [withScopedDOM, withToggle],
    render,
    setup: ({ wire }) => {
      wire('button', 'click', o => o.toggle())
    }
  })

  return { appRef, render }
}
```

### Usage:

```html
<div id="toggle-widget" class="sparkle-widget">
  <p data-status>OFF</p>
  <button data-button>Turn On</button>
</div>

<script type="module">
  import { createToggleApp } from '/sparkle/apps/toggle.js'
  createToggleApp('toggle-widget')
</script>
```

---

## ✅ Best Practices

* Use `data-*` attributes instead of classes or IDs for targeting
* Scope all DOM lookups to the container — no `document.getElementById()`
* Prefer `createBead()` for named behavior and dev logging
* Keep your styles scoped to `.sparkle-widget` to avoid leakage

---

## 💡 Beyond WordPress

This pattern works in:

* Shopify (custom apps)
* Drupal (blocks or views)
* Webflow (custom code embeds)
* Static HTML with zero dependencies

You can build entire UI features as **portable Sparkle widgets**, and drop them anywhere you control the DOM.

> Build once. Embed anywhere. No build step required.

---