import { configureStore, isAnyOf } from "@reduxjs/toolkit"
import { useDispatch, useSelector, useStore } from "react-redux"
import { cartSlice, clearCart, setAmount, setCart } from "./cartSlice";
import { clearSaved, savedSlice, toggleSaved } from "./savedSlice";
import { setVote, votesSlice } from "./votesSlice";
import { listenerMiddleware } from "./helper";
import { authSlice } from "./authSlice";
import { resolveCartConflict } from "@/helpers/resolveCartConflict";
import { error, toast } from "@/components/ui/use-toast";


export const makeStore = (props: { saved: { saved: number[] }, votes: { votes: Record<number, number> }, cart: { items: Record<number, number> } }) => {
	const store = configureStore({

		reducer: {
			saved: savedSlice.reducer,
			votes: votesSlice.reducer,
			cart: cartSlice.reducer,
			auth: authSlice.reducer,
		},
		preloadedState: {
			...props,
		},
		middleware(getDefaultMiddleware) {
			return getDefaultMiddleware().prepend(listenerMiddleware.middleware)
		},
	})
	if (typeof window !== "undefined") {
		setTimeout(() => {

			const localCartString = localStorage.getItem("cart")
			if (!localCartString) return
			let localCart: Record<number, number>
			try {
				localCart = JSON.parse(localCartString)
			} catch {
				localStorage.setItem("cart", "")
				return
			}

			const res = resolveCartConflict(props.cart.items, localCart)
			if (!res) return
			if ("mergedCarts" in res) {
				const t = toast({
					description: `There are still ${Object.keys(localCart).length} items in your local cart. Which cart would you like to use?`,
					title: "Cart Conflict",
					duration: 10000,
					actions: [
						{
							name: "Local",
							onClick: () => {
								store.dispatch(setCart(res.localCart))
								t.dismiss()
							}
						},
						{
							name: "Merged",
							onClick: () => {
								store.dispatch(setCart(res.mergedCarts))
								t.dismiss()
							}
						},
						{
							name: "Remote",
							onClick: () => {
								t.dismiss()
							}
						},
					],
				})
			} else if (res)
				store.dispatch(setCart(res))

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
	auth: {
		...authSlice.actions
	}
}

function isError(val: unknown): val is { error: string, title: string } {
	if (val && typeof val === "object"
		&& "error" in val && typeof val.error === "string"
		&& "title" in val && typeof val.title === "string")
		return true
	return false
}

listenerMiddleware.startListening.withTypes<RootState>()({
	actionCreator: authSlice.actions.setUser,
	effect: (act, api) => {
		if (!act.payload.id) {
			api.dispatch(cartSlice.actions._clearCart())
		}
	}
})

listenerMiddleware.startListening.withTypes<RootState>()({
	actionCreator: cartSlice.actions._clearCart,
	effect: () => {
		localStorage.setItem("cart", "")
	}
})

listenerMiddleware.startListening.withTypes<RootState>()({
	matcher: isAnyOf(
		actions.cart.setAmount.rejected, actions.cart.clearCart.rejected,
		actions.saved.clearSaved.rejected, actions.saved.toggleSaved.rejected,
		actions.votes.setVote.rejected
	),
	effect: (act, api) => {
		if ("payload" in act) {
			if (isError(act.payload)) {
				error(act.payload)
			} else {
				error({ title: "Unknown Error", error: "Unknown Error Occured" })
			}
		}

	}
})

listenerMiddleware.startListening.withTypes<RootState>()({
	matcher: isAnyOf(actions.cart.setAmount.fulfilled, actions.cart.clearCart.fulfilled),
	effect: (act, api) => {
		localStorage.setItem("cart", JSON.stringify(api.getState().cart.items))
	}
})
