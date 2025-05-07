import { createApp } from '../core/createApp.js'
import { fx } from '../core/blink.js'

import { withTodos } from '../beads/withTodos.js'
import { withNewText } from '../beads/withNewText.js'

import { withDOM } from '../standard-beads/withDOM.js'
import { withDevPanel } from '../standard-beads/withDevPanel.js'
import { withPersistence } from '../standard-beads/withPersistence.js'

export const render = ({ el, todos, newText }) => {
	el.todoList.innerHTML = ''

	todos.forEach((todo, index) => {
		const li = document.createElement('li')
		li.className = todo.done ? 'done' : ''
		li.onclick = () => update(s => s.toggleTodo(index))

		const label = document.createElement('span')
		label.className = 'label'
		label.textContent = todo.text

		const del = document.createElement('button')
		del.textContent = '×'
		del.onclick = e => {
			e.stopPropagation()
			update(s => s.removeTodo(index))
		}

		li.append(label, del)
		el.todoList.appendChild(li)
	})

	el.newTodo.value = newText ?? ''
}

export const { appRef, update } = createApp({
	seed: { todos: [], newText: '' },
	beads: [
		// 🧠 Behavior beads
		withPersistence('TodoApp', ['todos', 'newText']),
		withTodos,
		withNewText,

		// 🧱 DOM / tooling
		withDOM('newTodo', 'todoList'),
		withDevPanel,
	],
	render,
	setup: ({ wire }) => {
		wire('newTodo', 'input', (o, e) => ({
			todos: o.todos,
			newText: e.target.value,
		}))

		wire('newTodo', 'keypress', (o, e) => {
			if (e.key === 'Enter' && o.newText.trim()) {
				update(s => ({
					...s.addTodo(s.newText.trim()),
					newText: '',
				}))
			}
		})
	},
	autoRender: false,
})

// 🧼 Initial render, then reactive updates
render(appRef.value)
fx(() => render(appRef.value))
