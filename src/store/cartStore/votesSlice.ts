import { StateCreator } from "zustand"

type Votes = Record<number, number>
export interface VotesSlice {
	votes: Votes
	addVotes:(votes:Record<number,number>) => void
	setVote: (id: number, vote: number) => void
	reloadVotes: (ids: number[]) => void
	clearVotes: () => void
}

async function updateVote(id: number, vote: number): Promise<boolean> {
	const res = await fetch("/api/product/rating", {
		method: "POST",
		body: JSON.stringify({ id, vote }),
	})
	return res.ok
}

async function getVotes(ids: number[]): Promise<false | Record<number, number>> {
	const res = await fetch(`/api/product/rating?id=${encodeURI(ids.toString())}`, {
		method: "GET",
	})
	if (!res.ok) return false
	return res.json()
}

export const createVotesSlice: StateCreator<VotesSlice> = (set, get) => ({
	votes: {},
	addVotes: (votes:Record<number,number>) => {
		set(state => ({votes:{ ...state.votes, ...votes}}))
	},
	clearVotes: () => set((state)=>{
		return {...state,votes: {}}
	},true),
	setVote: async (id: number, vote: number) => {
		if (!(id in get().votes)) return true
		const res = await updateVote(id, vote)
		if (!res) return true
		set((state) => {
			return { votes: { ...state.votes, [id]: vote } }
		})
	},
	reloadVotes: async (ids: number[]) => {
		const votes = await getVotes(ids)
		if (!votes) return true
		set({ votes })
	},

})
