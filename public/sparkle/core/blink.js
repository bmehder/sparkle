// @ts-check

/**
 * 🌱 currentEffect
 *
 * Tracks the effect currently being registered.
 * When a signal is accessed during an effect, it adds the effect to its subscription list.
 */
let currentEffect = null

/**
 * 🪞 explicit
 *
 * Creates a reactive signal — a value that tracks and notifies effects on change.
 *
 * @param {*} initialValue - The initial value of the signal
 * @returns {{ value: * }} A reactive signal with a getter/setter
 A reactive signal with a getter/setter
 */
export function explicit(initialValue) {
	const effects = new Set()

	return {
		get value() {
			// Register current effect if inside a tracked fx
			if (currentEffect) effects.add(currentEffect)
			return initialValue
		},
		set value(nextValue) {
			initialValue = nextValue
			// Re-run all subscribed effects
			effects.forEach(effect => effect())
		},
	}
}

/**
 * ⚡ fx
 *
 * Registers a reactive effect. Any signals accessed during the execution of `effectFn`
 * will register that function as a dependency and re-run it when their value changes.
 *
 * @param {function(): void} effectFn - A reactive effect to track and re-run
 */
export function fx(effectFn) {
	currentEffect = effectFn
	effectFn()
	currentEffect = null
}

/**
 * 🪄 implicit
 *
 * Creates a derived signal that automatically updates when its input signals change.
 *
 * @param {function(): *} derive - A function that computes a derived value
 * @returns {{ value: * }} A reactive signal based on dependencies
 */
export function implicit(derive) {
	const result = explicit(undefined)
	fx(() => {
		result.value = derive()
	})
	return result
}
