import { createApp } from '../runtime/createApp.js'
import { withTodos } from '../beads/withTodos.js'
import { withNewText } from '../beads/withNewText.js'
import { withLogger } from '../standard-beads/withLogger.js'
import { withDOM } from '../standard-beads/withDOM.js'

export const render = ({ el, todos, newText }) => {
	el.todoList.innerHTML = ''

	todos.forEach((todo, index) => {
		const li = document.createElement('li')
		li.textContent = todo.text
		li.className = todo.done ? 'done' : ''
		li.onclick = () => update(s => s.toggleTodo(index))

		const del = document.createElement('button')
		del.textContent = '×'
		del.onclick = e => {
			e.stopPropagation() // prevent li.onclick from firing
			update(s => s.removeTodo(index))
		}

		li.appendChild(del)
		el.todoList.appendChild(li)
	})

	el.newTodo.value = newText ?? ''
}

export const { appRef, wire, update } = createApp({
	seed: { todos: [] },
	beads: [
		withTodos,
		withNewText,
		withLogger('log'),
		withDOM('new-todo', 'todo-list'),
		obj => ({
			el: {
				newTodo: document.getElementById('new-todo'),
				todoList: document.getElementById('todo-list'),
			},
		}),
	],
	render,
})

export const setup = () => {
	wire('newTodo', 'input', (o, e) => ({
		todos: o.todos,
		newText: e.target.value,
	}))

	wire('newTodo', 'keypress', (o, e) => {
		if (e.key === 'Enter' && o.newText.trim()) {
			return o.addTodo(o.newText.trim())
		}
	})
}