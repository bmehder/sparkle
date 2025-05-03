# ✅ Sparkle App Authoring Checklist

Use this checklist as your blueprint for building clean, composable Sparkle apps.

---

## 1. 📦 Define Initial State (`seed`)

- Include all state keys required by:
  - Your beads
  - Your `render()` function

```js
seed: { count: 0, label: 'Counter' }
```

---

## 2. 🧹 Compose Your Beads

### ✅ Use `createBead(name, fn)`

- Avoid leaking `...obj`
- Return only the partial state the bead manages

```js
export const withCounter = createBead('counter', obj => {
	const count = obj.count ?? 0
	return {
		count,
		increment: () => ({ count: count + 1 }),
		decrement: () => ({ count: count - 1 }),
	}
})
```

### ✅ Add DOM bindings

Use `withDOM(...)` for static or scoped DOM IDs.

```js
withDOM('countDisplay', 'inc', 'dec')
```

---

## 3. 🗼 Write a Pure `render()` Function

- Project state to DOM
- Never mutate state
- Guard against missing keys

```js
const render = ({ el, count }) => {
	if (el.countDisplay) {
		el.countDisplay.textContent = count
	}
}
```

---

## 4. 🔌 Create the App via `createApp()`

```js
const { appRef, wire } = createApp({
	seed,
	beads: [withCounter, withDOM('countDisplay', 'inc', 'dec')],
	render,
})
```

---

## 5. 🔗 Wire Up Events with `wire()`

- Treat wire handlers as pure functions from state to partial updates
- Compose updates with `...` if needed

```js
wire('inc', 'click', o => ({
	...o.increment(),
	...o.log?.(),
}))
```

---

## 6. 🚀 Export the App Entry

```js
export { appRef, render, setup }
```

Then register it:

```js
registerApp({ appRef, render, setup })
```

---

## 7. 🧚 Test It in Isolation

- Confirm initial render works
- Try all wire handlers
- Watch for:
  - `undefined.textContent` errors
  - key collisions (`[bead] overlaps keys: ...`)
  - missing DOM elements (watch for `withDOM` warnings)

---

## 8. 🧼 Use Optional Helpers

- `withLogger('log')` for dev state logging
- `withDOM(...)` for reusable DOM setup
- Scoped DOM access for widgets: `el('id')`
- Defensive `render()` guards for missing keys

---

## 9. 🧱 Use the Sparkle App Pattern

Use your `apps/SparkleAppPattern.js` file as a starter template.

---

Happy spark-building! ⚡
