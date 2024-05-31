import { updateVoteAction } from "@/actions/rating";
import { createSlice } from "@reduxjs/toolkit";
import { createTypedAsyncThunk } from "./helper";


const initialState: { votes: Record<number, number> } = {
	votes: {}
}

export const setVote = createTypedAsyncThunk<
	{ voters: number, rating: number }, { id: number, val: number }
>
	("votes/setVote", async ({ id, val }, api) => {

		const votes = api.getState().votes.votes

		if (val < 1 || val > 5) return api.rejectWithValue({
			error: "Vote must be between 1 and 5",
			title: "Validation Error",
		})

		if (!(id in votes)) return api.rejectWithValue({
			error: "You can only rate products you bought",
			title: "Not Allowed",
		})

		const old = votes[id]
		api.dispatch(votesSlice.actions._setVote({ id, val }))
		const res = await updateVoteAction(id, val)

		if (!res || "error" in res) {
			api.dispatch(votesSlice.actions._setVote({ id, val: old }))
			return api.rejectWithValue(res || { title: "Unknown Error", error: "Something bad happened" })
		}

		return api.fulfillWithValue(res)
	})


export const votesSlice = createSlice({
	name: "votes",
	initialState,
	reducers: {
		/**@warn Do not use dirrectly*/
		_setVote: (s, d: { payload: { id: number, val: number } }) => {
			s.votes[d.payload.id] = d.payload.val
			return s
		},
	},
	extraReducers(builder) {
		builder.addCase(setVote.rejected, (s, d) => {
		})
	},
})

export const votesReducers = votesSlice.reducer

