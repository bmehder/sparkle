import { createBead } from '../core/createBead.js'

/**
 * 🧩 withTodos
 *
 * Adds todo list behavior. Respects existing todos (e.g. from persistence).
 */
export const withTodos = createBead('todos', obj => {
	const todos = Array.isArray(obj.todos) ? obj.todos : []

	return {
		todos,
		addTodo: text => ({
			todos: [...todos, { text, done: false }],
		}),
		toggleTodo: index => ({
			todos: todos.map((t, i) => (i === index ? { ...t, done: !t.done } : t)),
		}),
		removeTodo: index => ({
			todos: todos.filter((_, i) => i !== index),
		}),
	}
})
