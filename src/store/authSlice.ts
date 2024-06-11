import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
	name: "auth",
	initialState: {
		id: null as number | null,
		role: "user"
	},
	reducers: {
		setUser: (s, p: { payload: { id?: number, role?: string } }) => {
			s.id = p.payload.id ? p.payload.id : null
			s.role = p.payload.role ? p.payload.role : "user"
			return s
		}
	}
})
