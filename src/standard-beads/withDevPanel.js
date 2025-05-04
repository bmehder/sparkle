import { createBead } from '../utils/createBead.js'

/**
 * 🌟 withDevPanel
 *
 * A developer tool bead that overlays a live-updating panel on the screen
 * showing the current decorated object state.
 */
export const withDevPanel = createBead('devpanel', obj => {
	const existing = document.getElementById('dev-panel')
	const panel = existing ?? createDevPanel()
	const body = document.getElementById('dev-panel-body')
	if (body && !panel.classList.contains('hidden')) {
		body.textContent = JSON.stringify(obj, null, 2)
	}
	return {}
})

// ------------------------------
// Style Objects
// ------------------------------

const panelStyles = {
	position: 'fixed',
	minWidth: '200px',
	minHeight: '100px',
	maxWidth: '90vw',
	maxHeight: '90vh',
	overflow: 'auto',
	resize: 'both',
	background: '#111',
	color: '#0f0',
	fontSize: '0.75rem',
	border: '1px solid lime',
	borderRadius: '0.5rem',
	zIndex: '9999',
	transition: 'opacity 0.3s ease, transform 0.3s ease',
}

const headerStyles = {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	padding: '0.25rem 0.5rem',
	background: '#222',
	color: '#0f0',
	fontWeight: 'bold',
	cursor: 'move',
	userSelect: 'none',
	height: '1.5rem',
}

const rangeStyles = {
	marginLeft: '1rem',
	background: '#0f0',
	height: '4px',
	borderRadius: '2px',
	cursor: 'pointer',
	flexGrow: '1',
	marginRight: '0.5rem',
	maxWidth: '100px',
}

const buttonStyles = {
	marginLeft: '0.5rem',
	background: 'none',
	border: 'none',
	color: '#0f0',
	cursor: 'pointer',
	fontSize: '1rem',
	lineHeight: '1',
}

const toggleButtonStyles = {
	position: 'fixed',
	bottom: '1rem',
	right: '1rem',
	background: '#111',
	color: '#0f0',
	border: '1px solid lime',
	padding: '0.25rem 0.5rem',
	borderRadius: '4px',
	cursor: 'pointer',
	zIndex: '10000',
}

// ------------------------------
// DOM Creation & Wiring
// ------------------------------

function createDevPanel() {
	const panel = document.createElement('div')
	panel.id = 'dev-panel'
	applyStyles(panel, panelStyles)

	let saved = null
	try {
		saved = JSON.parse(localStorage.getItem('devPanelPos'))
		if (saved?.width) panel.style.width = `${saved.width}px`
		if (saved?.height) panel.style.height = `${saved.height}px`
		panel.style.opacity = saved?.opacity ?? '1'
	} catch {
		panel.style.bottom = '1rem'
		panel.style.right = '1rem'
		panel.style.opacity = '1'
	}

	const header = createHeader(panel, saved)
	panel.appendChild(header)

	const body = document.createElement('pre')
	body.id = 'dev-panel-body'
	body.style.margin = '0'
	body.style.padding = '0.5rem'
	panel.appendChild(body)

	panel.style.visibility = 'visible'
	document.body.appendChild(panel)

	restorePosition(panel, header, saved)
	setupDrag(panel, header)
	new ResizeObserver(() => savePanelState(panel)).observe(panel)

	return panel
}

function createHeader(panel, saved) {
	const header = document.createElement('div')
	applyStyles(header, headerStyles)

	const title = document.createElement('span')
	title.textContent = '💡 Sparkle DevPanel'
	header.appendChild(title)

	const range = document.createElement('input')
	range.type = 'range'
	range.min = '0.2'
	range.max = '1'
	range.step = '0.05'
	range.value = panel.style.opacity
	range.title = 'Adjust panel opacity'
	applyStyles(range, rangeStyles)
	range.style.appearance = 'none'
	range.addEventListener('input', () => {
		panel.style.opacity = range.value
		savePanelState(panel)
	})
	header.appendChild(range)

	const toggleBtn = document.createElement('button')
	toggleBtn.textContent = '⤬'
	toggleBtn.title = 'Toggle Dev Panel'
	applyStyles(toggleBtn, buttonStyles)
	toggleBtn.addEventListener('click', () => hidePanel(panel, range))
	header.appendChild(toggleBtn)

	document.addEventListener('keydown', e => {
		if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
			e.preventDefault()
			panel.classList.contains('hidden')
				? showPanel(panel, range)
				: hidePanel(panel, range)
		}
	})

	return header
}

function hidePanel(panel, range) {
	panel.classList.add('hidden')
	panel.style.opacity = '0'
	panel.style.pointerEvents = 'none'
	if (!document.getElementById('dev-toggle')) {
		const showBtn = document.createElement('button')
		showBtn.id = 'dev-toggle'
		showBtn.textContent = '🧪'
		showBtn.title = 'Show Dev Panel'
		applyStyles(showBtn, toggleButtonStyles)
		document.body.appendChild(showBtn)
		showBtn.addEventListener('click', () => {
			showPanel(panel, range)
			showBtn.remove()
		})
	}
}

function showPanel(panel, range) {
	panel.classList.remove('hidden')
	panel.style.opacity = range.value
	panel.style.pointerEvents = 'auto'
	panel.style.visibility = 'visible'
}

function applyStyles(el, styles) {
	Object.assign(el.style, styles)
}

function restorePosition(panel, header, saved) {
	requestAnimationFrame(() => {
		if (saved?.x != null && saved?.y != null) {
			const headerHeight = header.offsetHeight || 0
			panel.style.left = `${saved.x}px`
			panel.style.top = `${saved.y - headerHeight}px`
			panel.style.bottom = 'auto'
			panel.style.right = 'auto'
		}
	})
}

function setupDrag(panel, header) {
	let offsetX = 0
	let offsetY = 0
	let dragging = false

	header.addEventListener('mousedown', e => {
		if (e.target !== header && e.target.tagName !== 'SPAN') return
		dragging = true
		document.body.style.userSelect = 'none'
		offsetX = e.clientX - panel.offsetLeft
		offsetY = e.clientY - panel.offsetTop
	})

	document.addEventListener('mousemove', e => {
		if (!dragging) return
		const x = e.clientX - offsetX
		const y = e.clientY - offsetY
		panel.style.left = `${x}px`
		panel.style.top = `${y}px`
		panel.style.bottom = 'auto'
		panel.style.right = 'auto'
		savePanelState(panel)
	})

	document.addEventListener('mouseup', () => {
		dragging = false
		document.body.style.userSelect = ''
	})
}

function savePanelState(panel) {
	const rect = panel.getBoundingClientRect()
	const x = rect.left
	const y = rect.top
	const width = panel.offsetWidth
	const height = panel.offsetHeight
	const opacity = panel.style.opacity
	localStorage.setItem(
		'devPanelPos',
		JSON.stringify({ x, y, width, height, opacity })
	)
}
