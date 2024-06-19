import { UnknownAction, combineReducers, configureStore, isAnyOf } from "@reduxjs/toolkit"
import { useDispatch, useSelector, useStore } from "react-redux"
import { cartSlice, clearCart, setAmount, setCart } from "./cartSlice";
import { clearSaved, savedSlice, toggleSaved } from "./savedSlice";
import { setVote, votesSlice } from "./votesSlice";
import { listenerMiddleware } from "./listeners";

const appReducers = combineReducers({
	saved: savedSlice.reducer,
	votes: votesSlice.reducer,
	cart: cartSlice.reducer,
})

const wrapedReducers = ((state: RootState, action: UnknownAction) => {
	if (action.type === "reset") {
		state = action.payload as RootState
	}
	return appReducers(state, action)
}) as typeof appReducers

export const makeStore = (props: { saved: { saved: number[] }, votes: { votes: Record<number, number> }, cart: { items: Record<number, number> } }) => {
	const store = configureStore({
		reducer: wrapedReducers,
		preloadedState: {
			...props,
		},
		middleware(getDefaultMiddleware) {
			return getDefaultMiddleware().prepend(listenerMiddleware.middleware)
		},
	})
	if (typeof window !== "undefined") {
		setTimeout(() => {
		}, 1000)
	}
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
		clearCart,
		setCart
	},
	reset: (state: RootState) => ({ type: "reset", payload: state })
}
