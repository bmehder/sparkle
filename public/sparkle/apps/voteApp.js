import { createApp } from '../core/createApp.js'
import { withVotes } from '../beads/withVotes.js'
import { withDOM } from '../standard-beads/withDOM.js'
import { withDevPanel } from '../standard-beads/withDevPanel.js'

const render = ({ el, voteCount, voteTotal, votePercent }) => {
	el.voteCount.textContent = voteCount
	el.voteTotal.textContent = voteTotal
	el.votePercent.textContent = votePercent
}

createApp({
	seed: { upvotes: 0, downvotes: 0 },
	beads: [
		withVotes,
		withDOM('voteCount', 'voteTotal', 'votePercent', 'upBtn', 'downBtn'),
		withDevPanel,
	],
	render,
	setup: ({ wire }) => {
		wire('upBtn', 'click', o => o.upvote())
		wire('downBtn', 'click', o => o.downvote())
	},
})
