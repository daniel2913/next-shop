import { createSlice } from "@reduxjs/toolkit";
import { createTypedAsyncThunk } from "./helper";

const initialState = {
	forceWindow: false,
	children: null,
	isOpen: false,
	title: "",
}

export const modalSlice = createSlice({
	name: "modal",
	initialState,
	reducers: {
		setOpen: (s, d: { payload: { val: boolean } }) => {
			s.isOpen = d.payload.val
			return s
		},

	}
})
