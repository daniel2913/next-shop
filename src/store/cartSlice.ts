import { setCartAction } from "@/actions/cart";
import { deffer, isValidResponse } from "@/helpers/misc";
import { createSlice } from "@reduxjs/toolkit";
import { createTypedAsyncThunk } from "./helper";

const updateAccount = deffer(setCartAction, 500);

const initialState: { items: Record<number, number> } = {
	items: {},
}

export const setAmount = createTypedAsyncThunk<
	void, { id: number, amnt: number, instant?: boolean }
>
	("cart/setAmmount", async (d, s) => {
		s.dispatch(cartSlice.actions._setAmmount({ id: d.id, amnt: d.amnt }))

		const res = await updateAccount(d.instant || false, s.getState().cart.items)
		if (!isValidResponse(res)) {
			if (res.title === "Not Authenticated")
				return s.fulfillWithValue(undefined)
			return s.rejectWithValue(res)
		}
		return s.fulfillWithValue(undefined)
	})

export const clearCart = createTypedAsyncThunk<
	void, void
>
	("cart/setAmmount", async (d, s) => {
		s.dispatch(cartSlice.actions._clearCart())
		const res = await setCartAction({})
		if (res && "error" in res) {
			return s.rejectWithValue(res)
		}
		return s.fulfillWithValue(undefined)
	})

export const setCart = createTypedAsyncThunk<
	void, Record<number, number>
>
	("cart/setCart", async (d, s) => {
		s.dispatch(cartSlice.actions._setCart(d))
		const res = await setCartAction(d)
		if (res && "error" in res) {
			return s.rejectWithValue(res)
		}
		return s.fulfillWithValue(undefined)
	})


export const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		/**@warn Do not use dirrectly!*/
		_setAmmount: (s, d: { payload: { id: number, amnt: number } }) => {
			const { id, amnt } = d.payload
			if (amnt <= 0) delete s.items[id]
			else s.items[id] = amnt
			return s
		},
		/**@warn Do not use dirrectly!*/
		_clearCart: (s) => {
			s.items = {}
		},
		/**@warn Do not use dirrectly!*/
		_setCart: (s, d: { payload: Record<number, number> }) => {
			s.items = d.payload
			return s
		}
	},
})
