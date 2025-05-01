# Sparkle UI Framework

**Sparkle** is a minimalist, functional UI microframework designed to prioritize clarity, composability, and full developer control. Built on top of [`bedazzle`](https://github.com/bmehder/bedazzle) for behavior composition and [`slank`](https://github.com/bmehder/slank) for reactivity, Sparkle offers an expressive alternative to complex frontend ecosystems.

## Features

- **Composable UI Behavior:** Uses "beads" — simple, reusable functions that encapsulate behavior.
- **Functional Core:** Emphasizes pure functions and immutable state.
- **Reactive Signals:** Slank powers reactive updates with no virtual DOM or proxy magic.
- **Build-Free Development:** No bundlers, transpilers, or project scaffolding required.
- **Standard Beads Library:** A curated collection of reusable logic patterns.

## Getting Started

```bash
git clone https://github.com/bmehder/sparkle.git
cd sparkle
npm install
npm run dev
```

Then open the example apps in `src/`.

## Included Examples

- Toggle app
- Counter app
- Timer app
- Carousel widget

These demos showcase how to build UI with Sparkle’s functional, reactive approach.

## Philosophy

Sparkle is for developers who prefer directness over abstraction and value reading code as much as writing it. It avoids assumptions about architecture and leaves you in full control.

## Documentation

See [`docs/`](./docs) for guides, examples, and the original press release.

## License

[MIT](./LICENSE)