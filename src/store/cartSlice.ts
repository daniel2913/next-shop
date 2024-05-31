import { setCartAction } from "@/actions/cart";
import { deffer } from "@/helpers/misc";
import { createSlice } from "@reduxjs/toolkit";
import { createTypedAsyncThunk } from "./helper";

const updateAccount = deffer(setCartAction, 500);

const initialState: { items: Record<number, number>, syncing: boolean } = {
	items: {},
	syncing: false
}



export const setAmount = createTypedAsyncThunk<
	void, { id: number, amnt: number, instant?: boolean }
>
	("cart/setAmmount", async (d, s) => {
		s.dispatch(cartSlice.actions._setAmmount({ id: d.id, amnt: d.amnt }))
		const res = await updateAccount(d.instant || false, s.getState().cart.items)
		if (!s.signal.aborted && res && "error" in res) {
			s.abort()
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
		_clearCart: (s) => {
			s.items = {}
		},
	},
	extraReducers(builder) {
		builder.addCase(setAmount.pending, (s, d) => {
			s.syncing = true
			return s
		})
		builder.addCase(setAmount.rejected, (s, d) => {
			s.syncing = false
			return s
		})
		builder.addCase(setAmount.fulfilled, (s, d) => {
			s.syncing = false
			return s
		})
	},
})



export const cartReducers = cartSlice.reducer
