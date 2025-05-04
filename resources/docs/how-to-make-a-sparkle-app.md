# ✨ How to Make a Sparkle App

Welcome! If you’re curious about Sparkle — a tiny JavaScript UI toolkit — but don’t want to spend days learning a whole new system, you’re in the right place.

Sparkle lets you build apps with just HTML, CSS, and JavaScript. No build step. No weird syntax. No giant runtime.

This tutorial walks you through making your first Sparkle app — step by step.

---

## 🧠 What Is Sparkle?

Sparkle is a minimal UI architecture built on three principles:

* **State as a plain object**
* **Behavior as composable functions ("beads")**
* **The DOM as your actual UI (no VDOM)**

If you can write JavaScript, you can write a Sparkle app.

---

## 🎯 What We’ll Build

A simple **Mood Tracker**:

* Select a mood from a dropdown
* Add it to a history list
* Clear the list

---

## 📄 Step 1: Basic HTML

Start with your HTML structure:

```html
<div id="mood-tracker">
  <select id="select">
    <option>🙂</option>
    <option>😐</option>
    <option>🙃</option>
  </select>
  <button id="add">Add Mood</button>
  <button id="clear">Clear</button>
  <ul id="list"></ul>
</div>
```

Sparkle doesn’t render your HTML — you write it directly.

---

## 🧩 Step 2: Add Behavior with Beads

Now let’s define a couple beads to manage mood state:

```js
const withMoodInput = createBead("moodInput", obj => ({
  currentMood: obj.currentMood ?? "🙂",
}))

const withMoods = createBead("moods", obj => ({
  moods: ["🙂", "😐", "🙃"],
  history: obj.history ?? [],
  addMood: () => ({ history: [...obj.history, obj.currentMood] }),
  clearHistory: () => ({ history: [] }),
}))
```

Each bead returns a **partial state object** — Sparkle merges them all together.

---

## ⚙️ Step 3: Set Up the App

Now let’s initialize the app using `createApp()`:

```js
const { appRef, update, wire, decorate } = createApp({
  seed: {},
  beads: [
    withDOM("select", "add", "clear", "list"),
    withMoodInput,
    withMoods
  ],
  render,
})
```

We’ll define `render()` next.

---

## 🖼️ Step 4: Render the UI

```js
function render(state) {
  const { el, history } = state
  el.select.value = state.currentMood
  el.list.innerHTML = ""
  history.forEach(mood => {
    const li = document.createElement("li")
    li.textContent = mood
    el.list.appendChild(li)
  })
}
```

You update the DOM manually — just like you normally would. Sparkle doesn’t interfere.

---

## 🔗 Step 5: Wire Up Events

Connect UI events to behavior using `wire()`:

```js
wire("add", "click", state => state.addMood())
wire("clear", "click", state => state.clearHistory())
wire("select", "change", (state, e) => ({ currentMood: e.target.value }))
```

Event handlers return new partial state. Sparkle updates and re-decorates it.

---

## ⚡ Optional: Add Reactivity with Blink

By default, you have to call `render()` manually after updates.
But Sparkle comes with a tiny reactive system called **Blink**:

```js
fx(() => render(appRef.value))
```

That line sets up an automatic rerender when state changes.
You can stop here — or explore signals more deeply later:

```js
const count = explicit(0)
const doubled = implicit(() => count.value * 2)
fx(() => console.log(doubled.value))
```

---

## ⚡ Upgrade to Reactivity (Optional but Fun)

So far, you've manually called `render()` whenever your app updates.

But Sparkle comes with **Blink** — a tiny reactive layer that tracks changes and automatically re-runs effects when state changes.

### ✅ 1. Add a single line after creating the app

Right after `createApp(...)`:

```js
fx(() => render(appRef.value))
```

This tells Sparkle: *whenever `appRef.value` changes, re-run this function.*

You no longer need to call `render()` manually after updates — it's now automatic.

---

### 🧼 2. Remove manual render() calls

Because `fx()` handles rendering, you can delete any manual `render()` calls (if you had any).

Everything else — `wire()`, your `beads`, your `state` — stays the same.

---

### 🧠 What Just Happened?

Sparkle tracks state in a reactive container called `explicit()`. When you update it, effects created with `fx()` re-run. This gives you the reactivity of frameworks like React or Vue, but without their complexity.

You opted into reactivity — and can opt out at any time.

> You now have a fully reactive UI, powered by pure functions, without a build step. ✨

---

## ✅ Recap: The Sparkle App Pattern

1. Write semantic HTML
2. Define beads for your state + behavior
3. Use `createApp({ seed, beads, render })`
4. Connect events with `wire()`
5. Render the DOM however you like
6. (Optional) Add reactivity with `fx()`

---

## 🚀 What Next?

* Add a dev panel with `withDevPanel`
* Log state changes with `withLogger("label")`
* Share beads across apps — they’re just functions
* Write tests — your app logic is fully isolated from the DOM

Sparkle is small on purpose.
And now you’ve written a complete app with it.

Go build something that Sparkles ✨
