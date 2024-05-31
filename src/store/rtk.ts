import { configureStore } from "@reduxjs/toolkit"
import { useDispatch, useSelector, useStore } from "react-redux"
import { cartSlice, clearCart, setAmount } from "./cartSlice";
import { clearSaved, savedSlice, toggleSaved } from "./savedSlice";
import { setVote, votesSlice } from "./votesSlice";


export const makeStore = (props: { saved: { saved: number[] }, votes: { votes: Record<number, number> }, cart: { items: Record<number, number>, syncing: boolean } }) => {
	if (typeof window !== "undefined") {

	}
	const store = configureStore({
		reducer: {
			saved: savedSlice.reducer,
			votes: votesSlice.reducer,
			cart: cartSlice.reducer
		},
		preloadedState: {
			...props
		}
	})

	return store
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]


export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()

export const actions = {
	saved: {
		...savedSlice.actions,
		toggleSaved,
		clearSaved,
	},
	votes: {
		...votesSlice.actions,
		setVote,
	},
	cart: {
		...cartSlice.actions,
		setAmount,
		clearCart
	}
}

