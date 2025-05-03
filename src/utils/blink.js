// 🧠 Current active subscriber (used for dependency tracking)
let subscriber = null

/**
 * 🪞 explicit
 *
 * Creates a reactive signal — a wrapper around a value with tracked subscriptions.
 * When `.value` is accessed inside a `fx()` context, the subscriber is recorded.
 * When `.value` is set, all subscribers are re-run.
 *
 * @param {*} value - The initial value
 * @returns {object} - A signal with get/set access and automatic reactivity
 */
export const explicit = value => {
	const subscriptions = new Set()

	return {
		// 👁️ Get the current value and track dependencies (if in fx)
		get value() {
			if (subscriber) {
				subscriptions.add(subscriber)
			}
			return value
		},

		// ✍️ Set the value and notify all subscribed reactions
		set value(newValue) {
			value = newValue
			subscriptions.forEach(fn => fn())
		},
	}
}

/**
 * 🪄 implicit
 *
 * A derived signal — automatically updates when its dependencies change.
 * Useful for computed values that depend on one or more other signals.
 *
 * @param {function} fn - A reactive getter function
 * @returns {object} - A reactive signal that updates when its inputs change
 */
export const implicit = fn => {
	const _implicit = explicit()
	fx(() => {
		_implicit.value = fn()
	})
	return _implicit
}

/**
 * ⚡ fx
 *
 * Registers a reactive effect. Any signals accessed inside `fn`
 * will register `fn` as a subscriber and re-run it when they change.
 *
 * @param {function} fn - The reactive function to track and run
 */
export const fx = fn => {
	subscriber = fn // 🔗 Set the global subscriber so signals can capture it
	fn() // 🏃‍♂️ Run the function once to track its dependencies
	subscriber = null // 🧹 Clear after tracking
}
