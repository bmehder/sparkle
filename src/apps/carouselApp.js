
/**
 * 🎠 Carousel App (Embeddable)
 * 
 * This Sparkle app is designed as a self-contained, embeddable widget.
 * It demonstrates how to scope DOM queries inside a container and expose
 * an interface for mounting on any page.
 */

import { createApp } from '../runtime/createApp.js'

// Export a function that builds an isolated carousel app
export const createCarouselApp = (containerId = 'carousel') => {
  // Scoped query helper (queries within container only)
  const el = id => document.querySelector(`#${containerId} [data-${id}]`)

  // Declarative rendering
  const render = ({ el, index, slides }) => {
    el.display.textContent = slides[index]
  }

  // Initial state
  const seed = {
    index: 0,
    slides: ['One', 'Two', 'Three']
  }

  // DOM bead scoped to the widget container
  const withDOM = obj => ({
    el: {
      display: el('display'),
      prev: el('prev'),
      next: el('next')
    }
  })

  // Carousel bead: navigation logic
  const withCarousel = obj => {
    const { index, slides } = obj
    return {
      index,
      next: () => ({ ...obj, index: (index + 1) % slides.length }),
      prev: () => ({ ...obj, index: (index - 1 + slides.length) % slides.length })
    }
  }

  // Compose the app
  const { appRef, decorate, update, wire } = createApp({
    seed,
    beads: [withCarousel, withDOM],
    render
  })

  // Wire up events
  const setup = () => {
    wire('next', 'click', o => decorate(o).next())
    wire('prev', 'click', o => decorate(o).prev())
  }

  return { appRef, render, setup }
}
