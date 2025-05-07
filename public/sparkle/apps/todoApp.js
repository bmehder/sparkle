import { createApp } from '../core/createApp.js'
import { fx } from '../core/blink.js'

import { withTodos } from '../beads/withTodos.js'
import { withNewText } from '../beads/withNewText.js'

import { withDOM } from '../standard-beads/withDOM.js'
import { withDevPanel } from '../standard-beads/withDevPanel.js'
import { withPersistence } from '../standard-beads/withPersistence.js'

console.log('[todoApp] loaded')

export const renderTodo = ({ el, todos, newText }) => {
	console.log('[todoApp] fx triggered')
	el.todoList.innerHTML = ''

	todos.forEach((todo, index) => {
		const li = document.createElement('li')
		li.className = todo.done ? 'done' : ''
		li.onclick = () => updateTodo(s => s.toggleTodo(index))

		const label = document.createElement('span')
		label.className = 'label'
		label.textContent = todo.text

		const del = document.createElement('button')
		del.textContent = '×'
		del.onclick = e => {
			e.stopPropagation()
			updateTodo(s => s.removeTodo(index))
		}

		li.append(label, del)
		el.todoList.appendChild(li)
	})

	el.newTodo.value = newText ?? ''
}

export const { appRef: todoRef, update: updateTodo } = createApp({
	seed: { todos: [], newText: '' },
	beads: [
		withPersistence('Sparkle:Todos', ['todos', 'newText']),
		withTodos,
		withNewText,
		withDOM('newTodo', 'todoList'),
		withDevPanel,
	],
	render: renderTodo,
	setup: ({ wire }) => {
		wire('newTodo', 'input', (o, e) => ({
			todos: o.todos,
			newText: e.target.value,
		}))

		wire('newTodo', 'keypress', (o, e) => {
			if (e.key === 'Enter' && o.newText.trim()) {
				updateTodo(s => ({
					...s.addTodo(s.newText.trim()),
					newText: '',
				}))
			}
		})
	},
	autoRender: false,
})

renderTodo(todoRef.value)
fx(() => renderTodo(todoRef.value))
