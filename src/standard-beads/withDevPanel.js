// standard-beads/withDevPanel.js

import { createBead } from '../utils/createBead.js'

/**
 * 🌟 withDevPanel
 *
 * A developer tool bead that overlays a live-updating panel on the screen
 * showing the current decorated object state. Useful for debugging and
 * state inspection without console.logs or external devtools.
 */
export const withDevPanel = createBead('devpanel', obj => {
	const panel = document.getElementById('dev-panel') ?? createDevPanel()
	panel.textContent = JSON.stringify(obj, null, 2)
	return {}
})

/**
 * Creates and styles a floating panel on the bottom-right corner of the screen.
 * Only created once per session.
 */
function createDevPanel() {
	const panel = document.createElement('pre')
	panel.id = 'dev-panel'
	panel.style = `
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    width: 320px;
    max-height: 50vh;
    overflow: auto;
    background: #111;
    color: #0f0;
    font-size: 0.75rem;
    padding: 0.5rem;
    border: 1px solid lime;
    border-radius: 0.5rem;
    z-index: 9999;
  `
	document.body.appendChild(panel)
	return panel
}
