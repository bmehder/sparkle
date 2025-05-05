// standard-beads/withUndoRedo.js
import { createBead } from '../core/createBead.js'

/**
 * ⏪ withUndoRedo
 *
 * Adds basic undo/redo functionality to a Sparkle app.
 * Tracks a history stack of past states and exposes `undo` and `redo` actions.
 *
 * Notes:
 * - Only stores shallow copies of the full object.
 * - Should be added early in the bead list to capture meaningful changes.
 */
export const withUndoRedo = createBead('undoRedo', obj => {
	const past = obj.past ?? []
	const future = obj.future ?? []
	const snapshot = { ...obj }

	// Don't persist undo/redo stacks themselves
	delete snapshot.past
	delete snapshot.future
	delete snapshot.undo
	delete snapshot.redo

	return {
		past,
		future,

		// Call this after any change to push to history
		checkpoint: () => ({
			past: [...past, snapshot],
			future: [],
		}),

		// Undo to previous state
		undo: () => {
			if (past.length === 0) return {}
			const prev = past[past.length - 1]
			return {
				...prev,
				past: past.slice(0, -1),
				future: [snapshot, ...future],
			}
		},

		// Redo to more recent state
		redo: () => {
			if (future.length === 0) return {}
			const next = future[0]
			return {
				...next,
				past: [...past, snapshot],
				future: future.slice(1),
			}
		},
	}
})
