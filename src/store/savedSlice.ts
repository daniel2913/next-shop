import { clearSavedAction, toggleSavedAction } from "@/actions/saved";
import { createSlice } from "@reduxjs/toolkit";
import { createTypedAsyncThunk } from "./helper";
import { isValidResponse } from "@/helpers/misc";

const initialState: { saved: number[] } = {
	saved: []
}

export const toggleSaved = createTypedAsyncThunk<
	boolean, number>

	("saved/toggleSaved", async (id: number, api) => {
		const prev = api.getState().saved.saved
		const old = prev.includes(id)
		api.dispatch(savedSlice.actions._setSaved({ id, val: !old }))
		const val = await toggleSavedAction(id)
		if (typeof val === "boolean") {
			return api.fulfillWithValue(val)
		}
		api.dispatch(savedSlice.actions._setSaved({ id, val: old }))
		return api.rejectWithValue(val)
	}, {})

export const clearSaved = createTypedAsyncThunk<
	void>

	("saved/clearSaved", async (_, api) => {
		api.dispatch(savedSlice.actions._clearSaved())
		const val = await clearSavedAction()
		if (isValidResponse(val)) {
			return api.fulfillWithValue(val)
		}
		return api.rejectWithValue(val)
	}, {})

export const savedSlice = createSlice({
	name: "saved",
	initialState,
	reducers: {
		/**@warn Do not use dirrectly*/
		_setSaved: (s, d: { payload: { id: number, val: boolean } }) => {
			if (!d.payload.val) s.saved = s.saved.filter(i => i !== d.payload.id)
			else if (s.saved.includes(d.payload.id)) return
			else s.saved.push(d.payload.id)
			return s
		},
		/**@warn Do not use dirrectly*/
		_clearSaved: (s) => {
			s.saved = []
			return s
		}
	},
})
