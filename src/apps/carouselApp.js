/**
 * 🌠 Carousel App (Embeddable)
 *
 * Refactored Sparkle widget with clean beads and internal scoping.
 */

import { createApp } from '../runtime/createApp.js'
import { createBead } from '../utils/createBead.js'
import { withDevPanel } from '../standard-beads/withDevPanel.js'

// Export a function that builds an isolated carousel app
export const createCarouselApp = (containerId = 'carousel') => {
	// Scoped query helper
	const el = id => document.querySelector(`#${containerId} [data-${id}]`)

	// Declarative rendering
	const render = ({ el, index, slides }) => {
		el.display.textContent = slides[index]
	}

	// Initial state
	const seed = {
		index: 0,
		slides: [
			'Sparkle ran without a build step. My frontend team cried tears of joy. — Malik, Tech Lead @ Citrusbyte',
			'We replaced 900 lines of widget logic with six beads and a render function. It felt... unfair. — Nova, UI Lead at MintFlex',
			'Sparkle made our design system reactive without state management baggage. Beads for the win. — Julian, Design Engineer @ ProtoNest',
			'We used to inject behavior. Now we decorate it. Our team hasn’t looked back. — Leigh, Software Gardener @ StackGarden',
			"The moment we embedded our first Sparkle app into Drupal, I whispered 'finally.' — Anaïs, Tech Lead @ Fogpress",
			"Sparkle isn't just small — it's polite. It composes, it layers, and it gets out of the way. — Dev @ LatticeDrop",
		],
	}

	// DOM bead scoped to the widget container
	const withScopedDOM = createBead('carousel-dom', _obj => ({
		el: {
			display: el('display'),
			prev: el('prev'),
			next: el('next'),
		},
	}))

	// Carousel logic bead
	const withCarousel = createBead('carousel', obj => {
		const index = obj.index ?? 0
		const slides = Array.isArray(obj.slides) ? obj.slides : []

		return {
			index,
			next: () => ({
				index: (index + 1) % slides.length,
				slides,
			}),
			prev: () => ({
				index: (index - 1 + slides.length) % slides.length,
				slides,
			}),
		}
	})

	// Test interface bead to verify structure
	const withTestInterface = createBead('test:carousel', obj => {
		const valid =
			Array.isArray(obj.slides) &&
			typeof obj.index === 'number' &&
			typeof obj.next === 'function' &&
			typeof obj.prev === 'function'

		if (!valid) {
			throw new Error('❌ Carousel interface invalid')
		}
		return { _tests: 'passed' }
	})

	// Compose the app
	const { appRef, wire } = createApp({
		seed,
		beads: [withCarousel, withScopedDOM, withTestInterface, withDevPanel],
		render,
	})

	// Wire up events
	const setup = () => {
		wire('next', 'click', o => o.next())
		wire('prev', 'click', o => o.prev())
	}

	return { appRef, render, setup }
}
