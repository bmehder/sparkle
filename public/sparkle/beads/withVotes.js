import { createBead } from '../core/createBead.js'

export const withVotes = createBead('votes', obj => {
	const upvotes = obj.upvotes ?? 0
	const downvotes = obj.downvotes ?? 0

	return {
		voteCount: upvotes,
		voteTotal: upvotes + downvotes,
		votePercent:
			upvotes + downvotes === 0
				? 0
				: Math.round((upvotes / (upvotes + downvotes)) * 100),
		upvote: () => ({ upvotes: upvotes + 1 }),
		downvote: () => ({ downvotes: downvotes + 1 }),
	}
})
